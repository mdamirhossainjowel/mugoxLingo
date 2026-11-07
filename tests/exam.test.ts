import { describe, expect, it } from "vitest";
import { getCourse } from "@/content/courses";
import { buildExam, scoreExam, seedPattern, gradeTier } from "@/features/exam/logic";
import { checkAnswer } from "@/features/exercises/check";
import type { Exercise, ExerciseResponse } from "@/types/course";

const unit = getCourse("en-es")!.units[0];
const correctFor = (q: Exercise): ExerciseResponse => {
  switch (q.type) {
    case "mcq": case "fill": case "listen": return { type: q.type, choice: q.answer };
    case "match": return { type: "match", pairs: q.pairs.map((p) => [p.left, p.right]) };
    case "build": return { type: "build", tokens: q.answer };
    case "translate": return { type: "translate", text: q.accepted[0] };
  }
};

describe("exam pool", () => {
  it("never includes listening questions", () => {
    const zh = getCourse("en-zh")!.units[0];
    for (let n = 0; n < 5; n++) expect(buildExam(zh, `seed-zzzz-000${n}`).every((q) => q.type !== "listen")).toBe(true);
  });
});

describe("exam", () => {
  it("is deterministic per seed and differs across seeds", () => {
    expect(buildExam(unit, "seed-aaaa-1111").map((q) => q.id)).toEqual(buildExam(unit, "seed-aaaa-1111").map((q) => q.id));
    expect(buildExam(unit, "seed-aaaa-1111").map((q) => q.id)).not.toEqual(buildExam(unit, "seed-bbbb-2222").map((q) => q.id));
    expect(buildExam(unit, "seed-aaaa-1111")).toHaveLength(10);
  });
  it("grades a perfect paper, a blank paper and a tampered paper", () => {
    const qs = buildExam(unit, "seed-aaaa-1111");
    const perfect = Object.fromEntries(qs.map((q) => [q.id, correctFor(q)]));
    expect(scoreExam(qs, perfect)).toMatchObject({ score: 10, percent: 100, passed: true });
    expect(scoreExam(qs, {})).toMatchObject({ score: 0, percent: 0, passed: false });
    expect(scoreExam(qs, { percent: 100, score: 10 }).passed).toBe(false);
    qs.forEach((q) => expect(checkAnswer(q, correctFor(q)).correct).toBe(true));
  });
  it("passes at 70% and fails just below", () => {
    const qs = buildExam(unit, "seed-aaaa-1111");
    const seven = Object.fromEntries(qs.slice(0, 7).map((q) => [q.id, correctFor(q)]));
    const six = Object.fromEntries(qs.slice(0, 6).map((q) => [q.id, correctFor(q)]));
    expect(scoreExam(qs, seven).passed).toBe(true);
    expect(scoreExam(qs, six).passed).toBe(false);
    expect(gradeTier(95)).toBe("ace"); expect(gradeTier(70)).toBe("pass"); expect(gradeTier(55)).toBe("close"); expect(gradeTier(10)).toBe("again");
  });
  it("validates seed format", () => {
    expect(seedPattern.test("seed-aaaa-1111")).toBe(true);
    expect(seedPattern.test("short")).toBe(false);
    expect(seedPattern.test("bad seed;drop")).toBe(false);
  });
});
