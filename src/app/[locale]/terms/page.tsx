import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/i18n/dictionaries";
import { siteStrings } from "@/i18n/siteUi";
import LegalPage from "@/components/LegalPage";
import { languageAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: siteStrings[locale].termsTitle, alternates: { canonical: `/${locale}/terms`, languages: languageAlternates("/terms") } };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const s = siteStrings[locale];

  return <LegalPage locale={locale} title={s.termsTitle} paragraphs={s.termsBody} showDraft={true} />;
}
