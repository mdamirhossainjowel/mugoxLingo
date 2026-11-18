"use client";
import { useLocale } from "@/i18n/LocaleContext";
import { uiStrings } from "@/i18n/ui";
import { useSpeech } from "./speech";

export default function SpeakButton({ text, lang }: { text: string; lang?: string }) {
  const ui = uiStrings[useLocale()];
  const { canSpeak, failed, speak } = useSpeech(lang);
  const cls = "inline-grid size-11 place-items-center rounded-full bg-white text-xl shadow-[0_4px_0_#d9d0f0] transition-transform enabled:hover:scale-110 enabled:active:translate-y-1 disabled:opacity-40 motion-reduce:transition-none";
  return (
    <span className="inline-grid gap-2 align-middle">
      <span className="inline-flex items-center gap-2">
        <button type="button" className={cls} disabled={!canSpeak} title={canSpeak ? ui.playAudio : ui.noAudio} aria-label={canSpeak ? ui.playAudio : ui.noAudio} onClick={() => speak(text)}>🔊</button>
        <button type="button" className={cls} disabled={!canSpeak} title={ui.playSlow} aria-label={ui.playSlow} onClick={() => speak(text, true)}>🐢</button>
      </span>
      {failed && <span role="status" className="block max-w-xs text-sm font-bold text-coral-deep">{ui.audioHelp}</span>}
    </span>);
}
