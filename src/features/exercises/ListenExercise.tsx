"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Exercise } from "@/types/course";
import RichText from "@/components/RichText";
import { useLocale } from "@/i18n/LocaleContext";
import { localizePrompt } from "@/i18n/prompts";
import SpeakButton from "@/features/speech/SpeakButton";
import { useSpeech, useSpeechLang } from "@/features/speech/speech";
import { optionCls, type RendererProps } from "./shared";

type Listen = Extract<Exercise, { type: "listen" }>;

/** Listening practice (not scored). Without a device voice it falls back to showing the word to read. */
export default function ListenExercise({ exercise, locked, ui, onChange }: RendererProps<Listen>) {
  const locale = useLocale(); const prompt = localizePrompt(exercise.prompt, locale);
  const reduce = useReducedMotion(); const ctx = useSpeechLang(); const lang = exercise.lang ?? ctx;
  const { hasVoice, speak } = useSpeech(lang); const [sel, setSel] = useState<number | null>(null);
  useEffect(() => { if (hasVoice) speak(exercise.say); }, [hasVoice, speak, exercise.say]);
  const pick = (i: number) => { if (locked) return; setSel(i); onChange({ type: "listen", choice: i }); };
  return (
    <div>
      <h2 className="font-display text-3xl font-extrabold"><RichText text={prompt} /></h2>
      <p className="mt-1 text-sm font-bold opacity-70">{ui.listenHint}</p>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <SpeakButton text={exercise.say} lang={lang} label={ui.playAudio} slowLabel={ui.playSlow} unavailable={ui.noAudio} />
        {!hasVoice && <p role="status" className="font-display text-3xl font-extrabold"><RichText text={exercise.say} /></p>}
      </div>
      {!hasVoice && <p className="mt-2 text-sm font-semibold text-coral-deep">{ui.noAudio}</p>}
      <ul className="mt-6 grid gap-3 md:grid-cols-2" role="group" aria-label={ui.listenHint}>
        {exercise.choices.map((c, i) => (
          <li key={c}><motion.button type="button" disabled={locked} aria-pressed={sel === i} onClick={() => pick(i)} whileTap={reduce ? undefined : { scale: 0.95 }}
            className={optionCls(sel === i ? "picked" : "idle")}><RichText text={c} /></motion.button></li>))}
      </ul>
    </div>);
}
