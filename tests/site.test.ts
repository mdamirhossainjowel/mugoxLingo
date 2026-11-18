import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { locales } from "@/i18n/config";
import { legalDocs } from "@/i18n/legal";
import { siteStrings } from "@/i18n/siteUi";
import { toBlocks, summaryOf } from "@/components/LegalPage";
import { CONTACT_EMAIL, PRODUCTION_URL, fillEmail } from "@/lib/brand";
import { normalizeSiteUrl, siteUrl } from "@/lib/seo";
import { GUIDE_LOCALES, guides } from "@/content/guides";
import { getCourse, getLesson } from "@/content/courses";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

const walk = (d: string): string[] => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const en = legalDocs.en;
const keys = ["aboutBody", "privacyBody", "termsBody", "contactText"] as const;
const shape = (items: string[]) => items.map((i) => (i.startsWith("## ") ? "h" : i.startsWith("- ") ? "li" : "p")).join("");

describe("contact email and site address", () => {
  it("the official contact address is mymugox@gmail.com", () => expect(CONTACT_EMAIL).toBe("mymugox@gmail.com"));
  it("the production address is https://mymugox.com", () => expect(PRODUCTION_URL).toBe("https://mymugox.com"));
  it("turns any site address setting into a valid origin with a protocol", () => {
    expect(normalizeSiteUrl("mymugox.com", "x")).toBe("https://mymugox.com");
    expect(normalizeSiteUrl("https://mymugox.com/", "x")).toBe("https://mymugox.com");
    expect(normalizeSiteUrl("  https://mymugox.com/en/about ", "x")).toBe("https://mymugox.com");
    expect(normalizeSiteUrl("localhost:3000", "x")).toBe("http://localhost:3000");
    expect(normalizeSiteUrl("", "https://mymugox.com")).toBe("https://mymugox.com");
    expect(normalizeSiteUrl("ftp://mymugox.com", "https://fallback.test")).toBe("https://fallback.test");
    expect(normalizeSiteUrl("not a url at all", "https://fallback.test")).toBe("https://fallback.test");
  });
  it("the configured site address always has a protocol", () => expect(siteUrl).toMatch(/^https?:\/\/[^/]+$/));
  it("fills the {email} placeholder", () => expect(fillEmail("Write to {email}.")).toBe("Write to mymugox@gmail.com."));
});

describe("long public texts exist in every language with the same structure", () => {
  for (const code of locales) {
    it(`${code}: About, Privacy, Terms and Contact have the same headings, bullets and paragraphs as English`, () => {
      for (const k of keys) { expect(legalDocs[code][k].length, k).toBe(en[k].length); expect(shape(legalDocs[code][k]), k).toBe(shape(en[k])); }
      expect(legalDocs[code].introBody.length).toBe(2); expect(legalDocs[code].introPoints.length).toBe(3); expect(legalDocs[code].faqExtra.length).toBe(3);
    });
    it(`${code}: tells people how to contact and delete, and names the real services`, () => {
      const privacy = legalDocs[code].privacyBody.join(" ");
      for (const name of ["{email}", "mgxl_session", "Neon", "Google Analytics", "Google AdSense", "scrypt", "adssettings.google.com", "aboutads.info"]) expect(privacy, name).toContain(name);
      expect(legalDocs[code].termsBody.join(" ")).toContain("{email}");
      expect(legalDocs[code].contactText.join(" ")).toContain("{email}");
      expect(legalDocs[code].faqExtra.map((f) => f.a).join(" ")).toContain("{email}");
    });
    if (code !== "en") it(`${code}: the text is translated, not left in English`, () => {
      for (const k of keys) {
        const same = legalDocs[code][k].filter((t, i) => t === en[k][i] && !/^## \d+\. Google Analytics$/.test(t) && !(t.startsWith("## ") && t.length < 20) && /[a-z]{4}/i.test(t.replace(/\{email\}/g, "")));
        expect(same, `${k}: ${same.slice(0, 2).join(" | ")}`).toEqual([]);
      }
      expect(legalDocs[code].introTitle).not.toBe(en.introTitle);
    });
  }
  it("does not claim services that are not used", () => {
    const all = locales.flatMap((c) => keys.flatMap((k) => legalDocs[c][k])).join(" ");
    for (const bad of ["Supabase", "Stripe", "Facebook", "Meta Pixel", "Sentry", "Mailchimp", "Firebase", "Vercel Analytics"]) expect(all, bad).not.toContain(bad);
  });
  it("splits items into headings, lists and paragraphs, and summarizes for meta descriptions", () => {
    const blocks = toBlocks(["## A", "text", "- x", "- y", "more"]);
    expect(blocks).toEqual([{ kind: "h", text: "A" }, { kind: "p", text: "text" }, { kind: "ul", items: ["x", "y"] }, { kind: "p", text: "more" }]);
    for (const code of locales) for (const k of keys) { const sum = summaryOf(siteStrings[code][k]); expect(sum.length, `${code} ${k}`).toBeGreaterThan(30); expect(sum.length).toBeLessThanOrEqual(165); expect(sum).not.toContain("{email}"); }
  });
  it("every language has its own meta description for each page (no two pages share one)", () => {
    for (const code of locales) { const d = keys.map((k) => summaryOf(siteStrings[code][k])); expect(new Set(d).size).toBe(d.length); }
  });
});

describe("sitemap and robots (kept simple on purpose)", () => {
  const map = sitemap();
  it("has no lastModified, changeFrequency or priority", () => { for (const e of map) { expect(e).not.toHaveProperty("lastModified"); expect(e).not.toHaveProperty("changeFrequency"); expect(e).not.toHaveProperty("priority"); } });
  it("lists each URL once, as an absolute URL on the site", () => {
    const urls = map.map((e) => e.url); expect(new Set(urls).size).toBe(urls.length);
    for (const u of urls) expect(u.startsWith(`${siteUrl}/`), u).toBe(true);
  });
  it("has reciprocal language alternates and an English x-default for every entry", () => {
    const byUrl = new Map(map.map((e) => [e.url, e]));
    for (const e of map) {
      const langs = (e.alternates?.languages ?? {}) as Record<string, string>;
      expect(langs["x-default"], e.url).toMatch(/\/en(\/|$)/);
      for (const target of Object.values(langs)) { const back = byUrl.get(target); expect(back, `${e.url} -> ${target}`).toBeDefined(); expect(Object.values((back!.alternates?.languages ?? {}) as Record<string, string>)).toContain(e.url); }
    }
  });
  it("never lists private, sign-in or lesson routes", () => { for (const e of map) expect(e.url).not.toMatch(/\/(account|login|signup|reset|update-password|learn|api|auth)(\/|$)/); });
  it("lists the guides only in languages that have them", () => {
    const guideUrls = map.filter((e) => e.url.includes("/guides"));
    expect(guideUrls.length).toBe((1 + guides.length) * GUIDE_LOCALES.length);
    for (const e of guideUrls) expect(GUIDE_LOCALES.some((l) => e.url.includes(`/${l}/guides`))).toBe(true);
  });
  it("robots allows the AdSense crawler, blocks private areas and points to the sitemap", () => {
    const r = robots(); const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
    expect(rules.some((x) => x.userAgent === "Mediapartners-Google" && x.allow === "/")).toBe(true);
    expect(r.sitemap).toBe(`${siteUrl}/sitemap.xml`);
  });
});

describe("learning guides", () => {
  const words = (g: (typeof guides)[number]) => g.sections.flatMap((s) => [...(s.paragraphs ?? []), ...(s.list ?? []), ...(s.table?.rows.flat() ?? [])]).join(" ").split(/\s+/).length;
  it("have unique slugs, titles and descriptions of a sensible length", () => {
    expect(new Set(guides.map((g) => g.slug)).size).toBe(guides.length); expect(new Set(guides.map((g) => g.description)).size).toBe(guides.length);
    for (const g of guides) { expect(g.description.length, g.slug).toBeGreaterThanOrEqual(80); expect(g.description.length, g.slug).toBeLessThanOrEqual(170); expect(g.slug).toMatch(/^[a-z0-9-]+$/); }
  });
  it("are substantial: several sections and a few hundred words each", () => { for (const g of guides) { expect(g.sections.length, g.slug).toBeGreaterThanOrEqual(4); expect(words(g), g.slug).toBeGreaterThanOrEqual(220); } });
  it("have rectangular tables and point to a real lesson", () => {
    for (const g of guides) {
      for (const s of g.sections) if (s.table) for (const r of s.table.rows) expect(r.length, `${g.slug}: ${s.heading}`).toBe(s.table.head.length);
      const course = getCourse(g.practice.course); expect(course, g.slug).toBeDefined(); expect(getLesson(course!, g.practice.lesson), g.slug).toBeDefined();
    }
  });
  it("are published only in languages that have a reviewed version", () => expect([...GUIDE_LOCALES]).toEqual(["en"]));
});

describe("the old tools website is gone", () => {
  it("no source file mentions the old tools platform, free tools, marketplace or AI tools", () => {
    for (const f of walk("src").filter((p) => /\.(tsx?|css)$/.test(p))) expect(readFileSync(f, "utf8"), f).not.toMatch(/36\+|free tools|online tools|tools platform|marketplace|ai tools/i);
  });
});

describe("colour contrast of the palette (WCAG AA, 4.5:1 for normal text)", () => {
  const css = readFileSync("src/app/globals.css", "utf8");
  const tok = (n: string) => css.match(new RegExp(`--color-${n}: (#[0-9a-fA-F]{6})`))![1];
  const lum = (h: string) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const ratio = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const pairs: [string, string][] = [["plum", "mist"], ["plum", "mango"], ["#ffffff", "plum"], ["#ffffff", "plum-soft"], ["#ffffff", "lagoon-deep"], ["#ffffff", "coral-deep"], ["coral-deep", "mist"], ["lagoon-deep", "mist"], ["coral-deep", "#ffffff"], ["lagoon-deep", "#ffffff"]];
  for (const [a, b] of pairs) it(`${a} on ${b}`, () => expect(ratio(a.startsWith("#") ? a : tok(a), b.startsWith("#") ? b : tok(b))).toBeGreaterThanOrEqual(4.5));
  it("no button puts white text on the light teal or light coral", () => {
    for (const f of walk("src").filter((p) => p.endsWith(".tsx"))) for (const l of readFileSync(f, "utf8").split("\n")) if (l.includes("text-white")) expect(l, f).not.toMatch(/bg-(lagoon|coral)(?![-\w])/);
  });
});
