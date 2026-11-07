"use client";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/dictionaries";
import { learnStrings } from "@/i18n/learnUi";
import RichText from "@/components/RichText";
import { storageKey } from "@/lib/brand";
import { useSpeech } from "@/features/speech/speech";

const KEY = storageKey("pinyin");
const apply = (on: boolean) => { document.documentElement.dataset.pinyin = on ? "on" : "off"; };

/** Applies the saved "show pinyin" choice on every page. */
export function PinyinPrefApplier() {
  useEffect(() => { try { apply(window.localStorage.getItem(KEY) !== "off"); } catch { apply(true); } }, []);
  return null;
}

const TONES = [["妈", "mā"], ["麻", "má"], ["马", "mǎ"], ["骂", "mà"], ["吗", "ma"]] as const;

export default function ChineseTools({ locale, lang }: { locale: Locale; lang: string }) {
  const t = learnStrings[locale]; const { hasVoice, speak } = useSpeech(lang);
  const [on, setOn] = useState(true);
  useEffect(() => { try { setOn(window.localStorage.getItem(KEY) !== "off"); } catch { /* default on */ } }, []);
  const toggle = () => { const n = !on; setOn(n); apply(n); try { window.localStorage.setItem(KEY, n ? "on" : "off"); } catch { /* not saved */ } };
  return (
    <section className="mt-6 rounded-[var(--radius-bubble)] bg-white p-5 shadow-[0_6px_0_#d9d0f0]" aria-labelledby="tones">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="tones" className="font-display text-2xl font-extrabold">🎵 {t.toneTitle}</h2>
        <button type="button" aria-pressed={on} onClick={toggle} className="min-h-11 rounded-full border-4 border-mist px-4 font-bold">{on ? t.pinyinOn : t.pinyinOff}</button></div>
      <p className="mt-1 font-semibold opacity-75">{t.toneHint}</p>
      <ul className="mt-4 grid grid-cols-5 gap-2 text-center">{TONES.map(([h, p], i) => (
        <li key={h}><button type="button" disabled={!hasVoice} onClick={() => speak(h)} aria-label={`${h} ${p}: ${t.toneLabels[i]}`}
          className="w-full rounded-2xl bg-mist px-1 py-3 font-display text-3xl font-extrabold transition-transform enabled:hover:-translate-y-1 enabled:active:scale-95 motion-reduce:transition-none">
          <RichText text={`{${h}|${p}}`} /></button>
          <span className="mt-1 block text-xs font-bold opacity-70">{t.toneLabels[i]}</span></li>))}</ul>
      <p className="mt-3 text-sm font-semibold opacity-70">{t.audioNote}</p>
    </section>);
}
