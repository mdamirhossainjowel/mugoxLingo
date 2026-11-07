import { locales, type Locale } from "./config";
import { packs, type LocalePack } from "./packs";

/** Objects may be partial; arrays are replaced as a whole (they hold ordered lists such as FAQ items). */
export type DeepPartial<T> = T extends (infer U)[] ? U[] : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

export function deepMerge<T>(base: T, over?: DeepPartial<T>): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base) || typeof base !== "object" || base === null) return over as T;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(over as object)) out[key] = deepMerge((base as Record<string, unknown>)[key], (over as Record<string, unknown>)[key] as never);
  return out as T;
}

/** English is the base. A language with a pack gets its translations merged over English, so a missing key falls back to English. */
export function buildStrings<T>(en: T, full: Partial<Record<Locale, T>>, pick: (p: LocalePack) => DeepPartial<T> | undefined): Record<Locale, T> {
  const out = {} as Record<Locale, T>;
  for (const code of locales) out[code] = code === "en" ? en : (full[code] ?? deepMerge(en, packs[code] ? pick(packs[code]!) : undefined));
  return out;
}
