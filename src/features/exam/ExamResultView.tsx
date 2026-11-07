"use client";
import { useEffect, useState } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/i18n/dictionaries";
import { learnStrings } from "@/i18n/learnUi";
import BubbleButton from "@/components/BubbleButton";
import Confetti from "@/components/Confetti";
import Mascot from "@/components/Mascot";
import RichText from "@/components/RichText";
import { localizePrompt } from "@/i18n/prompts";
import { gradeTier, type ExamResult } from "./logic";

const C = 2 * Math.PI * 54;
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function ExamResultView({ locale, result, seconds, newBadge, guest, error, onRetake, backHref }: {
  locale: Locale; result: ExamResult; seconds: number; newBadge: boolean; guest: boolean; error?: string | null; onRetake: () => void; backHref: string;
}) {
  const t = learnStrings[locale]; const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? result.percent : 0);
  useEffect(() => { if (reduce) return; const a = animate(0, result.percent, { duration: 1.2, ease: "easeOut", onUpdate: (v) => setShown(Math.round(v)) }); return () => a.stop(); }, [result.percent, reduce]);
  const card = "rounded-[var(--radius-bubble)] bg-white p-5 shadow-[0_6px_0_#d9d0f0]";
  return (
    <div className="grid gap-6 text-center">
      {result.passed && <Confetti count={32} />}
      <div className="grid justify-items-center gap-2"><Mascot label="" happy={result.passed} />
        <h1 className="font-display text-4xl font-extrabold">{result.passed ? t.exPassed : t.exFailed}</h1>
        <p className="max-w-sm font-bold opacity-80">{t.tier[gradeTier(result.percent)]}</p></div>
      <div className="relative mx-auto size-44" role="img" aria-label={`${t.exScore}: ${result.percent}%`}>
        <svg viewBox="0 0 120 120" className="size-full -rotate-90"><circle cx="60" cy="60" r="54" fill="none" stroke="#e8e0fa" strokeWidth="12" />
          <motion.circle cx="60" cy="60" r="54" fill="none" strokeWidth="12" strokeLinecap="round" stroke={result.passed ? "#14b8a6" : "#ff5a6e"} strokeDasharray={C}
            initial={{ strokeDashoffset: reduce ? C * (1 - result.percent / 100) : C }} animate={{ strokeDashoffset: C * (1 - result.percent / 100) }} transition={{ duration: reduce ? 0 : 1.2, ease: "easeOut" }} /></svg>
        <span className="absolute inset-0 grid place-items-center font-display text-5xl font-extrabold">{shown}%</span></div>
      <ul className="grid grid-cols-2 gap-3"><li className={card}><p className="text-sm font-bold opacity-70">{t.exScore}</p><p className="font-display text-3xl font-extrabold">{result.score}/{result.total}</p></li>
        <li className={card}><p className="text-sm font-bold opacity-70">{t.exTime}</p><p className="font-display text-3xl font-extrabold">{fmt(seconds)}</p></li></ul>
      {newBadge && <p className="font-display text-2xl font-extrabold text-mango-deep">🏅 {t.exNewBadge}</p>}
      {error && <p role="alert" className="font-bold text-coral-deep">{error}</p>}
      {guest && <p className="text-sm font-semibold opacity-70">{t.exGuestNote}</p>}
      <section className={`${card} text-start`}><h2 className="font-display text-2xl font-extrabold">{t.exBreakdown}</h2>
        <ul className="mt-3 grid gap-3">{Object.entries(result.byType).map(([k, v]) => (
          <li key={k}><div className="flex justify-between font-bold"><span>{t.types[k]}</span><span>{v!.correct}/{v!.total}</span></div>
            <div className="mt-1 h-3 overflow-hidden rounded-full bg-mist"><div className="h-full rounded-full bg-lagoon" style={{ width: `${(v!.correct / v!.total) * 100}%` }} /></div></li>))}</ul></section>
      <section className={`${card} text-start`}><h2 className="font-display text-2xl font-extrabold">{t.exReview}</h2>
        <ol className="mt-3 grid gap-3">{result.review.map((r, k) => (
          <li key={r.id} className={`rounded-2xl border-4 p-3 ${r.correct ? "border-lagoon/40 bg-lagoon/10" : "border-coral/40 bg-coral/10"}`}>
            <p className="font-bold"><span aria-hidden>{r.correct ? "✓" : "✗"}</span><span className="sr-only">{r.correct ? "Correct" : "Incorrect"}</span> {k + 1}. <RichText text={localizePrompt(r.prompt, locale)} /></p>
            {!r.correct && <p className="mt-1 text-sm font-semibold">{t.exCorrectAnswer}: <RichText text={r.expected} /></p>}</li>))}</ol></section>
      <div className="flex flex-wrap justify-center gap-3"><BubbleButton tone="mango" onClick={onRetake}>{t.examRetake}</BubbleButton><BubbleButton tone="white" href={backHref}>{t.exBackToCourse}</BubbleButton></div>
    </div>);
}
