import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/i18n/dictionaries";
import { siteStrings } from "@/i18n/siteUi";
import { languageAlternates } from "@/lib/seo";
import LegalPage, { summaryOf } from "@/components/LegalPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const s = siteStrings[locale];
  return { title: s.privacyTitle, description: summaryOf(s.privacyBody), alternates: { canonical: `/${locale}/privacy`, languages: languageAlternates("/privacy") } };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const s = siteStrings[locale];
  return <LegalPage locale={locale} title={s.privacyTitle} items={s.privacyBody} showUpdated />;
}
