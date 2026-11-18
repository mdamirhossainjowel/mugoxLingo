/** One place for the product name and for every browser storage key, so nothing clashes with other MugoX sites on the same domain. */
export const BRAND = {
  name: "MugoX Lingo",
  short: "MugoX",
  suffix: "Lingo",
  /** Prefix for localStorage keys and cookies written by this app. */
  storagePrefix: "mugoxlingo",
} as const;
export const storageKey = (name: string) => `${BRAND.storagePrefix}:${name}`;

/** The one official contact address. Used by the Contact, Privacy, Terms and About pages. */
export const CONTACT_EMAIL = (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "").trim() || "mymugox@gmail.com";
/** The public address of the production website (always with https). */
export const PRODUCTION_URL = "https://mymugox.com";
/** Date of the latest edit of the Privacy Policy and the Terms (shown on those pages). */
export const LEGAL_UPDATED = "2026-11-12";
/** Replaces the {email} placeholder used in long texts with the official contact address. */
export const fillEmail = (text: string) => text.split("{email}").join(CONTACT_EMAIL);
