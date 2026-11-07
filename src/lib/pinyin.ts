/** Pinyin helpers: split into syllables and read the tone from the vowel mark. Pure, no DOM. */
const V = "aeiouüāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ";
const SYLLABLE = new RegExp(`(?:zh|ch|sh|[bpmfdtnlgkhjqxzcsryw])?[${V}]+(?:ng(?![${V}])|n(?![${V}])|r(?![${V}]))?`, "giu");
const TONES: Record<number, string> = {
  1: "āēīōūǖ", 2: "áéíóúǘ", 3: "ǎěǐǒǔǚ", 4: "àèìòùǜ",
};

export function splitSyllables(pinyin: string): string[] {
  return pinyin.split(/[\s']+/).filter(Boolean).flatMap((chunk) => chunk.match(SYLLABLE) ?? [chunk]);
}
/** 1-4 for the four tones, 0 for the neutral tone (no mark). */
export function toneOf(syllable: string): 0 | 1 | 2 | 3 | 4 {
  for (const n of [1, 2, 3, 4] as const) if ([...TONES[n]].some((c) => syllable.includes(c))) return n;
  return 0;
}
export const TONE_COLORS: Record<number, string> = { 0: "#6b6480", 1: "#d63a4e", 2: "#b86e00", 3: "#0c8577", 4: "#3a5bd9" };

/** `kind` is absent for Chinese (pinyin, tone-coloured); `ja` and `ko` carry a plain romanization. */
export interface Token { hanzi: string; pinyin: string; kind?: string }
const TOKEN = /\{([^{}|]+)\|([^{}|]+)(?:\|([a-z]{2}))?\}/g;
/** Text with `{汉字|pinyin}` tokens becomes parts: plain strings and tokens. */
export function parseRich(text: string): (string | Token)[] {
  const out: (string | Token)[] = []; let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index! > last) out.push(text.slice(last, m.index));
    out.push(m[3] ? { hanzi: m[1], pinyin: m[2], kind: m[3] } : { hanzi: m[1], pinyin: m[2] }); last = m.index! + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
/** What a speech engine should say: tokens become their characters, everything else stays. */
export const speakable = (text: string) => parseRich(text).map((p) => (typeof p === "string" ? p : p.hanzi)).join("");
/** Plain readable form for aria-labels: `你好 (nǐ hǎo)`. */
export const plainText = (text: string) => parseRich(text).map((p) => (typeof p === "string" ? p : `${p.hanzi} (${p.pinyin})`)).join("");

/** Language tag for plain text in Japanese or Korean script, so the right system font is used. */
export function scriptLang(s: string): "ja" | "ko" | undefined {
  if (/[\u3040-\u30ff]/.test(s)) return "ja";
  if (/[\uac00-\ud7af\u1100-\u11ff]/.test(s)) return "ko";
  return undefined;
}
