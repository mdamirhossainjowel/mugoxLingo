import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/config";
import { siteUrl } from "@/lib/seo";

const pages = ["", "/about", "/privacy", "/terms", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((page) =>
    LOCALES.map((locale) => ({
      url: `${siteUrl}/${locale.code}${page}`,
      alternates: {
        languages: {
          ...Object.fromEntries(
            LOCALES.map((language) => [
              language.hreflang,
              `${siteUrl}/${language.code}${page}`,
            ])
          ),
          "x-default": `${siteUrl}/en${page}`,
        },
      },
    }))
  );
}
