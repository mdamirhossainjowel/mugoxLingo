"use client";
import Link from "next/link";
import { siteStrings } from "@/i18n/siteUi";
import { useLocaleFromPath } from "@/i18n/LocaleContext";

export default function NotFound() {
  const locale = useLocaleFromPath(); const s = siteStrings[locale];
  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-5 text-center">
      <p aria-hidden className="font-display text-8xl font-extrabold text-mango">404</p>
      <h1 className="font-display text-3xl font-extrabold">{s.notFoundTitle}</h1>
      <Link href={`/${locale}`} className="rounded-full bg-mango px-8 py-3 font-display text-xl font-bold shadow-[0_6px_0_var(--color-mango-deep)]">{s.home}</Link>
    </main>);
}
