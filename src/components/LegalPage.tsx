import { BRAND } from "@/lib/brand";
import { BackArrow } from "@/components/Arrows";
import Link from "next/link";
import type { Locale } from "@/i18n/dictionaries";
import { siteStrings } from "@/i18n/siteUi";
import LocaleSwitcher from "./LocaleSwitcher";
export default function LegalPage({ locale, title, paragraphs, showDraft = true, children }: { locale: Locale; title: string; paragraphs: string[]; showDraft?: boolean; children?: React.ReactNode }) {
  const s = siteStrings[locale];
  return (
    <main id="main" className="mx-auto max-w-2xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={`/${locale}`} className="font-display text-2xl font-extrabold"><BackArrow /> {BRAND.name}</Link>
        <LocaleSwitcher locale={locale} label={s.language} />
      </div>
      <h1 className="mt-4 font-display text-4xl font-extrabold">{title}</h1>
      {showDraft && <p className="mt-2 inline-block rounded-full bg-mango px-3 py-1 text-sm font-extrabold">{s.draft}</p>}
      <div className="mt-6 grid gap-4 text-lg font-semibold">{paragraphs.map((p) => <p key={p}>{p}</p>)}</div>
      {children}
    </main>);
}
