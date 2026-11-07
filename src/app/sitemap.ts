import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/config";
import { siteUrl } from "@/lib/seo";

const pages = ["", "/about", "/privacy", "/terms", "/contact"]; // private, auth and lesson routes are intentionally excluded

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((p) => LOCALES.map((l) => ({
    url: `${siteUrl}/${l.code}${p}`, lastModified: new Date(), changeFrequency: p === "" ? ("weekly" as const) : ("yearly" as const), priority: p === "" ? 1 : 0.3,
    alternates: { languages: { ...Object.fromEntries(LOCALES.map((x) => [x.hreflang, `${siteUrl}/${x.code}${p}`])), "x-default": `${siteUrl}/en${p}` } },
  })));
}
