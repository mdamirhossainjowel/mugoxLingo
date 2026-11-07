"use client";
import { usePathname, useRouter } from "next/navigation";
import { LOCALES, type Locale } from "@/i18n/config";
import { track } from "@/features/analytics/ga";

/** Swaps the first URL segment and keeps the rest of the path. */
export default function LocaleSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname(); const router = useRouter();
  const go = (code: string) => {
    const rest = pathname.split("/").slice(2).join("/");
    track("locale_change", { from: locale, to: code });
    router.push(`/${code}${rest ? `/${rest}` : ""}`);
  };
  return (
    <span className="inline-flex items-center">
      <label htmlFor="locale-select" className="sr-only">{label}</label>
      <select id="locale-select" value={locale} onChange={(e) => go(e.target.value)} className="min-h-11 rounded-full bg-white px-4 font-bold shadow-[0_4px_0_#d9d0f0]">
        {LOCALES.map((l) => <option key={l.code} value={l.code} lang={l.hreflang}>{l.label}</option>)}
      </select>
    </span>);
}
