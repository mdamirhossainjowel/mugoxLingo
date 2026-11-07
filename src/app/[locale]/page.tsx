import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { dictionaries, isLocale } from "@/i18n/dictionaries";
import { LOCALES } from "@/i18n/config";
import { BRAND } from "@/lib/brand";
import { languageAlternates, ogAlternateLocales, ogLocale, siteUrl } from "@/lib/seo";
import Hero from "@/components/Hero";
import LanguagePicker from "@/components/LanguagePicker";
import Features from "@/components/Features";
import AuthLink from "@/components/AuthLink";
import HowItWorks from "@/components/HowItWorks";
import Faq from "@/components/Faq";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import AdSlot from "@/features/ads/AdSlot";
import { CookieSettingsButton } from "@/features/analytics/ConsentBanner";
import { siteStrings } from "@/i18n/siteUi";
import { getCourse } from "@/content/courses";
import { courseTitle } from "@/content/titles";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = dictionaries[locale];
  const title = `${BRAND.name} - ${d.tagline}`;
  return {
    title: { absolute: title }, description: d.heroBody,
    alternates: { canonical: `/${locale}`, languages: languageAlternates() },
    openGraph: { title, description: d.heroBody, type: "website", siteName: BRAND.name, locale: ogLocale(locale), alternateLocale: ogAlternateLocales(locale), url: `/${locale}` },
    twitter: { card: "summary_large_image", title, description: d.heroBody },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = dictionaries[locale];
  const s = siteStrings[locale];
  const englishCourse = getCourse(`${locale}-en`) ? `${locale}-en` : "bn-en";
  const fallback = getCourse("bn-en");
  const englishNote = englishCourse === "bn-en" && locale !== "bn" && fallback ? courseTitle(fallback, locale) : undefined;
  const jsonLd = JSON.stringify([
    { "@context": "https://schema.org", "@type": "Organization", name: BRAND.name, alternateName: BRAND.short, url: siteUrl, logo: `${siteUrl}/icon.svg` },
    { "@context": "https://schema.org", "@type": "WebSite", name: BRAND.name, url: `${siteUrl}/${locale}`, inLanguage: locale },
    { "@context": "https://schema.org", "@type": "FAQPage", inLanguage: locale, mainEntity: s.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]).replace(/</g, "\\u003c");
  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <header className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4">
        <span className="font-display text-3xl font-extrabold">{BRAND.short}<span className="text-coral"> {BRAND.suffix}</span></span>
        <div className="flex items-center gap-3"><AuthLink locale={locale} /><LocaleSwitcher locale={locale} label={s.language} /></div>
      </header>
      <Hero d={d} />
      <LanguagePicker d={d} locale={locale} englishCourse={englishCourse} englishNote={englishNote} />
      <HowItWorks s={s} />
      <Features d={d} />
      <Faq s={s} />
      <AdSlot label={s.adLabel} />
      <footer className="px-5 py-10 text-center text-sm font-semibold">
        <nav aria-label="Footer" className="mb-3 flex flex-wrap justify-center gap-5 text-base font-bold">
          <Link href={`/${locale}/about`} className="underline">{s.footer.about}</Link>
          <Link href={`/${locale}/privacy`} className="underline">{s.footer.privacy}</Link>
          <Link href={`/${locale}/terms`} className="underline">{s.footer.terms}</Link>
          <Link href={`/${locale}/contact`} className="underline">{s.footer.contact}</Link>
          <CookieSettingsButton label={s.cookieSettings} />
        </nav>
        <nav aria-label={s.language} className="mb-3 flex flex-wrap justify-center gap-4">
          {LOCALES.map((l) => <Link key={l.code} href={`/${l.code}`} hrefLang={l.hreflang} lang={l.hreflang} aria-current={l.code === locale ? "true" : undefined} className={l.code === locale ? "font-extrabold" : "underline"}>{l.label}</Link>)}
        </nav>
        <p className="opacity-70">{s.footer.rights}</p>
      </footer>
    </main>
  );
}
