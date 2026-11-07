import type { Exercise, Unit } from "@/types/course";
import { checkAnswer } from "@/features/exercises/check";
import { responseSchema } from "@/features/exercises/schema";
import { seededShuffle } from "@/features/exercises/shared";
import { EXAM_PASS_PERCENT } from "@/features/gamification/rules";

export const EXAM_MAX_QUESTIONS = 10;
export const seedPattern = /^[A-Za-z0-9-]{8,64}$/;

export const examPool = (unit: Unit): Exercise[] => unit.lessons.flatMap((l) => l.exercises).filter((e) => e.type !== "listen");

/** Same seed + same unit always gives the same questions, so the server can re-create and grade the exam itself. */
export function buildExam(unit: Unit, seed: string): Exercise[] {
  return seededShuffle(examPool(unit), seed).slice(0, EXAM_MAX_QUESTIONS);
}
export const examMinutes = (questions: number) => Math.max(3, Math.ceil(questions * 0.75));

export interface ExamReviewItem { id: string; prompt: string; type: Exercise["type"]; correct: boolean; expected: string }
export interface ExamResult {
  score: number; total: number; percent: number; passed: boolean;
  byType: Partial<Record<Exercise["type"], { correct: number; total: number }>>; review: ExamReviewItem[];
}

export function scoreExam(questions: Exercise[], answers: Record<string, unknown>): ExamResult {
  const byType: ExamResult["byType"] = {}; const review: ExamReviewItem[] = []; let score = 0;
  for (const q of questions) {
    const parsed = responseSchema.safeParse(answers[q.id]);
    const r = parsed.success ? checkAnswer(q, parsed.data) : { correct: false, expected: checkAnswer(q, { type: "translate", text: "" }).expected };
    if (r.correct) score++;
    const t = (byType[q.type] ??= { correct: 0, total: 0 }); t.total++; if (r.correct) t.correct++;
    review.push({ id: q.id, prompt: q.prompt, type: q.type, correct: r.correct, expected: r.expected });
  }
  const total = questions.length; const percent = total ? Math.round((score / total) * 100) : 0;
  return { score, total, percent, passed: percent >= EXAM_PASS_PERCENT, byType, review };
}
export const gradeTier = (percent: number): "ace" | "pass" | "close" | "again" =>
  percent >= 90 ? "ace" : percent >= EXAM_PASS_PERCENT ? "pass" : percent >= 50 ? "close" : "again";
