export const MAX_HEARTS = 5;
export const XP_PER_FIRST_TRY = 2;
export const LESSON_BONUS = 5;
export const PERFECT_BONUS = 5;
export const DAILY_GOAL_XP = 30;
export const BADGE_IDS = ["first_lesson", "perfect", "streak_3", "streak_7", "five_lessons", "exam_pass"] as const;
export const WEEKEND_BOOST = 1.5;
export const EXAM_PASS_PERCENT = 70;
export type BadgeId = (typeof BADGE_IDS)[number];

/** Weekend event: Saturdays and Sundays earn 1.5x XP. Pure function of the calendar day, so server and browser agree. */
export function xpMultiplier(day?: string): number {
  if (!day) return 1;
  const [y, m, d] = day.split("-").map(Number);
  const w = new Date(y, m - 1, d).getDay();
  return w === 0 || w === 6 ? WEEKEND_BOOST : 1;
}
export function lessonXp(firstTryCorrect: number, total: number, day?: string): number {
  const base = Math.max(0, Math.min(firstTryCorrect, total)) * XP_PER_FIRST_TRY + LESSON_BONUS;
  return Math.round((firstTryCorrect >= total ? base + PERFECT_BONUS : base) * xpMultiplier(day));
}
export function dayKey(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
export function previousDay(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return dayKey(new Date(y, m - 1, d - 1));
}
export function nextStreak(count: number, lastDay: string | null, today: string): number {
  if (lastDay === today) return Math.max(count, 1);
  return lastDay === previousDay(today) ? count + 1 : 1;
}
export function earnedBadges(a: { completedCount: number; perfect: boolean; streak: number }): BadgeId[] {
  const out: BadgeId[] = [];
  if (a.completedCount >= 1) out.push("first_lesson");
  if (a.perfect) out.push("perfect");
  if (a.completedCount >= 5) out.push("five_lessons");
  if (a.streak >= 3) out.push("streak_3");
  if (a.streak >= 7) out.push("streak_7");
  return out;
}

/** Levels get further apart: level n starts at 25 * (n-1)^2 XP. */
export function levelFor(xp: number) {
  const level = Math.floor(Math.sqrt(Math.max(0, xp) / 25)) + 1;
  const floor = (level - 1) ** 2 * 25; const ceil = level ** 2 * 25;
  return { level, into: xp - floor, span: ceil - floor, toNext: ceil - xp };
}
