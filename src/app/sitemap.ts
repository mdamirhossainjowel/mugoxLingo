import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/config";
import { GUIDE_LOCALES, guides } from "@/content/guides";
import { siteUrl } from "@/lib/seo";

/** Pages that exist in every interface language. Private, sign-in and lesson routes are intentionally left out. */
const pages = ["", "/about", "/privacy", "/terms", "/contact"];

const entry = (path: string, locales: readonly { code: string; hreflang: string }[]) => ({
  url: `${siteUrl}/${locales[0].code}${path}`,
  alternates: { languages: { ...Object.fromEntries(locales.map((l) => [l.hreflang, `${siteUrl}/${l.code}${path}`])), "x-default": `${siteUrl}/en${path}` } },
});

export default function sitemap(): MetadataRoute.Sitemap {
  const all = [...LOCALES];
  const out: MetadataRoute.Sitemap = pages.flatMap((p) => all.map((l) => ({ ...entry(p, [l, ...all.filter((x) => x.code !== l.code)]) })));
  // Learning guides exist only in the languages that have a real, reviewed version (see src/content/guides.ts).
  const guideLocales = LOCALES.filter((l) => (GUIDE_LOCALES as readonly string[]).includes(l.code));
  for (const p of ["/guides", ...guides.map((g) => `/guides/${g.slug}`)]) for (const l of guideLocales) out.push(entry(p, [l, ...guideLocales.filter((x) => x.code !== l.code)]));
  return out;
}
