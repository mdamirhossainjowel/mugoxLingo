import type { Exercise } from "@/types/course";
import { describe, expect, it } from "vitest";
import { checkAnswer, normalize } from "@/features/exercises/check";
import { courses, allLessons, scoredExercises } from "@/content/courses";
import { splitSyllables } from "@/lib/pinyin";

describe("normalize", () => {
  it("ignores case, vowel accents and punctuation but keeps ñ", () => {
    expect(normalize("¡Buenos DÍAS!")).toBe("buenos dias");
    expect(normalize("año")).not.toBe(normalize("ano"));
  });
});

describe("checkAnswer", () => {
  const mcq: Exercise = { id: "a", type: "mcq", prompt: "?", choices: ["x", "y"], answer: 1 };
  it("validates mcq against trusted data", () => {
    expect(checkAnswer(mcq, { type: "mcq", choice: 1 }).correct).toBe(true);
    expect(checkAnswer(mcq, { type: "mcq", choice: 0 }).correct).toBe(false);
    expect(checkAnswer(mcq, { type: "translate", text: "y" }).correct).toBe(false);
  });
  it("accepts any listed translation, accent-insensitive", () => {
    const t: Exercise = { id: "t", type: "translate", prompt: "?", accepted: ["Buenos días"] };
    expect(checkAnswer(t, { type: "translate", text: "buenos dias" }).correct).toBe(true);
    expect(checkAnswer(t, { type: "translate", text: "buenas" }).correct).toBe(false);
  });
  it("requires exact word order for build and full correct pairing for match", () => {
    const b: Exercise = { id: "b", type: "build", prompt: "?", tiles: ["a", "b"], answer: ["a", "b"] };
    expect(checkAnswer(b, { type: "build", tokens: ["b", "a"] }).correct).toBe(false);
    const m: Exercise = { id: "m", type: "match", prompt: "?", pairs: [{ left: "l1", right: "r1" }, { left: "l2", right: "r2" }] };
    expect(checkAnswer(m, { type: "match", pairs: [["l1", "r1"], ["l2", "r2"]] }).correct).toBe(true);
    expect(checkAnswer(m, { type: "match", pairs: [["l1", "r2"], ["l2", "r1"]] }).correct).toBe(false);
    expect(checkAnswer(m, { type: "match", pairs: [["l1", "r1"], ["l1", "r1"]] }).correct).toBe(false);
  });
});

describe("vocabulary and units", () => {
  it("every lesson has 4+ vocab words and every course unit is exam-ready", () => {
    for (const c of courses) for (const u of c.units) {
      expect(u.lessons.length).toBeGreaterThan(0);
      for (const l of u.lessons) {
        expect(l.vocab?.length ?? 0).toBeGreaterThanOrEqual(4);
        expect(new Set(l.vocab!.map((v) => v.meaning)).size).toBe(l.vocab!.length);
      }
    }
  });
  it("has the expanded Spanish curriculum", () => {
    const es = courses.find((c) => c.id === "en-es")!;
    expect(allLessons(es).length).toBe(12);
    expect(es.units.map((u) => u.id)).toEqual(["es-u1", "es-u2", "es-u3", "es-u4", "es-u5", "es-u6", "es-u7"]);
  });
});

describe("Chinese course", () => {
  const zh = courses.find((c) => c.id === "en-zh")!;
  const json = JSON.stringify(zh);
  it("has speech language and 7 lessons with at least 6 scored exercises each", () => {
    expect(zh.ttsLang).toBe("zh-CN");
    expect(allLessons(zh)).toHaveLength(11);
    for (const l of allLessons(zh)) expect(scoredExercises(l).length).toBeGreaterThanOrEqual(6);
  });
  it("every {汉字|pinyin} token has one pinyin syllable per character", () => {
    const tokens = [...json.matchAll(/\{([^{}|"]+)\|([^{}"]+)\}/g)];
    expect(tokens.length).toBeGreaterThan(100);
    for (const [, hanzi, py] of tokens) {
      const chars = [...hanzi].filter((c) => /\p{Script=Han}/u.test(c));
      expect(splitSyllables(py).length, `${hanzi} | ${py}`).toBe(chars.length);
      expect(splitSyllables(py).join("")).toBe(py.replace(/[\s']/g, ""));
    }
  });
  it("listening answers point at a real choice and accept loose pinyin", () => {
    for (const l of allLessons(zh)) for (const e of l.exercises) if (e.type === "listen") { expect(e.choices[e.answer]).toBeDefined(); expect(e.say.length).toBeGreaterThan(0); }
    const e = allLessons(zh).flatMap((l) => l.exercises).find((x) => x.id === "zg-7")!;
    for (const a of ["再见", "zàijiàn", "zai jian", "zai4jian4", "ZAIJIAN"]) expect(checkAnswer(e, { type: "translate", text: a }).correct, a).toBe(true);
    expect(checkAnswer(e, { type: "translate", text: "nihao" }).correct).toBe(false);
  });
});

describe("all courses", () => {
  it("covers every course with a speech language and scored exercises", () => {
    expect(courses.map((c) => c.id).sort()).toEqual(["ar-en", "bn-en", "en-bn", "en-es", "en-ja", "en-ko", "en-zh", "es-en", "fr-en", "hi-en", "ja-en", "ko-en", "pt-en", "zh-en"]);
    for (const c of courses) {
      expect(c.ttsLang, c.id).toBeTruthy();
      for (const l of allLessons(c)) {
        expect(scoredExercises(l).length, l.id).toBeGreaterThanOrEqual(5);
        for (const e of l.exercises) if (e.type === "listen") { expect(e.choices[e.answer], e.id).toBeDefined(); expect(e.say).toBeTruthy(); }
      }
    }
  });
  it("Japanese and Korean readings are kind-tagged and non-empty", () => {
    for (const [id, kind] of [["en-ja", "ja"], ["en-ko", "ko"]] as const) {
      const toks = [...JSON.stringify(courses.find((c) => c.id === id)).matchAll(/\{([^{}|"]+)\|([^{}|"]+)\|([a-z]{2})\}/g)];
      expect(toks.length).toBeGreaterThan(40);
      for (const [, text, reading, k] of toks) { expect(k).toBe(kind); expect(text.length).toBeGreaterThan(0); expect(reading).toMatch(/^[a-zāēīōū' -]+$/i); }
    }
  });
  it("accepts romaji and native script for Japanese and Korean translations", () => {
    const find = (id: string) => courses.flatMap(allLessons).flatMap((l) => l.exercises).find((e) => e.id === id)!;
    for (const a of ["さようなら", "sayonara", "Sayōnara", "SAYOUNARA"]) expect(checkAnswer(find("jg-7"), { type: "translate", text: a }).correct, a).toBe(true);
    for (const a of ["네", "ne", "NE"]) expect(checkAnswer(find("kg-7"), { type: "translate", text: a }).correct, a).toBe(true);
    expect(checkAnswer(find("eg-7"), { type: "translate", text: "thanks" }).correct).toBe(true);
  });
});

describe("exercise quality across all courses", () => {
  it("has distinct choices, a valid answer and unique ids inside every unit", () => {
    for (const c of courses) for (const u of c.units) {
      const ids = new Set<string>();
      for (const l of u.lessons) for (const e of l.exercises) {
        expect(ids.has(e.id), `${c.id} duplicate id ${e.id}`).toBe(false); ids.add(e.id);
        expect(e.id.length, e.id).toBeLessThanOrEqual(40);
        if (e.type === "mcq" || e.type === "listen" || e.type === "fill") {
          expect(new Set(e.choices).size, e.id).toBe(e.choices.length);
          expect(e.choices.length, e.id).toBeGreaterThanOrEqual(3);
          expect(e.choices[e.answer], e.id).toBeDefined();
        }
        if (e.type === "build") { expect(new Set(e.tiles).size, e.id).toBe(e.tiles.length); e.answer.forEach((w) => expect(e.tiles, e.id).toContain(w)); }
        if (e.type === "match") expect(new Set(e.pairs.map((p) => p.right)).size, e.id).toBe(e.pairs.length);
      }
    }
  });
  it("counts the full catalogue", () => {
    const lessons = courses.flatMap(allLessons);
    expect(lessons.length).toBeGreaterThanOrEqual(52);
    expect(lessons.reduce((n, l) => n + l.exercises.length, 0)).toBeGreaterThan(350);
  });
});

describe("course content integrity", () => {
  it("has unique ids and valid answers", () => {
    const ids = new Set<string>();
    for (const c of courses) for (const l of allLessons(c)) {
      expect(ids.has(l.id)).toBe(false); ids.add(l.id);
      for (const e of l.exercises) {
        if (e.type === "mcq" || e.type === "fill") expect(e.choices[e.answer]).toBeDefined();
        if (e.type === "build") e.answer.forEach((w) => expect(e.tiles).toContain(w));
      }
    }
  });
});
