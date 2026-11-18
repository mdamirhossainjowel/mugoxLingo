import Link from "next/link";
import type { Guide } from "@/content/guides";
import { GUIDES_UPDATED } from "@/content/guides";
import { BRAND } from "@/lib/brand";
import { siteUrl } from "@/lib/seo";
import { BackArrow } from "./Arrows";
import AdSlot from "@/features/ads/AdSlot";

const dateText = (locale: string) => new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(`${GUIDES_UPDATED}T00:00:00Z`));

/** One guide as plain, crawlable HTML: headings, paragraphs, lists and real tables. */
export default function GuideView({ guide, locale }: { guide: Guide; locale: string }) {
  const url = `${siteUrl}/${locale}/guides/${guide.slug}`;
  const org = { "@type": "Organization", name: BRAND.name, url: siteUrl };
  const jsonLd = JSON.stringify([
    { "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.description, inLanguage: locale, datePublished: GUIDES_UPDATED, dateModified: GUIDES_UPDATED, mainEntityOfPage: url, author: org, publisher: { ...org, logo: { "@type": "ImageObject", url: `${siteUrl}/icon.svg` } } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: BRAND.name, item: `${siteUrl}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Learning guides", item: `${siteUrl}/${locale}/guides` },
      { "@type": "ListItem", position: 3, name: guide.title, item: url } ] },
  ]).replace(/</g, "\\u003c");
  return (
    <main id="main" className="mx-auto max-w-3xl px-5 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm font-bold">
        <Link href={`/${locale}`} className="underline"><BackArrow /> {BRAND.name}</Link><span aria-hidden>/</span><Link href={`/${locale}/guides`} className="underline">Learning guides</Link>
      </nav>
      <article className="mt-4">
        <h1 className="font-display text-4xl font-extrabold leading-tight">{guide.title}</h1>
        <p className="mt-3 text-lg font-semibold opacity-80">{guide.description}</p>
        <p className="mt-1 text-sm font-semibold opacity-70">Updated {dateText(locale)}</p>
        {guide.sections.map((s) => (
          <section key={s.heading} className="mt-8">
            <h2 className="font-display text-2xl font-extrabold">{s.heading}</h2>
            {s.paragraphs?.map((p) => <p key={p} className="mt-3 text-lg font-semibold leading-relaxed">{p}</p>)}
            {s.table && (
              <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-[0_6px_0_#d9d0f0]">
                <table className="w-full min-w-[20rem] text-start text-base font-semibold">
                  <caption className="px-4 pt-3 text-start text-sm font-bold opacity-70">{s.table.caption}</caption>
                  <thead><tr>{s.table.head.map((h) => <th key={h} scope="col" className="border-b-4 border-mist px-4 py-2 font-display font-extrabold">{h}</th>)}</tr></thead>
                  <tbody>{s.table.rows.map((r) => <tr key={r.join("|")} className="odd:bg-mist/50">{r.map((c, i) => i === 0 ? <th key={i} scope="row" className="px-4 py-2 font-display text-xl font-extrabold">{c}</th> : <td key={i} className="px-4 py-2">{c}</td>)}</tr>)}</tbody>
                </table>
              </div>)}
            {s.list && <ul className="mt-3 list-disc space-y-2 ps-6 text-lg font-semibold">{s.list.map((l) => <li key={l}>{l}</li>)}</ul>}
          </section>))}
        <aside className="mt-10 rounded-[var(--radius-bubble)] bg-white p-6 shadow-[0_6px_0_#d9d0f0]">
          <p className="font-display text-xl font-extrabold">{guide.practice.label}</p>
          <Link href={`/${locale}/learn/${guide.practice.course}/${guide.practice.lesson}`} className="mt-3 inline-block rounded-full bg-mango px-6 py-3 font-display text-lg font-bold shadow-[0_5px_0_var(--color-mango-deep)]">Start the lesson</Link>
        </aside>
      </article>
      <AdSlot label="Advertisement" />
    </main>);
}
