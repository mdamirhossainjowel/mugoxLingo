import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { siteUrl } from "@/lib/seo";

/** Genuinely private routes. Lessons are open to guests, so they are not blocked here (they carry a noindex tag instead). */
const privateSections = ["account", "login", "signup", "reset", "update-password"];
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "Mediapartners-Google", allow: "/" }, { userAgent: "*", allow: "/", disallow: ["/api/", "/auth/", ...locales.flatMap((l) => privateSections.map((p) => `/${l}/${p}`))] }], sitemap: `${siteUrl}/sitemap.xml` };
}
