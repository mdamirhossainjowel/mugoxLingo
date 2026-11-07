import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "@fontsource-variable/nunito";
import "@fontsource/baloo-da-2/400.css";
import "@fontsource/baloo-da-2/700.css";
import "@fontsource/baloo-da-2/800.css";
import "../globals.css";
import { isLocale, locales, dictionaries } from "@/i18n/dictionaries";
import { localeMeta } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/LocaleContext";
import { siteStrings } from "@/i18n/siteUi";
import { BRAND } from "@/lib/brand";
import { languageAlternates, ogAlternateLocales, ogLocale, siteUrl } from "@/lib/seo";
import { PinyinPrefApplier } from "@/features/practice/ChineseTools";
import Analytics from "@/features/analytics/Analytics";
import ConsentBanner from "@/features/analytics/ConsentBanner";
import AdSenseLoader from "@/features/ads/AdSenseLoader";
import NavProgress from "@/components/NavProgress";

export const viewport: Viewport = { themeColor: "#3a1d5c", width: "device-width", initialScale: 1 };
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

/** Site-wide defaults in the visitor's language; each page can override them. */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return { metadataBase: new URL(siteUrl) };
  const d = dictionaries[locale];
  return {
    metadataBase: new URL(siteUrl),
    title: { default: `${BRAND.name} - ${d.tagline}`, template: `%s | ${BRAND.name}` },
    description: d.heroBody, applicationName: BRAND.name, manifest: "/manifest.webmanifest",
    verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
    alternates: { languages: languageAlternates() },
    openGraph: { siteName: BRAND.name, type: "website", locale: ogLocale(locale), alternateLocale: ogAlternateLocales(locale) },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const meta = localeMeta(locale);
  return (
    <html lang={meta.hreflang} dir={meta.dir}>
      <body>
        <LocaleProvider locale={locale}>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:font-bold">{siteStrings[locale].skip}</a>
          <PinyinPrefApplier />
          <NavProgress label={siteStrings[locale].loading} />
          <Analytics />
          <AdSenseLoader />
          <ConsentBanner locale={locale} />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
