import type { SiteUi } from "@/i18n/siteUi";

/** A plain-language introduction, so visitors (and search engines) see what the site is before the language picker. */
export default function Intro({ s }: { s: SiteUi }) {
  return (
    <section aria-labelledby="intro-title" className="mx-auto max-w-3xl px-5 py-8">
      <h2 id="intro-title" className="font-display text-3xl font-extrabold">{s.introTitle}</h2>
      {s.introBody.map((p) => <p key={p} className="mt-3 text-lg font-semibold leading-relaxed">{p}</p>)}
      <ul className="mt-4 grid gap-2 text-lg font-bold">{s.introPoints.map((p) => <li key={p} className="flex gap-3"><span aria-hidden className="text-lagoon-deep">✓</span><span>{p}</span></li>)}</ul>
    </section>);
}
