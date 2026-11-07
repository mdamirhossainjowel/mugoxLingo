import { storageKey } from "@/lib/brand";
import { z } from "zod";

export const FLASHCARD_KEY = storageKey("flashcards");
export const flashcardSchema = z.object({ version: z.literal(1), cards: z.record(z.string(), z.object({ box: z.union([z.literal(1), z.literal(2), z.literal(3)]) })) });
export type FlashcardStore = z.infer<typeof flashcardSchema>;
export const emptyFlashcards = (): FlashcardStore => ({ version: 1, cards: {} });

export const ACTIVITY_KEY = storageKey("activity");
export const activitySchema = z.object({
  version: z.literal(1), day: z.string().nullable(), cardsReviewed: z.number().int().min(0), speedRounds: z.number().int().min(0),
  bestSpeed: z.number().int().min(0), chestDay: z.string().nullable(),
});
export type ActivityStore = z.infer<typeof activitySchema>;
export const emptyActivity = (): ActivityStore => ({ version: 1, day: null, cardsReviewed: 0, speedRounds: 0, bestSpeed: 0, chestDay: null });
/** Daily counters reset when the local day changes; bestSpeed and chestDay persist. */
export const forToday = (a: ActivityStore, today: string): ActivityStore => a.day === today ? a : { ...a, day: today, cardsReviewed: 0, speedRounds: 0 };

export const EXAMS_KEY = storageKey("exams");
export const examsSchema = z.object({ version: z.literal(1), attempts: z.array(z.object({ unitId: z.string(), percent: z.number().int().min(0).max(100), passed: z.boolean(), at: z.number() })).max(30) });
export type ExamsStore = z.infer<typeof examsSchema>;
export const emptyExams = (): ExamsStore => ({ version: 1, attempts: [] });
export function examBestFromLocal(s: ExamsStore): Record<string, { best: number; attempts: number; passed: boolean }> {
  const out: Record<string, { best: number; attempts: number; passed: boolean }> = {};
  for (const a of s.attempts) { const c = out[a.unitId] ?? { best: 0, attempts: 0, passed: false }; out[a.unitId] = { best: Math.max(c.best, a.percent), attempts: c.attempts + 1, passed: c.passed || a.passed }; }
  return out;
}
