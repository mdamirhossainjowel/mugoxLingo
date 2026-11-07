"use server";
import { z } from "zod";
import { logFail } from "@/lib/log";
import { courses, getCourse, getLesson } from "@/content/courses";
import { dayKey } from "@/features/gamification/rules";
import { query, isDbConfigured } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current";
import { computeCompletion, planGuestMigration, scoreAnswers } from "./server-logic";
import { buildExam, scoreExam, seedPattern, type ExamResult } from "@/features/exam/logic";

export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: "not_configured" | "unauthenticated" | "invalid" | "rate_limited" | "server" };
const fail = (error: Extract<ActionResult<never>, { ok: false }>["error"]): ActionResult<never> => ({ ok: false, error });

const MAX_COMPLETIONS_PER_DAY = 40;
const hits = new Map<string, number[]>(); // per-instance burst limiter; the daily cap below is enforced in the database
function limited(userId: string, max = 12, windowMs = 60_000) {
  const now = Date.now(); const recent = (hits.get(userId) ?? []).filter((t) => now - t < windowMs);
  recent.push(now); hits.set(userId, recent); return recent.length > max;
}
/** null = database not set up, undefined = signed out, otherwise the signed-in user. */
async function session() {
  if (!isDbConfigured()) return null;
  return (await getCurrentUser()) ?? undefined;
}
const todaySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((d) => Math.abs(Date.parse(d) - Date.now()) < 2 * 86_400_000);

const RECORD_LESSON = "select record_lesson_completion($1::uuid, $2::text, $3::text, $4::text, $5::int, $6::int, $7::int, $8::date, $9::int, $10::text[]) as r";

const completeSchema = z.object({
  courseId: z.string().max(40), lessonId: z.string().max(60), attemptId: z.string().min(8).max(80),
  today: todaySchema, answers: z.record(z.string().max(40), z.unknown()),
});
export async function completeLessonAction(input: unknown): Promise<ActionResult<{ xpGained: number; newBadges: string[]; duplicate: boolean }>> {
  const parsed = completeSchema.safeParse(input);
  if (!parsed.success) return fail("invalid");
  const user = await session();
  if (user === null) return fail("not_configured");
  if (!user) return fail("unauthenticated");
  if (limited(user.id)) return fail("rate_limited");
  const { courseId, lessonId, attemptId, today, answers } = parsed.data;
  const course = getCourse(courseId); const lesson = course && getLesson(course, lessonId);
  if (!lesson) return fail("invalid");
  try {
    const [streak, badges, done, daily] = await Promise.all([
      query<{ current_count: number; last_day: string | null }>("select current_count, last_day::text as last_day from user_streaks where user_id = $1", [user.id]),
      query<{ badge_id: string }>("select badge_id from user_achievements where user_id = $1", [user.id]),
      query<{ lesson_id: string }>("select lesson_id from user_lesson_progress where user_id = $1", [user.id]),
      query<{ n: number }>("select count(*)::int as n from lesson_completions where user_id = $1 and day = $2::date", [user.id, today]),
    ]);
    if ((daily[0]?.n ?? 0) >= MAX_COMPLETIONS_PER_DAY) return fail("rate_limited");
    const { firstTryCorrect, total } = scoreAnswers(lesson, answers);
    const c = computeCompletion({
      streakCount: streak[0]?.current_count ?? 0, lastDay: streak[0]?.last_day ?? null,
      badges: badges.map((b) => b.badge_id), completedLessonIds: done.map((d) => d.lesson_id),
    }, lessonId, firstTryCorrect, total, today);
    const rows = await query<{ r: { duplicate?: boolean } }>(RECORD_LESSON, [user.id, attemptId, courseId, lessonId, firstTryCorrect, total, c.xp, today, c.streak, c.newBadges]);
    const dup = Boolean(rows[0]?.r?.duplicate);
    return { ok: true, data: { xpGained: dup ? 0 : c.xp, newBadges: dup ? [] : c.newBadges, duplicate: dup } };
  } catch (e) { logFail("completeLessonAction", e); return fail("server"); }
}

export async function migrateGuestAction(raw: unknown): Promise<ActionResult<{ imported: number; xpGained: number }>> {
  const user = await session();
  if (user === null) return fail("not_configured");
  if (!user) return fail("unauthenticated");
  if (limited(user.id, 3)) return fail("rate_limited");
  try {
    const [done, badges] = await Promise.all([
      query<{ lesson_id: string }>("select lesson_id from user_lesson_progress where user_id = $1", [user.id]),
      query<{ badge_id: string }>("select badge_id from user_achievements where user_id = $1", [user.id]),
    ]);
    const items = planGuestMigration(raw, done.map((d) => d.lesson_id));
    const day = dayKey(new Date()); const have = new Set(badges.map((b) => b.badge_id));
    let xpGained = 0, imported = 0;
    for (const it of items) {
      const newBadges = it.badges.filter((b) => !have.has(b)); newBadges.forEach((b) => have.add(b));
      const rows = await query<{ r: { duplicate?: boolean } }>(RECORD_LESSON, [user.id, it.attemptId, it.courseId, it.lessonId, it.correct, it.total, it.xp, day, null, newBadges]);
      if (!rows[0]?.r?.duplicate) { imported++; xpGained += it.xp; }
    }
    return { ok: true, data: { imported, xpGained } };
  } catch (e) { logFail("migrateGuestAction", e); return fail("server"); }
}

export async function resetCourseAction(courseId: unknown): Promise<ActionResult<null>> {
  const id = z.string().max(40).safeParse(courseId);
  if (!id.success || !courses.some((c) => c.id === id.data)) return fail("invalid");
  const user = await session();
  if (user === null) return fail("not_configured");
  if (!user) return fail("unauthenticated");
  try {
    await query("delete from user_lesson_progress where user_id = $1 and course_id = $2", [user.id, id.data]);
    return { ok: true, data: null };
  } catch (e) { logFail("resetCourseAction", e); return fail("server"); }
}

const examSchema = z.object({
  courseId: z.string().max(40), unitId: z.string().max(40), seed: z.string().regex(seedPattern),
  answers: z.record(z.string().max(40), z.unknown()), durationSeconds: z.number().int().min(0).max(86_400),
});
/** Re-creates the exam from its seed, grades it on the server, and stores the attempt. Needs every unit lesson completed. */
export async function submitExamAction(input: unknown): Promise<ActionResult<{ result: ExamResult; newBadge: boolean; duplicate: boolean }>> {
  const parsed = examSchema.safeParse(input);
  if (!parsed.success) return fail("invalid");
  const user = await session();
  if (user === null) return fail("not_configured");
  if (!user) return fail("unauthenticated");
  if (limited(user.id, 6)) return fail("rate_limited");
  const { courseId, unitId, seed, answers, durationSeconds } = parsed.data;
  const unit = getCourse(courseId)?.units.find((u) => u.id === unitId);
  if (!unit) return fail("invalid");
  try {
    const done = await query<{ lesson_id: string }>("select lesson_id from user_lesson_progress where user_id = $1", [user.id]);
    const have = new Set(done.map((d) => d.lesson_id));
    if (!unit.lessons.every((l) => have.has(l.id))) return fail("invalid");
    const result = scoreExam(buildExam(unit, seed), answers);
    const rows = await query<{ r: { duplicate?: boolean; new_badge?: boolean } }>(
      "select record_exam_attempt($1::uuid, $2::text, $3::text, $4::text, $5::int, $6::int, $7::int, $8::boolean, $9::int) as r",
      [user.id, courseId, unitId, seed, result.score, result.total, result.percent, result.passed, durationSeconds]);
    const r = rows[0]?.r ?? {};
    return { ok: true, data: { result, newBadge: Boolean(r.new_badge), duplicate: Boolean(r.duplicate) } };
  } catch (e) { logFail("submitExamAction", e); return fail("server"); }
}
