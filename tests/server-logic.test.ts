import { describe, expect, it } from "vitest";
import { getCourse, getLesson } from "@/content/courses";
import { planGuestMigration, scoreAnswers, computeCompletion } from "@/features/progress/server-logic";
import { lessonXp } from "@/features/gamification/rules";

const lesson = getLesson(getCourse("en-es")!, "es-greetings-1")!;
const perfect = {
  "g1-1": { type: "mcq", choice: 0 }, "g1-2": { type: "mcq", choice: 1 },
  "g1-3": { type: "match", pairs: [["Hola", "Hello"], ["Adiós", "Goodbye"], ["Gracias", "Thank you"], ["Por favor", "Please"]] },
  "g1-4": { type: "fill", choice: 0 }, "g1-5": { type: "build", tokens: ["Me", "llamo", "Ana"] },
  "g1-6": { type: "translate", text: "gracias" }, "g1-7": { type: "mcq", choice: 1 },
};

describe("scoreAnswers (server recomputes correctness)", () => {
  it("scores a perfect run", () => expect(scoreAnswers(lesson, perfect)).toEqual({ firstTryCorrect: 7, total: 7 }));
  it("ignores a client claim: wrong/missing/garbage answers score zero", () => {
    expect(scoreAnswers(lesson, {}).firstTryCorrect).toBe(0);
    expect(scoreAnswers(lesson, { "g1-1": { type: "mcq", choice: 3 }, "g1-2": "yes", "g1-3": null, firstTryCorrect: 7 }).firstTryCorrect).toBe(0);
  });
  it("rejects a response of the wrong type", () => {
    expect(scoreAnswers(lesson, { ...perfect, "g1-1": { type: "translate", text: "Hello" } }).firstTryCorrect).toBe(6);
  });
});

describe("listening exercises are practice only", () => {
  const tones = getLesson(getCourse("en-zh")!, "zh-tones-1")!;
  it("score only counts non-listening exercises", () => {
    const listen = tones.exercises.filter((e) => e.type === "listen").length;
    expect(listen).toBe(1);
    expect(scoreAnswers(tones, {}).total).toBe(tones.exercises.length - listen);
    expect(scoreAnswers(tones, { "zt-3": { type: "listen", choice: 2 } }).firstTryCorrect).toBe(0);
  });
});

describe("computeCompletion", () => {
  it("only reports badges not already held", () => {
    const s = { streakCount: 0, lastDay: null, badges: ["first_lesson"], completedLessonIds: ["x"] };
    const r = computeCompletion(s, "y", 7, 7, "2026-10-10");
    expect(r.newBadges).toEqual(["perfect"]);
    expect(r.xp).toBe(lessonXp(7, 7, "2026-10-10"));
  });
});

describe("planGuestMigration", () => {
  const rec = (c: number, t: number) => ({ times: 1, bestCorrect: c, bestTotal: t });
  const guest = (completed: Record<string, unknown>, xp = 999999) => ({
    version: 1, xp, streak: { count: 400, lastDay: "2026-10-10" }, daily: { day: null, xp: 0 }, completed, badges: ["streak_3"], appliedAttempts: [],
  });
  it("ignores guest XP/streak numbers and recomputes per lesson", () => {
    const plan = planGuestMigration(guest({ "es-greetings-1": rec(7, 7) }), []);
    expect(plan).toHaveLength(1);
    expect(plan[0].xp).toBe(lessonXp(7, 7));
    expect(plan[0].attemptId).toBe("migrate:es-greetings-1");
  });
  it("drops unknown lessons, forged scores and lessons the account already has", () => {
    const plan = planGuestMigration(guest({ nope: rec(7, 7), "es-greetings-1": rec(70, 7), "es-greetings-2": rec(5, 99), "bn-first-1": rec(5, 5) }), ["bn-first-1"]);
    expect(plan).toEqual([]);
  });
  it("returns nothing for malformed payloads", () => {
    expect(planGuestMigration("garbage", [])).toEqual([]);
    expect(planGuestMigration({ version: 2 }, [])).toEqual([]);
  });
});
