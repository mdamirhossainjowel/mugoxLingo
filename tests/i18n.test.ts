import { describe, expect, it } from "vitest";
import { locales } from "@/i18n/config";
import { dictionaries } from "@/i18n/dictionaries";
import { uiStrings } from "@/i18n/ui";
import { authStrings } from "@/i18n/authUi";
import { learnStrings } from "@/i18n/learnUi";
import { siteStrings } from "@/i18n/siteUi";
import { deepMerge } from "@/i18n/merge";

const modules = { dict: dictionaries, ui: uiStrings, auth: authStrings, learn: learnStrings, site: siteStrings } as const;

function shapeDiff(base: unknown, other: unknown, path = ""): string[] {
  if (Array.isArray(base)) {
    if (!Array.isArray(other) || other.length !== base.length) return [`${path}: array length differs`];
    return base.flatMap((b, i) => shapeDiff(b, other[i], `${path}[${i}]`));
  }
  if (base && typeof base === "object") {
    if (!other || typeof other !== "object") return [`${path}: missing object`];
    const keys = Object.keys(base as object);
    const extra = Object.keys(other as object).filter((k) => !keys.includes(k)).map((k) => `${path}.${k}: unexpected key`);
    return [...extra, ...keys.flatMap((k) => shapeDiff((base as Record<string, unknown>)[k], (other as Record<string, unknown>)[k], `${path}.${k}`))];
  }
  return typeof base === typeof other ? [] : [`${path}: type differs`];
}
const flat = (v: unknown): string[] => Array.isArray(v) ? v.flatMap(flat) : v && typeof v === "object" ? Object.values(v).flatMap(flat) : typeof v === "string" ? [v] : [];

describe("interface languages", () => {
  it("registers ten languages", () => expect(locales).toEqual(["en", "bn", "es", "zh", "ja", "ko", "hi", "ar", "fr", "pt"]));

  for (const [name, table] of Object.entries(modules)) for (const code of locales) {
    it(`${name}/${code} has the same shape as English and no empty text`, () => {
      expect(shapeDiff(table.en, table[code])).toEqual([]);
      for (const s of flat(table[code])) expect(s.trim().length, s).toBeGreaterThan(0);
    });
    if (code !== "en") it(`${name}/${code} is actually translated, not English fallback`, () => {
      const en = flat(table.en).filter((s) => /[A-Za-z]{4,}/.test(s)); const mine = new Set(flat(table[code]));
      const same = en.filter((s) => mine.has(s));
      expect(same.length / en.length, `untranslated: ${same.slice(0, 5).join(" | ")}`).toBeLessThan(0.15);
    });
  }

  it("falls back to English for a key a language does not define", () => {
    const merged = deepMerge({ a: "x", nested: { b: "y", c: "z" }, list: ["1", "2"] }, { nested: { b: "Y" } });
    expect(merged).toEqual({ a: "x", nested: { b: "Y", c: "z" }, list: ["1", "2"] });
  });
});
