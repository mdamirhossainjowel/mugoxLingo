import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/i18n/dictionaries";
import { siteStrings } from "@/i18n/siteUi";
import { languageAlternates } from "@/lib/seo";
import LegalPage from "@/components/LegalPage";
import AdSlot from "@/features/ads/AdSlot";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const s = siteStrings[locale];
  return { title: s.aboutTitle, description: s.aboutBody[0], alternates: { canonical: `/${locale}/about`, languages: languageAlternates("/about") } };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const s = siteStrings[locale];
  return <LegalPage locale={locale} title={s.aboutTitle} paragraphs={s.aboutBody} showDraft={false}><AdSlot label={s.adLabel} /></LegalPage>;
}
