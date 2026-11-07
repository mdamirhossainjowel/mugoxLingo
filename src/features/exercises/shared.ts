import type { Exercise, ExerciseResponse } from "@/types/course";
import type { Ui } from "@/i18n/ui";

export interface RendererProps<T extends Exercise = Exercise> {
  exercise: T; locked: boolean; ui: Ui; active?: boolean; onChange: (r: ExerciseResponse | null) => void;
}
/** Deterministic shuffle so server and client render the same order. */
export function seededShuffle<T>(items: T[], seed: string): T[] {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    const j = h % (i + 1); [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
export const cardCls = "rounded-[var(--radius-bubble)] bg-white shadow-[0_6px_0_#d9d0f0]";
export const optionCls = (state: "idle" | "picked") =>
  `min-h-14 w-full rounded-2xl border-4 px-4 py-3 text-left font-display text-xl font-bold transition-colors ${
    state === "picked" ? "border-lagoon bg-lagoon/15" : "border-mist bg-white hover:border-plum/30"}`;
