import type { Lesson } from "@/types/course";
import { courses, allLessons, scoredExercises } from "@/content/courses";
import { checkAnswer } from "@/features/exercises/check";
import { responseSchema } from "@/features/exercises/schema";
import { earnedBadges, lessonXp, nextStreak } from "@/features/gamification/rules";
import { guestSchema } from "./guest-core";

/** Recomputes first-try correctness from trusted lesson data. Missing/invalid answers count as wrong. */
export function scoreAnswers(lesson: Lesson, answers: Record<string, unknown>): { firstTryCorrect: number; total: number } {
  let ok = 0;
  const scored = scoredExercises(lesson);
  for (const ex of scored) {
    const parsed = responseSchema.safeParse(answers[ex.id]);
    if (parsed.success && checkAnswer(ex, parsed.data).correct) ok++;
  }
  return { firstTryCorrect: ok, total: scored.length };
}

export interface AccountState { streakCount: number; lastDay: string | null; badges: string[]; completedLessonIds: string[] }

export function computeCompletion(s: AccountState, lessonId: string, firstTryCorrect: number, total: number, today: string) {
  const streak = nextStreak(s.streakCount, s.lastDay, today);
  const completedCount = new Set([...s.completedLessonIds, lessonId]).size;
  const earned = earnedBadges({ completedCount, perfect: firstTryCorrect >= total, streak });
  return { xp: lessonXp(firstTryCorrect, total, today), streak, newBadges: earned.filter((b) => !s.badges.includes(b)) };
}

export interface MigrationItem { courseId: string; lessonId: string; correct: number; total: number; xp: number; attemptId: string; badges: string[] }

/**
 * Turns untrusted guest data into a safe import plan. The guest's own XP/streak numbers are ignored:
 * XP is recomputed per lesson from validated best scores. Already-completed lessons are never re-awarded.
 */
export function planGuestMigration(raw: unknown, existingLessonIds: string[]): MigrationItem[] {
  const parsed = guestSchema.safeParse(raw);
  if (!parsed.success) return [];
  const have = new Set(existingLessonIds);
  const items: MigrationItem[] = [];
  for (const [lessonId, rec] of Object.entries(parsed.data.completed)) {
    const course = courses.find((c) => allLessons(c).some((l) => l.id === lessonId));
    const lesson = course && allLessons(course).find((l) => l.id === lessonId);
    if (!course || !lesson || have.has(lessonId)) continue;
    const total = scoredExercises(lesson).length;
    if (rec.bestTotal !== total || rec.bestCorrect > total) continue;
    const completedCount = have.size + items.length + 1;
    items.push({
      courseId: course.id, lessonId, correct: rec.bestCorrect, total, xp: lessonXp(rec.bestCorrect, total),
      attemptId: `migrate:${lessonId}`, badges: earnedBadges({ completedCount, perfect: rec.bestCorrect >= total, streak: 0 }),
    });
  }
  return items;
}
