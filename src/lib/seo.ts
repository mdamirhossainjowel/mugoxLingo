import { LOCALES, DEFAULT_LOCALE, localeMeta, type Locale } from "@/i18n/config";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** hreflang map for a path like "" or "/privacy", including x-default. Relative URLs (metadataBase resolves them). */
export function languageAlternates(path = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of LOCALES) out[l.hreflang] = `/${l.code}${path}`;
  out["x-default"] = `/${DEFAULT_LOCALE}${path}`;
  return out;
}
export const ogLocale = (locale: Locale) => localeMeta(locale).og;
export const ogAlternateLocales = (locale: Locale) => LOCALES.filter((l) => l.code !== locale).map((l) => l.og);

/** For private pages (lessons, account, sign-in): never indexed, and the base URL is still set so social-image links resolve. */
export const noIndex = { metadataBase: new URL(siteUrl), robots: { index: false, follow: false } } as const;
