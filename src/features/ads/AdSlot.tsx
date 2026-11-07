"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useConsent } from "@/features/analytics/useConsent";
import { ADSENSE_CLIENT, ADSENSE_SLOT, adsAllowedPath } from "./adsense";

/** A manual ad unit. It renders nothing until a slot id is configured, the visitor accepted, and the page allows ads. */
export default function AdSlot({ label }: { label: string }) {
  const consent = useConsent(); const pathname = usePathname(); const pushed = useRef(false);
  const ready = Boolean(ADSENSE_CLIENT && ADSENSE_SLOT) && consent === "granted" && adsAllowedPath(pathname);
  useEffect(() => {
    if (!ready || pushed.current) return;
    pushed.current = true;
    try { ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle ??= []).push({}); } catch { /* ad blocked or script not loaded yet */ }
  }, [ready]);
  if (!ready) return null;
  return (
    <aside aria-label={label} className="mx-auto my-8 max-w-3xl px-5">
      <p className="text-xs font-bold opacity-60">{label}</p>
      <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client={ADSENSE_CLIENT!} data-ad-slot={ADSENSE_SLOT} data-ad-format="auto" data-full-width-responsive="true" />
    </aside>);
}
