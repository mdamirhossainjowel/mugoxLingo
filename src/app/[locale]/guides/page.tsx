import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GUIDE_LOCALES, guides } from "@/content/guides";
import { isLocale } from "@/i18n/dictionaries";
import { BRAND } from "@/lib/brand";
import { BackArrow } from "@/components/Arrows";
import AdSlot from "@/features/ads/AdSlot";

const available = (locale: string) => (GUIDE_LOCALES as readonly string[]).includes(locale);
const alternates = () => ({ languages: { ...Object.fromEntries(GUIDE_LOCALES.map((l) => [l, `/${l}/guides`])), "x-default": "/en/guides" } });

export function generateStaticParams() { return GUIDE_LOCALES.map((locale) => ({ locale })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!available(locale)) return {};
  return { title: "Learning guides", description: "Free beginner guides to Mandarin tones, hiragana, Hangul, Spanish greetings and numbers, with pronunciation and vocabulary.", alternates: { canonical: `/${locale}/guides`, ...alternates() } };
}

export default async function GuidesIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || !available(locale)) notFound();
  return (
    <main id="main" className="mx-auto max-w-3xl px-5 py-8">
      <Link href={`/${locale}`} className="font-display text-2xl font-extrabold"><BackArrow /> {BRAND.name}</Link>
      <h1 className="mt-4 font-display text-4xl font-extrabold">Learning guides</h1>
      <p className="mt-3 text-lg font-semibold opacity-80">Short, free guides for beginners with pronunciation and vocabulary. No sign-in needed. Each guide links to an interactive lesson where you can practise.</p>
      <ul className="mt-8 grid gap-4">
        {guides.map((g) => (
          <li key={g.slug} className="rounded-[var(--radius-bubble)] bg-white p-5 shadow-[0_6px_0_#d9d0f0]">
            <h2 className="font-display text-2xl font-extrabold"><Link href={`/${locale}/guides/${g.slug}`} className="underline">{g.title}</Link></h2>
            <p className="mt-2 font-semibold opacity-80">{g.description}</p>
          </li>))}
      </ul>
      <AdSlot label="Advertisement" />
    </main>);
}
