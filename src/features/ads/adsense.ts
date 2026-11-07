/** Accepts "pub-123…", "ca-pub-123…" and stray spaces, and returns the canonical "ca-pub-…" id, or null when it is not valid. */
export function normalizeAdsenseId(raw: string): string | null {
  const t = raw.trim().replace(/^ca-/i, "");
  return /^pub-\d{10,20}$/.test(t) ? `ca-${t}` : null;
}
export const ADSENSE_CLIENT = normalizeAdsenseId(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "");
export const ADSENSE_SLOT = /^\d{6,15}$/.test((process.env.NEXT_PUBLIC_ADSENSE_SLOT ?? "").trim()) ? (process.env.NEXT_PUBLIC_ADSENSE_SLOT ?? "").trim() : "";
export const adsEnabled = () => ADSENSE_CLIENT !== null;
/** Personalized ads stay off unless you explicitly turn them on (the site is also used by children). */
export const PERSONALIZED_ADS = process.env.NEXT_PUBLIC_ADSENSE_PERSONALIZED === "true";

/** The one line Google asks for in ads.txt. */
export const adsTxtLine = (client: string) => `google.com, ${client.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0`;

/** Ads appear only on content pages: the home page and the About page. Never in lessons, exams, accounts or sign-in. */
export const AD_SECTIONS = ["about"] as const;
export function adsAllowedPath(pathname: string | null): boolean {
  const seg = (pathname ?? "").split("/").filter(Boolean);
  return seg.length === 1 || (seg.length === 2 && (AD_SECTIONS as readonly string[]).includes(seg[1]));
}
