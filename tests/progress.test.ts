import { describe, expect, it } from "vitest";
import { applyCompletion, emptyProgress, parseProgress } from "@/features/progress/guest";
import { earnedBadges, levelFor, lessonXp, nextStreak } from "@/features/gamification/rules";

const base = { lessonId: "l1", firstTryCorrect: 7, total: 7 };

describe("weekend boost event", () => {
  it("pays 1.5x on Saturday and Sunday only", () => {
    expect(lessonXp(7, 7, "2026-10-12")).toBe(24); // Monday
    expect(lessonXp(7, 7, "2026-10-10")).toBe(36); // Saturday
    expect(lessonXp(7, 7, "2026-10-11")).toBe(36); // Sunday
    expect(lessonXp(7, 7)).toBe(24);
  });
});

describe("guest progress", () => {
  it("awards XP once per attempt id", () => {
    const a = applyCompletion(emptyProgress(), { ...base, attemptId: "x", today: "2026-10-10" });
    const b = applyCompletion(a.state, { ...base, attemptId: "x", today: "2026-10-10" });
    expect(a.xpGained).toBe(lessonXp(7, 7, "2026-10-10"));
    expect(b.duplicate).toBe(true);
    expect(b.state.xp).toBe(a.state.xp);
  });
  it("grants badges only once", () => {
    const a = applyCompletion(emptyProgress(), { ...base, attemptId: "1", today: "2026-10-10" });
    const b = applyCompletion(a.state, { ...base, lessonId: "l2", attemptId: "2", today: "2026-10-10" });
    expect(a.newBadges).toEqual(["first_lesson", "perfect"]);
    expect(b.newBadges).toEqual([]);
  });
  it("builds a 3-day streak and resets after a gap", () => {
    expect(nextStreak(2, "2026-10-09", "2026-10-10")).toBe(3);
    expect(nextStreak(5, "2026-10-01", "2026-10-10")).toBe(1);
    expect(nextStreak(2, "2026-10-10", "2026-10-10")).toBe(2);
  });
  it("falls back to empty state for corrupted storage", () => {
    expect(parseProgress("{not json")).toEqual(emptyProgress());
    expect(parseProgress(JSON.stringify({ version: 1, xp: -5 }))).toEqual(emptyProgress());
    expect(parseProgress(null)).toEqual(emptyProgress());
  });
});

describe("levels and badges", () => {
  it("levels start at 25 XP squared steps", () => {
    expect(levelFor(0)).toMatchObject({ level: 1, toNext: 25 });
    expect(levelFor(25).level).toBe(2); expect(levelFor(99).level).toBe(2); expect(levelFor(100).level).toBe(3);
    expect(levelFor(100).into).toBe(0);
  });
  it("awards milestone badges", () => {
    expect(earnedBadges({ completedCount: 5, perfect: false, streak: 7 })).toEqual(["first_lesson", "five_lessons", "streak_3", "streak_7"]);
  });
});
