import Link from "next/link";
import type { Locale } from "@/i18n/dictionaries";
import { localeMeta } from "@/i18n/config";
import { siteStrings } from "@/i18n/siteUi";
import { BRAND, CONTACT_EMAIL, LEGAL_UPDATED } from "@/lib/brand";
import { BackArrow } from "./Arrows";
import LocaleSwitcher from "./LocaleSwitcher";

/** Text with the {email} placeholder turned into a mailto link. */
function WithEmail({ text }: { text: string }) {
  const parts = text.split("{email}");
  return <>{parts.map((p, i) => <span key={i}>{p}{i < parts.length - 1 && <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold underline">{CONTACT_EMAIL}</a>}</span>)}</>;
}

type Block = { kind: "h"; text: string } | { kind: "p"; text: string } | { kind: "ul"; items: string[] };
export function toBlocks(items: string[]): Block[] {
  const out: Block[] = [];
  for (const raw of items) {
    if (raw.startsWith("## ")) out.push({ kind: "h", text: raw.slice(3) });
    else if (raw.startsWith("- ")) { const last = out[out.length - 1]; if (last?.kind === "ul") last.items.push(raw.slice(2)); else out.push({ kind: "ul", items: [raw.slice(2)] }); }
    else out.push({ kind: "p", text: raw });
  }
  return out;
}
/** A short plain-text summary for the meta description: the first paragraph, cut at a sentence end. */
export function summaryOf(items: string[], max = 160): string {
  const first = fillText(items.find((i) => !i.startsWith("## ") && !i.startsWith("- ")) ?? items[0] ?? "");
  if (first.length <= max) return first;
  const cut = first.slice(0, max); const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("。"));
  return end > 60 ? cut.slice(0, end + 1) : `${cut.slice(0, cut.lastIndexOf(" ") > 60 ? cut.lastIndexOf(" ") : max).trimEnd()}…`;
}
const fillText = (t: string) => t.split("{email}").join(CONTACT_EMAIL);

export default function LegalPage({ locale, title, items, showUpdated = false, intro, children }: { locale: Locale; title: string; items: string[]; showUpdated?: boolean; intro?: React.ReactNode; children?: React.ReactNode }) {
  const s = siteStrings[locale];
  const updated = new Intl.DateTimeFormat(localeMeta(locale).hreflang, { dateStyle: "long" }).format(new Date(`${LEGAL_UPDATED}T00:00:00Z`));
  return (
    <main id="main" className="mx-auto max-w-3xl px-5 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={`/${locale}`} className="font-display text-2xl font-extrabold"><BackArrow /> {BRAND.name}</Link>
        <LocaleSwitcher locale={locale} label={s.language} />
      </div>
      <article className="mt-6">
        <h1 className="font-display text-4xl font-extrabold leading-tight">{title}</h1>
        {showUpdated && <p className="mt-2 text-sm font-semibold opacity-70">{s.lastUpdated}: <time dateTime={LEGAL_UPDATED}>{updated}</time></p>}
        {intro}
        {toBlocks(items).map((b, i) => b.kind === "h" ? <h2 key={i} className="mt-8 font-display text-2xl font-extrabold">{b.text}</h2>
          : b.kind === "ul" ? <ul key={i} className="mt-3 list-disc space-y-2 ps-6 text-lg font-semibold leading-relaxed">{b.items.map((t, j) => <li key={j}><WithEmail text={t} /></li>)}</ul>
          : <p key={i} className="mt-3 text-lg font-semibold leading-relaxed"><WithEmail text={b.text} /></p>)}
      </article>
      {children}
    </main>);
}
