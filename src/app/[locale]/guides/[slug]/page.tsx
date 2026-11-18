import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GUIDE_LOCALES, getGuide, guides } from "@/content/guides";
import { isLocale } from "@/i18n/dictionaries";
import GuideView from "@/components/GuideView";
import { ogImage } from "@/lib/seo";

const available = (locale: string) => (GUIDE_LOCALES as readonly string[]).includes(locale);

export function generateStaticParams() { return GUIDE_LOCALES.flatMap((locale) => guides.map((g) => ({ locale, slug: g.slug }))); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params; const g = getGuide(slug);
  if (!g || !available(locale)) return {};
  return {
    title: g.title, description: g.description,
    alternates: { canonical: `/${locale}/guides/${slug}`, languages: { ...Object.fromEntries(GUIDE_LOCALES.map((l) => [l, `/${l}/guides/${slug}`])), "x-default": `/en/guides/${slug}` } },
    openGraph: { type: "article", title: g.title, description: g.description, url: `/${locale}/guides/${slug}`, images: ogImage(locale) },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params; const g = getGuide(slug);
  if (!isLocale(locale) || !available(locale) || !g) notFound();
  return <GuideView guide={g} locale={locale} />;
}
