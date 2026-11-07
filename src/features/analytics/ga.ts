import { storageKey } from "@/lib/brand";
import { adsEnabled } from "@/features/ads/adsense";

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
/** A GA4 measurement id looks like G-XXXXXXXXXX. Anything else disables analytics (and keeps it out of inline scripts). */
export const isValidGaId = (id: string) => /^G-[A-Z0-9]{6,12}$/.test(id);
export const analyticsEnabled = () => isValidGaId(GA_ID);
/** The cookie banner is needed when analytics or advertising is switched on. */
export const consentNeeded = () => analyticsEnabled() || adsEnabled();

export const CONSENT_KEY = storageKey("consent");
export const CONSENT_CHANGED = "mugoxlingo:consent-changed";
export const OPEN_CONSENT = "mugoxlingo:open-consent";
/** Cookies set by gtag use this prefix, so they never collide with another site's _ga cookies on the same domain. */
export const COOKIE_PREFIX = "mgxl";
export type Consent = "granted" | "denied" | null;

export function readConsent(): Consent {
  try { const v = window.localStorage.getItem(CONSENT_KEY); return v === "granted" || v === "denied" ? v : null; } catch { return null; }
}
export function writeConsent(v: "granted" | "denied") {
  try { window.localStorage.setItem(CONSENT_KEY, v); } catch { /* not saved: asked again next visit */ }
  if (v === "denied") disableAnalytics();
  window.dispatchEvent(new Event(CONSENT_CHANGED));
}
function disableAnalytics() {
  (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = true;
  const host = window.location.hostname; const parts = host.split(".");
  const domains = new Set([host, `.${host}`, parts.length > 2 ? `.${parts.slice(-2).join(".")}` : host]);
  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0].trim();
    if (name.startsWith(`${COOKIE_PREFIX}_ga`)) for (const d of domains) document.cookie = `${name}=; Max-Age=0; path=/; domain=${d}`;
  }
}

/** Only plain strings, numbers and booleans are sent: no objects, no long text. */
export function sanitizeParams(p: Record<string, unknown>): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(p)) {
    if (typeof v === "string") out[k] = v.slice(0, 100); else if (typeof v === "number" && Number.isFinite(v)) out[k] = v; else if (typeof v === "boolean") out[k] = v;
  }
  return out;
}

/** Fire-and-forget event. Does nothing unless analytics is configured, loaded, and the visitor accepted. Never pass names or emails. */
export function track(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !analyticsEnabled() || readConsent() !== "granted" || !window.gtag) return;
  window.gtag("event", name, sanitizeParams(params));
}
