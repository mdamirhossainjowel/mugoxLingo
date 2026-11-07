import { z } from "zod";
import { storageKey } from "@/lib/brand";
import { dayKey, earnedBadges, lessonXp, nextStreak, type BadgeId } from "@/features/gamification/rules";

export const STORAGE_KEY = storageKey("guest-progress");
export const guestSchema = z.object({
  version: z.literal(1),
  xp: z.number().int().min(0),
  streak: z.object({ count: z.number().int().min(0), lastDay: z.string().nullable() }),
  daily: z.object({ day: z.string().nullable(), xp: z.number().int().min(0) }),
  completed: z.record(z.string(), z.object({ times: z.number().int().min(1), bestCorrect: z.number().int().min(0), bestTotal: z.number().int().min(1) })),
  badges: z.array(z.string()),
  appliedAttempts: z.array(z.string()).max(30),
});
export type GuestProgress = z.infer<typeof guestSchema>;

export const emptyProgress = (): GuestProgress => ({
  version: 1, xp: 0, streak: { count: 0, lastDay: null }, daily: { day: null, xp: 0 }, completed: {}, badges: [], appliedAttempts: [],
});
export function parseProgress(raw: string | null): GuestProgress {
  if (!raw) return emptyProgress();
  try { const p = guestSchema.safeParse(JSON.parse(raw)); return p.success ? p.data : emptyProgress(); } catch { return emptyProgress(); }
}
export function loadGuest(): { state: GuestProgress; ok: boolean } {
  try { return { state: parseProgress(window.localStorage.getItem(STORAGE_KEY)), ok: true }; }
  catch { return { state: emptyProgress(), ok: false }; }
}
export function saveGuest(s: GuestProgress): boolean {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); return true; } catch { return false; }
}

export interface CompletionInput { attemptId: string; lessonId: string; firstTryCorrect: number; total: number; today?: string }
export interface CompletionResult { state: GuestProgress; xpGained: number; newBadges: BadgeId[]; duplicate: boolean }

/** Pure reducer. Applying the same attemptId twice never awards XP twice. */
export function applyCompletion(s: GuestProgress, i: CompletionInput): CompletionResult {
  if (s.appliedAttempts.includes(i.attemptId)) return { state: s, xpGained: 0, newBadges: [], duplicate: true };
  const today = i.today ?? dayKey(new Date());
  const xpGained = lessonXp(i.firstTryCorrect, i.total, today);
  const prev = s.completed[i.lessonId];
  const completed = { ...s.completed, [i.lessonId]: {
    times: (prev?.times ?? 0) + 1, bestCorrect: Math.max(prev?.bestCorrect ?? 0, i.firstTryCorrect), bestTotal: i.total } };
  const streakCount = nextStreak(s.streak.count, s.streak.lastDay, today);
  const dailyXp = (s.daily.day === today ? s.daily.xp : 0) + xpGained;
  const earned = earnedBadges({ completedCount: Object.keys(completed).length, perfect: i.firstTryCorrect >= i.total, streak: streakCount });
  const newBadges = earned.filter((b) => !s.badges.includes(b));
  return {
    duplicate: false, xpGained, newBadges,
    state: { ...s, xp: s.xp + xpGained, streak: { count: streakCount, lastDay: today }, daily: { day: today, xp: dailyXp },
      completed, badges: [...s.badges, ...newBadges], appliedAttempts: [...s.appliedAttempts, i.attemptId].slice(-30) },
  };
}

