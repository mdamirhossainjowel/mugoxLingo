import { query } from "@/lib/db";
import { emptyProgress, type GuestProgress } from "./guest-core";

/** Reads one user's progress in the same shape the UI uses for guests. Every query is filtered by the user id. */
export async function getServerProgress(userId: string): Promise<GuestProgress> {
  const [xp, streak, lessons, badges, ledger] = await Promise.all([
    query<{ xp_total: number }>("select xp_total from users where id = $1", [userId]),
    query<{ current_count: number; last_day: string | null }>("select current_count, last_day::text as last_day from user_streaks where user_id = $1", [userId]),
    query<{ lesson_id: string; times: number; best_correct: number; best_total: number }>("select lesson_id, times, best_correct, best_total from user_lesson_progress where user_id = $1", [userId]),
    query<{ badge_id: string }>("select badge_id from user_achievements where user_id = $1", [userId]),
    query<{ amount: number; day: string }>("select amount, day::text as day from xp_ledger where user_id = $1 order by day desc limit 50", [userId]),
  ]);
  const s = emptyProgress();
  s.xp = xp[0]?.xp_total ?? 0;
  s.streak = { count: streak[0]?.current_count ?? 0, lastDay: streak[0]?.last_day ?? null };
  for (const r of lessons) s.completed[r.lesson_id] = { times: r.times, bestCorrect: r.best_correct, bestTotal: r.best_total };
  s.badges = badges.map((b) => b.badge_id);
  const latest = ledger[0]?.day ?? null;
  s.daily = { day: latest, xp: ledger.filter((r) => r.day === latest).reduce((n, r) => n + r.amount, 0) };
  return s;
}

export interface ExamBest { best: number; attempts: number; passed: boolean }
export async function getExamBest(userId: string): Promise<Record<string, ExamBest>> {
  const rows = await query<{ unit_id: string; best: number; attempts: number; passed: boolean }>(
    "select unit_id, max(percent)::int as best, count(*)::int as attempts, bool_or(passed) as passed from exam_attempts where user_id = $1 group by unit_id", [userId]);
  return Object.fromEntries(rows.map((r) => [r.unit_id, { best: r.best, attempts: r.attempts, passed: r.passed }]));
}
