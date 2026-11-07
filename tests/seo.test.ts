import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { LOCALES, locales } from "@/i18n/config";
import { BRAND, storageKey } from "@/lib/brand";
import { languageAlternates } from "@/lib/seo";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const sources = walk("src").filter((f) => /\.(ts|tsx|css)$/.test(f));

describe("SEO", () => {
  it("sitemap has every language for every public page, with hreflang alternates and x-default", () => {
    const map = sitemap();
    expect(map.length).toBe(5 * locales.length);
    for (const e of map) {
      const langs = Object.keys(e.alternates!.languages!);
      for (const l of LOCALES) expect(langs).toContain(l.hreflang);
      expect(langs).toContain("x-default");
      expect(e.url).not.toMatch(/learn|account|login/);
    }
  });
  it("hreflang helper includes zh-Hans and x-default", () => {
    const a = languageAlternates("/privacy");
    expect(a["zh-Hans"]).toBe("/zh/privacy"); expect(a["x-default"]).toBe("/en/privacy"); expect(a.ko).toBe("/ko/privacy");
  });
  it("robots blocks private routes in every language and points to the sitemap", () => {
    const r = robots(); const rules = Array.isArray(r.rules) ? r.rules : [r.rules]; const rule = rules.find((x) => x.userAgent === "*")!;
    for (const code of locales) for (const p of ["account", "login", "learn"]) expect(rule.disallow).toContain(`/${code}/${p}`);
    expect(r.sitemap).toMatch(/sitemap\.xml$/);
  });
});

describe("right-to-left support", () => {
  it("marks Arabic as rtl and every other language as ltr", () => {
    for (const l of LOCALES) expect(l.dir, l.code).toBe(l.code === "ar" ? "rtl" : "ltr");
  });
  it("uses logical (start/end) spacing and alignment instead of left/right, so layouts mirror in rtl", () => {
    const physical = /(?<![\w-])(?:ml|mr|pl|pr|left|right|rounded-l|rounded-r|border-l|border-r)-(?:\[|\d|px|auto)|text-left|text-right|focus:left-|md:left-|md:right-/;
    for (const f of sources.filter((x) => x.endsWith(".tsx"))) expect(readFileSync(f, "utf8"), f).not.toMatch(physical);
  });
  it("renders arrows through the direction-aware helper", () => {
    for (const f of sources.filter((x) => x.endsWith(".tsx") && !x.endsWith("Arrows.tsx"))) expect(readFileSync(f, "utf8"), f).not.toMatch(/>\s*←|\{open \? "→"/);
  });
});

describe("brand and no clashes with other MugoX sites", () => {
  it("keeps MugoX in the name, drops 2.0", () => {
    expect(BRAND.name).toContain("MugoX"); expect(BRAND.name).not.toMatch(/2\.0/);
  });
  it("no source file still says MugoX 2.0", () => {
    for (const f of sources) expect(readFileSync(f, "utf8"), f).not.toMatch(/MugoX\s*2\.0|মুগোএক্স\s*2\.0/);
  });
  it("every browser storage key is namespaced; no raw legacy keys", () => {
    expect(storageKey("x")).toBe("mugoxlingo:x");
    for (const f of sources) expect(readFileSync(f, "utf8"), f).not.toMatch(/["'`]mugox:/);
  });
});
