import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/i18n/dictionaries";
import { siteStrings } from "@/i18n/siteUi";
import { CONTACT_EMAIL } from "@/lib/brand";
import { languageAlternates } from "@/lib/seo";
import ContactEmail from "@/components/ContactEmail";
import LegalPage, { summaryOf } from "@/components/LegalPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const s = siteStrings[locale];
  return { title: s.contactTitle, description: summaryOf(s.contactText), alternates: { canonical: `/${locale}/contact`, languages: languageAlternates("/contact") } };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const s = siteStrings[locale];
  return <LegalPage locale={locale} title={s.contactTitle} items={s.contactText} intro={<ContactEmail email={CONTACT_EMAIL} label={s.emailLabel} copy={s.copyEmail} copied={s.emailCopied} />} />;
}
