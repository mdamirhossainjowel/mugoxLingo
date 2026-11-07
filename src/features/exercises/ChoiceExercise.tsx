"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Exercise } from "@/types/course";
import { optionCls, type RendererProps } from "./shared";
import RichText from "@/components/RichText";
import { useLocale } from "@/i18n/LocaleContext";
import { localizePrompt } from "@/i18n/prompts";
import SpeakButton from "@/features/speech/SpeakButton";
import { useSpeechLang } from "@/features/speech/speech";
import { plainText } from "@/lib/pinyin";
import { sayFor } from "./say";

type Choice = Extract<Exercise, { type: "mcq" | "fill" }>;

export default function ChoiceExercise({ exercise, locked, active = true, onChange }: RendererProps<Choice>) {
  const locale = useLocale(); const prompt = localizePrompt(exercise.prompt, locale);
  const reduce = useReducedMotion();
  const lang = useSpeechLang(); const say = sayFor(exercise);
  const [sel, setSel] = useState<number | null>(null);
  const pick = (i: number) => { if (locked) return; setSel(i); onChange({ type: exercise.type, choice: i }); };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (active && n >= 1 && n <= exercise.choices.length && !(e.target instanceof HTMLInputElement)) pick(n - 1);
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  });
  return (
    <div>
      <h2 dir="auto" className="font-display text-3xl font-extrabold"><RichText text={prompt} />{say && <span className="ms-3"><SpeakButton text={say} lang={lang} /></span>}</h2>
      {exercise.type === "fill" && (
        <p dir="ltr" className="mt-5 font-display text-4xl font-extrabold" aria-live="polite">
          <RichText text={exercise.before} />{" "}
          <span className="inline-block min-w-24 border-b-4 border-plum px-2 text-center text-lagoon-deep">{sel === null ? "\u00A0" : <RichText text={exercise.choices[sel]} />}</span>{" "}
          <RichText text={exercise.after} />
        </p>
      )}
      <ul className="mt-6 grid gap-3 md:grid-cols-2" role="group" aria-label={plainText(prompt)}>
        {exercise.choices.map((c, i) => (
          <li key={c}>
            <motion.button type="button" disabled={locked} aria-pressed={sel === i} onClick={() => pick(i)}
              whileTap={reduce ? undefined : { scale: 0.95 }} animate={sel === i && !reduce ? { scale: [1, 1.06, 1] } : { scale: 1 }}
              className={optionCls(sel === i ? "picked" : "idle")}>
              <span className="me-3 inline-grid size-8 place-items-center rounded-lg bg-mist text-base" aria-hidden>{i + 1}</span>{c}
            </motion.button>
          </li>
        ))}
      </ul>
    </div>
  );
}
