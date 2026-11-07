import type { CheckResult, Exercise, ExerciseResponse } from "@/types/course";

/** Accent-insensitive on vowels, but keeps ñ and non-Latin scripts intact. */
export function normalize(s: string): string {
  return s.normalize("NFD").replace(/[\u0300\u0301\u0304\u0308\u030C]/g, "").normalize("NFC")
    .toLowerCase().replace(/[¿¡?!.,;:'"“”।、。？！，]/g, "").replace(/[1-5]/g, "").replace(/\s+/g, " ").trim();
}
/** Whitespace-insensitive so "zai jian", "zàijiàn" and "zài jiàn" are the same answer. */
const compact = (s: string) => normalize(s).replace(/\s/g, "");

/** Pure and trusted: the only place that decides correctness. Reused server-side in Phase 4. */
export function checkAnswer(ex: Exercise, res: ExerciseResponse): CheckResult {
  switch (ex.type) {
    case "mcq": return { correct: res.type === "mcq" && res.choice === ex.answer, expected: ex.choices[ex.answer] };
    case "listen": return { correct: res.type === "listen" && res.choice === ex.answer, expected: ex.choices[ex.answer] };
    case "fill": return {
      correct: res.type === "fill" && res.choice === ex.answer,
      expected: `${ex.before} ${ex.choices[ex.answer]} ${ex.after}`.replace(/\s+/g, " ").trim(),
    };
    case "match": {
      const expected = ex.pairs.map((p) => `${p.left} = ${p.right}`).join(", ");
      if (res.type !== "match" || res.pairs.length !== ex.pairs.length) return { correct: false, expected };
      const ok = res.pairs.every(([l, r]) => ex.pairs.some((p) => p.left === l && p.right === r));
      return { correct: ok && new Set(res.pairs.map(([l]) => l)).size === ex.pairs.length, expected };
    }
    case "build": return {
      correct: res.type === "build" && res.tokens.length === ex.answer.length && res.tokens.every((t, i) => t === ex.answer[i]),
      expected: ex.answer.join(" "),
    };
    case "translate": return {
      correct: res.type === "translate" && ex.accepted.some((a) => compact(a) === compact(res.text)),
      expected: ex.accepted[0],
    };
  }
}
