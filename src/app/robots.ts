import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { siteUrl } from "@/lib/seo";

const privateSections = ["account", "login", "signup", "reset", "update-password", "learn"];
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "Mediapartners-Google", allow: "/" }, { userAgent: "*", allow: "/", disallow: ["/auth/", ...locales.flatMap((l) => privateSections.map((p) => `/${l}/${p}`))] }], sitemap: `${siteUrl}/sitemap.xml` };
}
