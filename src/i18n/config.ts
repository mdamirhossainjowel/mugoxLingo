/**
 * The only list of interface languages. To add one: add a row here, add a pack in ./packs, register it in ./packs/index.ts
 * and add the code to the middleware matcher (a test checks that). See LANGUAGES.md.
 */
export const LOCALES = [
  { code: "en", label: "English", hreflang: "en", og: "en_US", dir: "ltr" },
  { code: "bn", label: "বাংলা", hreflang: "bn", og: "bn_BD", dir: "ltr" },
  { code: "es", label: "Español", hreflang: "es", og: "es_ES", dir: "ltr" },
  { code: "zh", label: "中文（简体）", hreflang: "zh-Hans", og: "zh_CN", dir: "ltr" },
  { code: "ja", label: "日本語", hreflang: "ja", og: "ja_JP", dir: "ltr" },
  { code: "ko", label: "한국어", hreflang: "ko", og: "ko_KR", dir: "ltr" },
  { code: "hi", label: "हिन्दी", hreflang: "hi", og: "hi_IN", dir: "ltr" },
  { code: "ar", label: "العربية", hreflang: "ar", og: "ar_AR", dir: "rtl" },
  { code: "fr", label: "Français", hreflang: "fr", og: "fr_FR", dir: "ltr" },
  { code: "pt", label: "Português (Brasil)", hreflang: "pt-BR", og: "pt_BR", dir: "ltr" },
] as const;

export type Locale = (typeof LOCALES)[number]["code"];
export const locales: Locale[] = LOCALES.map((l) => l.code);
export const DEFAULT_LOCALE: Locale = "en";
export const isLocale = (v: string): v is Locale => (locales as string[]).includes(v);
export const localeMeta = (code: Locale) => LOCALES.find((l) => l.code === code)!;
