"use client";
import { useMemo, useState } from "react";
import type { Exercise } from "@/types/course";
import { seededShuffle, type RendererProps } from "./shared";
import RichText from "@/components/RichText";
import { useLocale } from "@/i18n/LocaleContext";
import { localizePrompt } from "@/i18n/prompts";

type Match = Extract<Exercise, { type: "match" }>;
const without = (m: Record<string, string>, k: string) => Object.fromEntries(Object.entries(m).filter(([x]) => x !== k));
const hues = ["bg-coral text-white", "bg-lagoon text-white", "bg-mango text-plum", "bg-plum-soft text-white", "bg-coral-deep text-white"];

export default function MatchExercise({ exercise, locked, ui, onChange }: RendererProps<Match>) {
  const locale = useLocale(); const prompt = localizePrompt(exercise.prompt, locale);
  const rights = useMemo(() => seededShuffle(exercise.pairs.map((p) => p.right), exercise.id), [exercise]);
  const [links, setLinks] = useState<Record<string, string>>({});
  const [active, setActive] = useState<string | null>(null);
  const order = exercise.pairs.map((p) => p.left);
  const emit = (next: Record<string, string>) => {
    setLinks(next);
    onChange(Object.keys(next).length === order.length ? { type: "match", pairs: Object.entries(next) } : null);
  };
  const onLeft = (l: string) => {
    if (locked) return;
    if (links[l]) { emit(without(links, l)); setActive(l); return; }
    setActive(l);
  };
  const onRight = (r: string) => {
    if (locked) return;
    const owner = Object.keys(links).find((k) => links[k] === r);
    if (!active) { if (owner) { emit(without(links, owner)); setActive(owner); } return; }
    const next = { ...links }; if (owner) delete next[owner];
    next[active] = r; setActive(null); emit(next);
  };
  const hue = (l: string) => hues[order.indexOf(l) % hues.length];
  return (
    <div>
      <h2 className="font-display text-3xl font-extrabold"><RichText text={prompt} /></h2>
      <p className="mt-1 font-semibold opacity-70">{ui.matchHint}</p>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <ul className="grid gap-3">{order.map((l) => (
          <li key={l}><button type="button" disabled={locked} aria-pressed={active === l} onClick={() => onLeft(l)}
            className={`min-h-14 w-full rounded-2xl border-4 px-3 font-display text-xl font-bold ${links[l] ? `${hue(l)} border-transparent` : active === l ? "border-lagoon bg-lagoon/15" : "border-mist bg-white"}`}><RichText text={l} /></button></li>))}
        </ul>
        <ul className="grid gap-3">{rights.map((r) => {
          const owner = Object.keys(links).find((k) => links[k] === r);
          return (<li key={r}><button type="button" disabled={locked} onClick={() => onRight(r)}
            className={`min-h-14 w-full rounded-2xl border-4 px-3 font-display text-xl font-bold ${owner ? `${hue(owner)} border-transparent` : "border-mist bg-white"}`}><RichText text={r} /></button></li>);
        })}</ul>
      </div>
    </div>
  );
}
