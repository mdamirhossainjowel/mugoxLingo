"use client";
import { useState } from "react";
import type { Exercise } from "@/types/course";
import type { RendererProps } from "./shared";
import RichText from "@/components/RichText";
import { useLocale } from "@/i18n/LocaleContext";
import { localizePrompt } from "@/i18n/prompts";

type Translate = Extract<Exercise, { type: "translate" }>;

export default function TranslateExercise({ exercise, locked, ui, onChange }: RendererProps<Translate>) {
  const locale = useLocale(); const prompt = localizePrompt(exercise.prompt, locale);
  const [text, setText] = useState("");
  return (
    <div>
      <h2 className="font-display text-3xl font-extrabold"><RichText text={prompt} /></h2>
      <label className="sr-only" htmlFor={`in-${exercise.id}`}>{ui.typeHere}</label>
      <input dir="auto" id={`in-${exercise.id}`} autoFocus autoComplete="off" spellCheck={false} disabled={locked} value={text} placeholder={ui.typeHere}
        onChange={(e) => { setText(e.target.value); onChange(e.target.value.trim() ? { type: "translate", text: e.target.value } : null); }}
        className="mt-6 min-h-16 w-full rounded-2xl border-4 border-mist bg-white px-5 font-display text-2xl font-bold focus:border-lagoon" />
    </div>
  );
}
