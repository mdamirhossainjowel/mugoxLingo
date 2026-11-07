import { describe, expect, it } from "vitest";
import { locales } from "@/i18n/config";
import { catalogs, TOPIC_KEYS } from "@/i18n/catalog";
import { localizePrompt } from "@/i18n/prompts";
import { allLessons, courses, getCourse } from "@/content/courses";
import { topicOf } from "@/content/topics";
import { courseTitle, languageName, lessonObjective, lessonTitle, unitTitle } from "@/content/titles";
import { adsAllowedPath, adsTxtLine, normalizeAdsenseId } from "@/features/ads/adsense";

describe("localized course catalogue", () => {
  it("every lesson belongs to a known topic", () => {
    for (const c of courses) for (const l of allLessons(c)) expect(topicOf(l.id), l.id).toBeDefined();
  });
  for (const code of locales) {
    it(`${code}: every topic is named, names are unique, templates keep their placeholders`, () => {
      const cat = catalogs[code]; const names = TOPIC_KEYS.map((k) => cat.topics[k]);
      names.forEach((n, i) => expect(n.trim().length, TOPIC_KEYS[i]).toBeGreaterThan(0));
      expect(new Set(names).size).toBe(names.length);
      expect(cat.courseTitle).toContain("{target}"); expect(cat.courseTitle).toContain("{source}");
      for (const [k, v] of Object.entries(cat.prompts)) if (!["match", "matchSound", "listen"].includes(k)) expect(v, k).toContain("{x}");
    });
    if (code !== "en") it(`${code}: course, unit and lesson titles are not English`, () => {
      const course = getCourse("en-es")!; const unit = course.units[0]; const lesson = unit.lessons[0];
      expect(courseTitle(course, code)).not.toBe(courseTitle(course, "en"));
      expect(lessonTitle(lesson, code)).not.toBe(lessonTitle(lesson, "en"));
      expect(unitTitle(unit, code)).not.toBe(unitTitle(unit, "en"));
      expect(lessonObjective(lesson, course, code)).toContain(languageName("es", code));
    });
  }
  it("builds titles from the language names of the visitor's language", () => {
    expect(courseTitle(getCourse("en-es")!, "en")).toBe("Spanish for English speakers");
    expect(courseTitle(getCourse("en-es")!, "zh")).toContain("西班牙语");
    expect(courseTitle(getCourse("en-es")!, "es")).toMatch(/^Español para hablantes de inglés$/);
    expect(courseTitle(getCourse("hi-en")!, "ja")).toContain("ヒンディー語");
  });
  it("translates the standard exercise instructions and leaves the rest alone", () => {
    expect(localizePrompt("What does “Hola” mean?", "es")).toBe("¿Qué significa «Hola»?");
    expect(localizePrompt("Translate: Thank you", "ja")).toBe("翻訳しましょう：Thank you");
    expect(localizePrompt("How do you say “Dad”?", "fr")).toBe("Comment dit-on « Dad » ?");
    expect(localizePrompt("What sound does “あ” make?", "ko")).toContain("あ");
    expect(localizePrompt("Which vowel sounds like “oo” in “moon”?", "pt")).toBe("Qual soa como “oo”?");
    expect(localizePrompt("Match each color", "ar")).toBe(catalogs.ar.prompts.match);
    expect(localizePrompt("What does “{你好|nǐ hǎo}” mean?", "bn")).toBe("“{你好|nǐ hǎo}” মানে কী?");
    expect(localizePrompt("Good morning", "es")).toBe("Good morning");
    expect(localizePrompt("What does “Hola” mean?", "en")).toBe("What does “Hola” mean?");
  });
  it("localizes at least 85% of the instructions in courses taught to English speakers", () => {
    let total = 0, changed = 0;
    for (const c of courses.filter((x) => x.from === "en")) for (const l of allLessons(c)) for (const e of l.exercises) { total++; if (localizePrompt(e.prompt, "es") !== e.prompt) changed++; }
    expect(changed / total).toBeGreaterThanOrEqual(0.85);
  });
});

describe("AdSense helpers", () => {
  it("accepts the publisher id with or without the ca- prefix and stray spaces, and rejects junk", () => {
    expect(normalizeAdsenseId(" pub-5610861089372226")).toBe("ca-pub-5610861089372226");
    expect(normalizeAdsenseId("ca-pub-5610861089372226")).toBe("ca-pub-5610861089372226");
    for (const bad of ["", "pub-12", "ca-pub-abc", "G-18M0NJK6YM", "pub-5610861089372226');alert(1)"]) expect(normalizeAdsenseId(bad), bad).toBeNull();
  });
  it("writes the ads.txt line Google expects", () => {
    expect(adsTxtLine("ca-pub-5610861089372226")).toBe("google.com, pub-5610861089372226, DIRECT, f08c47fec0942fa0");
  });
  it("allows ads only on the home and About pages", () => {
    for (const ok of ["/en", "/zh", "/en/about", "/ar/about"]) expect(adsAllowedPath(ok), ok).toBe(true);
    for (const no of ["/en/learn/en-es", "/en/learn/en-es/es-greetings-1", "/en/account", "/en/login", "/en/privacy", "/en/contact", "/en/learn/en-zh/exam/zh-u1"]) expect(adsAllowedPath(no), no).toBe(false);
  });
});
