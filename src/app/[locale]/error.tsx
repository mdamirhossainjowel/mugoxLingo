"use client";
import { siteStrings } from "@/i18n/siteUi";
import { useLocaleFromPath } from "@/i18n/LocaleContext";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const s = siteStrings[useLocaleFromPath()];
  return (
    <main id="main" role="alert" className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-5 text-center">
      <h1 className="font-display text-3xl font-extrabold">{s.errorTitle}</h1>
      <p className="font-semibold">{s.errorBody}</p>
      <button type="button" onClick={reset} className="rounded-full bg-lagoon px-8 py-3 font-display text-xl font-bold text-white shadow-[0_6px_0_var(--color-lagoon-deep)]">{s.retry}</button>
    </main>);
}
