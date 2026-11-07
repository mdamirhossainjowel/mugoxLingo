export type Exercise =
  | { id: string; type: "mcq"; prompt: string; choices: string[]; answer: number; explain?: string; say?: string }
  | { id: string; type: "listen"; prompt: string; say: string; lang?: string; choices: string[]; answer: number; explain?: string }
  | { id: string; type: "fill"; prompt: string; before: string; after: string; choices: string[]; answer: number; explain?: string }
  | { id: string; type: "match"; prompt: string; pairs: { left: string; right: string }[] }
  | { id: string; type: "build"; prompt: string; tiles: string[]; answer: string[]; explain?: string }
  | { id: string; type: "translate"; prompt: string; accepted: string[]; explain?: string };

export type ExerciseResponse =
  | { type: "mcq" | "fill" | "listen"; choice: number }
  | { type: "match"; pairs: [string, string][] }
  | { type: "build"; tokens: string[] }
  | { type: "translate"; text: string };

export interface CheckResult { correct: boolean; expected: string }
export interface VocabItem { term: string; meaning: string }
export interface Lesson { id: string; title: string; objective: string; vocab?: VocabItem[]; exercises: Exercise[] }
export interface Unit { id: string; title: string; lessons: Lesson[] }
export interface Course { id: string; from: string; to: string; ttsLang?: string; title: string; status: "full" | "demo"; units: Unit[] }
