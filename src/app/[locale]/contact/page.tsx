import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/i18n/dictionaries";
import { siteStrings } from "@/i18n/siteUi";
import LegalPage from "@/components/LegalPage";
import { languageAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: siteStrings[locale].contactTitle, alternates: { canonical: `/${locale}/contact`, languages: languageAlternates("/contact") } };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const s = siteStrings[locale];
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  return <LegalPage locale={locale} title={s.contactTitle} paragraphs={[email ? `${s.contactBody} ${email}` : s.contactMissing]} showDraft={false} />;
}
