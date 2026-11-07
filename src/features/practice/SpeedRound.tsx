"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackArrow } from "@/components/Arrows";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Course } from "@/types/course";
import type { Locale } from "@/i18n/dictionaries";
import { learnStrings } from "@/i18n/learnUi";
import { courseVocab, type VocabCard } from "@/content/courses";
import { dayKey } from "@/features/gamification/rules";
import type { GuestProgress } from "@/features/progress/guest-core";
import BubbleButton from "@/components/BubbleButton";
import Mascot from "@/components/Mascot";
import RichText from "@/components/RichText";
import SpeakButton from "@/features/speech/SpeakButton";
import { ACTIVITY_KEY, activitySchema, emptyActivity, forToday } from "./schemas";
import { useLocalStore } from "./store";
import { useCompleted } from "./useCompleted";

const ROUND_SECONDS = 45;
const shuffle = <T,>(a: T[]) => { const o = [...a]; for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; } return o; };

function makeQuestion(pool: VocabCard[]) {
  const answer = pool[Math.floor(Math.random() * pool.length)];
  const wrong = shuffle(pool.filter((c) => c.meaning !== answer.meaning)).slice(0, 3);
  return { answer, choices: shuffle([answer, ...wrong]).map((c) => c.meaning) };
}

export default function SpeedRound({ locale, course, serverProgress }: { locale: Locale; course: Course; serverProgress?: GuestProgress | null }) {
  const t = learnStrings[locale]; const reduce = useReducedMotion();
  const { ids, ready } = useCompleted(serverProgress);
  const pool = useMemo(() => courseVocab(course, ids), [course, ids]);
  const activity = useLocalStore(ACTIVITY_KEY, activitySchema, emptyActivity);
  const [phase, setPhase] = useState<"idle" | "run" | "over">("idle");
  const [left, setLeft] = useState(ROUND_SECONDS); const [score, setScore] = useState(0); const [combo, setCombo] = useState(0);
  const [q, setQ] = useState<ReturnType<typeof makeQuestion> | null>(null); const [flash, setFlash] = useState<"ok" | "no" | null>(null);
  const [newBest, setNewBest] = useState(false);
  const endAt = useRef(0); const scoreRef = useRef(0);

  const start = () => { scoreRef.current = 0; setScore(0); setCombo(0); setLeft(ROUND_SECONDS); setNewBest(false); setQ(makeQuestion(pool)); endAt.current = Date.now() + ROUND_SECONDS * 1000; setPhase("run"); };
  useEffect(() => {
    if (phase !== "run") return;
    const id = setInterval(() => {
      const s = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000)); setLeft(s);
      if (s === 0) {
        clearInterval(id); setPhase("over");
        activity.update((a) => { const x = forToday(a, dayKey(new Date())); setNewBest(scoreRef.current > x.bestSpeed); return { ...x, speedRounds: x.speedRounds + 1, bestSpeed: Math.max(x.bestSpeed, scoreRef.current) }; });
      }
    }, 250);
    return () => clearInterval(id);
  }, [phase, activity]);

  const answer = useCallback((meaning: string) => {
    if (phase !== "run" || !q) return;
    const ok = meaning === q.answer.meaning;
    if (ok) { const nc = combo + 1; setCombo(nc); const gain = 10 + Math.min(nc - 1, 5) * 2; scoreRef.current += gain; setScore(scoreRef.current); } else setCombo(0);
    setFlash(ok ? "ok" : "no"); setTimeout(() => setFlash(null), 250); setQ(makeQuestion(pool));
  }, [phase, q, combo, pool]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { const n = Number(e.key); if (phase === "run" && q && n >= 1 && n <= q.choices.length) answer(q.choices[n - 1]); };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [phase, q, answer]);

  const tooFew = ready && new Set(pool.map((c) => c.meaning)).size < 4;
  return (
    <main id="main" className="mx-auto max-w-xl px-5 py-6">
      <Link href={`/${locale}/learn/${course.id}`} className="font-display text-2xl font-extrabold">{""}<BackArrow /> {t.back}</Link>
      <h1 className="mt-4 font-display text-4xl font-extrabold">⚡ {t.speed}</h1>
      <p className="mt-1 text-sm font-bold opacity-70">{t.forFun}</p>
      {tooFew && <p className="mt-8 rounded-[var(--radius-bubble)] bg-white p-6 font-bold shadow-[0_6px_0_#d9d0f0]">{t.spNeedWords}</p>}
      {ready && !tooFew && phase === "idle" && (
        <div className="mt-8 grid justify-items-center gap-4 text-center"><Mascot label="" /><p className="text-lg font-bold">{t.spReady}</p>
          <p className="font-bold">{t.spBest}: {activity.value.bestSpeed}</p><BubbleButton tone="mango" onClick={start}>{t.spStart}</BubbleButton></div>)}
      {phase === "run" && q && (<>
        <div className="mt-6 flex items-center justify-between font-display text-2xl font-extrabold">
          <span>{t.spScore}: {score}</span><span aria-live="off" className={left <= 10 ? "text-coral" : ""}>⏱ {left}s</span><span>{t.spCombo}: x{combo}</span></div>
        <div className="mt-2 h-4 overflow-hidden rounded-full bg-white" role="progressbar" aria-label="Time" aria-valuemin={0} aria-valuemax={ROUND_SECONDS} aria-valuenow={left}>
          <div className="h-full rounded-full bg-lagoon transition-[width] duration-300 ease-linear motion-reduce:transition-none" style={{ width: `${(left / ROUND_SECONDS) * 100}%` }} /></div>
        <motion.div key={q.answer.id + score} initial={reduce ? false : { scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className={`mt-8 rounded-[var(--radius-bubble)] p-8 text-center font-display text-5xl font-extrabold shadow-[0_8px_0_#d9d0f0] ${flash === "ok" ? "bg-lagoon/30" : flash === "no" ? "bg-coral/30" : "bg-white"}`}><RichText text={q.answer.term} /></motion.div>
        <div className="mt-3 flex justify-center"><SpeakButton text={q.answer.term} lang={course.ttsLang} /></div>
        <ul className="mt-6 grid gap-3 md:grid-cols-2">{q.choices.map((c, k) => (
          <li key={c}><button type="button" onClick={() => answer(c)} className="min-h-14 w-full rounded-2xl border-4 border-mist bg-white px-4 font-display text-xl font-bold hover:border-lagoon">
            <span aria-hidden className="me-2 opacity-50">{k + 1}</span>{c}</button></li>))}</ul>
      </>)}
      {phase === "over" && (
        <div className="mt-8 grid justify-items-center gap-3 text-center" role="status"><Mascot label="" happy />
          <h2 className="font-display text-4xl font-extrabold">{t.spTimeUp}</h2>
          <p className="font-display text-6xl font-extrabold text-mango-deep">{score}</p>
          {newBest && <p className="font-bold text-lagoon-deep">🏆 {t.spNewBest}</p>}
          <p className="font-bold">{t.spBest}: {Math.max(activity.value.bestSpeed, score)}</p>
          <div className="flex gap-3"><BubbleButton tone="mango" onClick={start}>{t.spPlayAgain}</BubbleButton><BubbleButton tone="white" href={`/${locale}/learn/${course.id}`}>{t.back}</BubbleButton></div></div>)}
    </main>);
}
