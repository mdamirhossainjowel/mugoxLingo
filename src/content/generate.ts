import type { Exercise, Lesson, VocabItem } from "@/types/course";
import { parseRich } from "@/lib/pinyin";

export interface VSpec extends VocabItem { accepted?: string[] }
type NoId<T> = T extends unknown ? Omit<T, "id"> : never;
export interface Prompts {
  meaningOf: (term: string) => string; sayIt: (meaning: string) => string; listen: string; match: string;
  translate: (term: string, meaning: string) => { prompt: string; accepted: "term" | "meaning" };
}
export const enPrompts: Prompts = {
  meaningOf: (t) => `What does “${t}” mean?`, sayIt: (m) => `How do you say “${m}”?`, listen: "Listen. Which word did you hear?", match: "Match each word to its meaning",
  translate: (_t, m) => ({ prompt: `Translate: ${m}`, accepted: "term" }),
};
export const soundPrompts: Prompts = {
  meaningOf: (t) => `What sound does “${t}” make?`, sayIt: (m) => `Which one sounds like “${m}”?`, listen: "Listen. Which one did you hear?", match: "Match each one to its sound",
  translate: (t) => ({ prompt: `Type the romanization for ${t}.`, accepted: "meaning" }),
};
export const bnPrompts: Prompts = {
  meaningOf: (t) => `“${t}” শব্দের বাংলা অর্থ কী?`, sayIt: (m) => `“${m}” ইংরেজিতে কী বলে?`, listen: "শোনো। কোন শব্দটি শুনলে?", match: "ইংরেজি শব্দের সঙ্গে বাংলা অর্থ মেলাও",
  translate: (_t, m) => ({ prompt: `ইংরেজিতে অনুবাদ করো: ${m}`, accepted: "term" }),
};

/** A token like {汉字|pinyin} is accepted as the characters or as its reading; anything else as-is. */
const forms = (term: string) => parseRich(term).flatMap((p) => (typeof p === "string" ? [p] : [p.hanzi, p.pinyin]));
const others = <T,>(a: T[], i: number) => [...a.slice(i + 1), ...a.slice(0, i)];
const place = (correct: string, rest: string[], pos: number) => { const c = rest.slice(0, 3); c.splice(pos, 0, correct); return { choices: c, answer: pos }; };

/** Builds a complete lesson from a vocabulary list (4+ words with distinct meanings) plus hand-written extras. */
export function vocabLesson(o: { id: string; title: string; objective: string; vocab: VSpec[]; extra?: NoId<Exercise>[]; prompts?: Prompts; lang?: string; more?: boolean }): Lesson {
  const p = o.prompts ?? enPrompts; const v = o.vocab; const s = o.id.length; const id = (k: string) => `${o.id}:${k}`;
  const m = (i: number) => others(v, i).map((x) => x.meaning); const tm = (i: number) => others(v, i).map((x) => x.term);
  const e1 = place(v[0].meaning, m(0), s % 4), e2 = place(v[1].term, tm(1), (s + 1) % 4), e3 = place(v[2].meaning, m(2), (s + 2) % 4);
  const tr = p.translate(v[3].term, v[3].meaning);
  const exercises: Exercise[] = [
    { id: id("1"), type: "mcq", prompt: p.meaningOf(v[0].term), say: v[0].term, ...e1 },
    { id: id("2"), type: "mcq", prompt: p.sayIt(v[1].meaning), ...e2 },
    { id: id("3"), type: "listen", prompt: p.listen, say: v[2].term, ...(o.lang ? { lang: o.lang } : {}), ...e3 },
    { id: id("4"), type: "match", prompt: p.match, pairs: v.slice(0, 4).map((x) => ({ left: x.term, right: x.meaning })) },
    ...(o.more ? ([
      { id: id("m1"), type: "mcq", prompt: p.meaningOf(v[4].term), say: v[4].term, ...place(v[4].meaning, m(4), (s + 3) % 4) },
      { id: id("m2"), type: "mcq", prompt: p.sayIt(v[0].meaning), ...place(v[0].term, tm(0), (s + 2) % 4) },
      { id: id("m3"), type: "listen", prompt: p.listen, say: v[3].term, ...(o.lang ? { lang: o.lang } : {}), ...place(v[3].meaning, m(3), s % 4) },
    ] as Exercise[]) : []),
    ...(o.extra ?? []).map((e, k) => ({ ...e, id: id(`x${k + 1}`) }) as Exercise),
    { id: id("t"), type: "translate", prompt: tr.prompt, accepted: tr.accepted === "meaning" ? [v[3].meaning] : (v[3].accepted ?? forms(v[3].term)) },
    ...(o.more ? [{ id: id("t2"), type: "translate", prompt: p.translate(v[4].term, v[4].meaning).prompt, accepted: v[4].accepted ?? forms(v[4].term) } as Exercise] : []),
  ];
  return { id: o.id, title: o.title, objective: o.objective, vocab: v.map(({ term, meaning }) => ({ term, meaning })), exercises };
}
