import { catalogs } from "./catalog";
import type { Locale } from "./config";

/**
 * Translates the standard exercise instructions ("What does X mean?", "Translate: X", ...) into the interface language.
 * Text that is not a standard instruction (grammar glosses, courses taught in another language) is returned unchanged.
 */
export function localizePrompt(text: string, locale: Locale): string {
  if (locale === "en") return text;
  const p = catalogs[locale].prompts; let m: RegExpMatchArray | null;
  if ((m = text.match(/^What does “(.+)” mean\?$/))) return p.meaning.replace("{x}", m[1]);
  if ((m = text.match(/^How do you say “(.+)”\?$/))) return p.say.replace("{x}", m[1]);
  if ((m = text.match(/^Translate: (.+)$/))) return p.translate.replace("{x}", m[1]);
  if ((m = text.match(/^What sound does “(.+)” make\?$/))) return p.sound.replace("{x}", m[1]);
  if ((m = text.match(/^Which [a-z]+ sounds like “([^”]+)”(?: in “[^”]+”)?\?$/))) return p.soundLike.replace("{x}", m[1]);
  if (text === "Match each one to its sound") return p.matchSound;
  if (/^Match each [a-z ]+$/i.test(text)) return p.match;
  if (/^Listen\. Which [a-z ]+ did you hear\?$/.test(text)) return p.listen;
  if ((m = text.match(/^Type the (?:romaji|romanization|pinyin) (?:for|of) (.+?)\.?$/))) return p.pronounce.replace("{x}", m[1]);
  return text;
}
