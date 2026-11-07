import type { SiteUi } from "@/i18n/siteUi";
export default function Faq({ s }: { s: SiteUi }) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-12" aria-labelledby="faq">
      <h2 id="faq" className="font-display text-4xl font-extrabold">{s.faqTitle}</h2>
      <div className="mt-6 grid gap-3">{s.faq.map((f) => (
        <details key={f.q} className="group rounded-[var(--radius-bubble)] bg-white p-5 shadow-[0_6px_0_#d9d0f0]">
          <summary className="cursor-pointer list-none font-display text-xl font-extrabold marker:hidden">
            <span aria-hidden className="me-2 inline-block transition-transform rtl:-scale-x-100 group-open:rotate-90 group-open:rtl:-rotate-90 motion-reduce:transition-none">▶</span>{f.q}</summary>
          <p className="mt-3 font-semibold opacity-80">{f.a}</p></details>))}</div>
    </section>);
}
