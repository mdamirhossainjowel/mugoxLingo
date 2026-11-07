"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { siteStrings } from "@/i18n/siteUi";
import { consentNeeded, OPEN_CONSENT, readConsent, writeConsent } from "./ga";
import { adsEnabled } from "@/features/ads/adsense";

export default function ConsentBanner({ locale }: { locale: Locale }) {
  const t = siteStrings[locale].consent; const [open, setOpen] = useState(false);
  // On the home page and content pages the banner floats at the bottom. Everywhere else (lessons, exams, sign-in, account) it sits in the normal page flow,
  // so it can never cover a button or an answer.
  const floating = /^\/[^/]+(\/(about|privacy|terms|contact))?\/?$/.test(usePathname() ?? "");
  useEffect(() => {
    if (!consentNeeded()) return;
    setOpen(readConsent() === null);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT, reopen); return () => window.removeEventListener(OPEN_CONSENT, reopen);
  }, []);
  if (!open) return null;
  const choose = (v: "granted" | "denied") => { writeConsent(v); setOpen(false); };
  return (
    <div role="dialog" aria-labelledby="consent-title" aria-describedby="consent-body" className={`${floating ? "fixed inset-x-3 bottom-3 z-[70]" : "relative z-10 my-3"} mx-auto max-w-xl rounded-[var(--radius-bubble)] bg-white p-5 shadow-[0_8px_0_#d9d0f0] ring-4 ring-mango`}>
      <p id="consent-title" className="font-display text-xl font-extrabold">🍪 {t.title}</p>
      <p id="consent-body" className="mt-1 font-semibold">{t.body}{adsEnabled() ? ` ${t.adsNote}` : ""}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button type="button" onClick={() => choose("granted")} className="min-h-12 rounded-full bg-lagoon px-6 font-display text-lg font-bold text-white shadow-[0_4px_0_var(--color-lagoon-deep)]">{t.accept}</button>
        <button type="button" onClick={() => choose("denied")} className="min-h-12 rounded-full border-4 border-mist px-6 font-display text-lg font-bold">{t.decline}</button>
      </div>
    </div>);
}

export function CookieSettingsButton({ label }: { label: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(consentNeeded()), []);
  if (!on) return null;
  return <button type="button" className="underline" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT))}>{label}</button>;
}
