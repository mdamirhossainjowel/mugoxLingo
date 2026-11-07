import type { SiteUi } from "@/i18n/siteUi";
export default function HowItWorks({ s }: { s: SiteUi }) {
  return (
    <section className="mx-auto max-w-5xl px-5 py-12" aria-labelledby="how">
      <h2 id="how" className="font-display text-4xl font-extrabold">{s.howTitle}</h2>
      <ol className="mt-6 grid gap-5 md:grid-cols-3">{s.how.map((h, i) => (
        <li key={h.title} className="rounded-[var(--radius-bubble)] bg-white p-6 shadow-[0_6px_0_#d9d0f0] transition-transform hover:-translate-y-2 motion-reduce:transition-none">
          <span aria-hidden className="text-4xl">{h.icon}</span>
          <h3 className="mt-2 font-display text-2xl font-extrabold"><span className="text-coral">{i + 1}.</span> {h.title}</h3>
          <p className="mt-1 font-semibold opacity-75">{h.body}</p></li>))}</ol>
    </section>);
}
