/** One place for the product name and for every browser storage key, so nothing clashes with other MugoX sites on the same domain. */
export const BRAND = {
  name: "MugoX Lingo",
  short: "MugoX",
  suffix: "Lingo",
  /** Prefix for localStorage keys and cookies written by this app. */
  storagePrefix: "mugoxlingo",
} as const;
export const storageKey = (name: string) => `${BRAND.storagePrefix}:${name}`;
