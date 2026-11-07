"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Exercise } from "@/types/course";
import { seededShuffle, type RendererProps } from "./shared";
import RichText from "@/components/RichText";
import { useLocale } from "@/i18n/LocaleContext";
import { localizePrompt } from "@/i18n/prompts";

type Build = Extract<Exercise, { type: "build" }>;

export default function BuildExercise({ exercise, locked, ui, onChange }: RendererProps<Build>) {
  const locale = useLocale(); const prompt = localizePrompt(exercise.prompt, locale);
  const reduce = useReducedMotion();
  const [tiles] = useState(() => seededShuffle(exercise.tiles, exercise.id));
  const [used, setUsed] = useState<number[]>([]);
  const update = (next: number[]) => {
    setUsed(next);
    onChange(next.length ? { type: "build", tokens: next.map((i) => tiles[i]) } : null);
  };
  const tile = "min-h-12 rounded-2xl bg-white px-4 font-display text-xl font-bold shadow-[0_4px_0_#d9d0f0]";
  return (
    <div>
      <h2 className="font-display text-3xl font-extrabold"><RichText text={prompt} /></h2>
      <ol dir="ltr" aria-label={ui.tray} aria-live="polite" className="mt-6 flex min-h-20 flex-wrap items-center gap-2 border-b-4 border-plum/20 pb-3">
        {used.map((ti, pos) => (
          <motion.li key={ti} layout={!reduce} initial={reduce ? false : { scale: 0.6 }} animate={{ scale: 1 }}>
            <button type="button" disabled={locked} className={tile} onClick={() => update(used.filter((_, p) => p !== pos))}><RichText text={tiles[ti]} /></button>
          </motion.li>))}
      </ol>
      <ul dir="ltr" className="mt-6 flex flex-wrap gap-3">
        {tiles.map((t, i) => (
          <li key={`${t}-${i}`}>
            <button type="button" disabled={locked || used.includes(i)} className={`${tile} disabled:opacity-30 disabled:shadow-none`}
              onClick={() => update([...used, i])}><RichText text={t} /></button>
          </li>))}
      </ul>
    </div>
  );
}
