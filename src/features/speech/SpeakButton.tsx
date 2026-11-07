"use client";
import { useSpeech } from "./speech";

export default function SpeakButton({ text, lang, label = "Play audio", slowLabel = "Play slowly", unavailable = "No voice for this language on your device" }: {
  text: string; lang?: string; label?: string; slowLabel?: string; unavailable?: string;
}) {
  const { hasVoice, speak } = useSpeech(lang);
  const cls = "inline-grid size-11 place-items-center rounded-full bg-white text-xl shadow-[0_4px_0_#d9d0f0] transition-transform enabled:hover:scale-110 enabled:active:translate-y-1 disabled:opacity-40 motion-reduce:transition-none";
  return (
    <span className="inline-flex items-center gap-2 align-middle">
      <button type="button" className={cls} disabled={!hasVoice} title={hasVoice ? label : unavailable} aria-label={hasVoice ? label : unavailable} onClick={() => speak(text)}>🔊</button>
      <button type="button" className={cls} disabled={!hasVoice} title={slowLabel} aria-label={slowLabel} onClick={() => speak(text, true)}>🐢</button>
    </span>);
}
