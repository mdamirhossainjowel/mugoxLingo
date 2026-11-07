"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackArrow } from "@/components/Arrows";
import Link from "next/link";
import type { Course, ExerciseResponse, Unit } from "@/types/course";
import type { Locale } from "@/i18n/dictionaries";
import { learnStrings } from "@/i18n/learnUi";
import { uiStrings } from "@/i18n/ui";
import { unitComplete } from "@/content/courses";
import { unitTitle } from "@/content/titles";
import ExerciseRenderer from "@/features/exercises/ExerciseRenderer";
import { submitExamAction } from "@/features/progress/actions";
import type { GuestProgress } from "@/features/progress/guest-core";
import { EXAMS_KEY, emptyExams, examBestFromLocal, examsSchema } from "@/features/practice/schemas";
import { useLocalStore } from "@/features/practice/store";
import { useCompleted } from "@/features/practice/useCompleted";
import BubbleButton from "@/components/BubbleButton";
import { SpeechLangContext } from "@/features/speech/speech";
import { track } from "@/features/analytics/ga";
import { buildExam, examMinutes, examPool, scoreExam, type ExamResult } from "./logic";
import ExamResultView from "./ExamResultView";
import { EXAM_PASS_PERCENT } from "@/features/gamification/rules";

interface Props { locale: Locale; course: Course; unit: Unit; authed: boolean; serverProgress?: GuestProgress | null; serverBest?: { best: number; attempts: number; passed: boolean } | null }
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function ExamRunner({ locale, course, unit, authed, serverProgress, serverBest }: Props) {
  const t = learnStrings[locale]; const ui = uiStrings[locale];
  const { ids, ready, state, guest } = useCompleted(serverProgress);
  const exams = useLocalStore(EXAMS_KEY, examsSchema, emptyExams);
  const [phase, setPhase] = useState<"intro" | "run" | "submitting" | "result">("intro");
  const [seed, setSeed] = useState(""); const [idx, setIdx] = useState(0); const [confirming, setConfirming] = useState(false);
  const [answers, setAnswers] = useState<Record<string, ExerciseResponse>>({}); const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [left, setLeft] = useState(0); const [result, setResult] = useState<ExamResult | null>(null); const [seconds, setSeconds] = useState(0);
  const [newBadge, setNewBadge] = useState(false); const [error, setError] = useState<string | null>(null);
  const startedAt = useRef(0); const deadline = useRef(0); const submitting = useRef(false);
  const questions = useMemo(() => (seed ? buildExam(unit, seed) : []), [unit, seed]);
  const minutes = examMinutes(Math.min(10, examPool(unit).length));
  const unlocked = unitComplete(unit, ids);
  const best = authed ? serverBest : examBestFromLocal(exams.value)[unit.id];
  const back = `/${locale}/learn/${course.id}`;

  const start = () => {
    const s = crypto.randomUUID(); setSeed(s); setAnswers({}); setFlagged(new Set()); setIdx(0); setConfirming(false); setError(null); setResult(null); submitting.current = false;
    startedAt.current = Date.now(); deadline.current = Date.now() + minutes * 60_000; setLeft(minutes * 60); setPhase("run");
  };
  const submit = useCallback(async () => {
    if (submitting.current) return; submitting.current = true; setConfirming(false); setPhase("submitting");
    const secs = Math.min(86_400, Math.round((Date.now() - startedAt.current) / 1000)); setSeconds(secs); setError(null);
    if (authed) {
      const r = await submitExamAction({ courseId: course.id, unitId: unit.id, seed, answers, durationSeconds: secs }).catch(() => null);
      if (!r || !r.ok) { submitting.current = false; setError(t.exSaveError); setPhase("run"); return; }
      setResult(r.data.result); setNewBadge(r.data.newBadge);
    } else {
      const res = scoreExam(questions, answers); setResult(res);
      exams.update((s) => ({ ...s, attempts: [...s.attempts, { unitId: unit.id, percent: res.percent, passed: res.passed, at: Date.now() }].slice(-30) }));
      if (res.passed && !state.badges.includes("exam_pass")) { guest.awardBadge("exam_pass"); setNewBadge(true); } else setNewBadge(false);
    }
    setPhase("result");
  }, [authed, course.id, unit.id, seed, answers, questions, exams, state.badges, guest, t.exSaveError]);

  useEffect(() => {
    if (phase !== "run") return;
    const id = setInterval(() => { const s = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)); setLeft(s); if (s === 0) { clearInterval(id); void submit(); } }, 500);
    return () => clearInterval(id);
  }, [phase, submit]);

  useEffect(() => { if (phase === "result" && result) track("exam_submit", { course_id: course.id, unit_id: unit.id, percent: result.percent, passed: result.passed }); }, [phase, result]); // eslint-disable-line react-hooks/exhaustive-deps

  const box = "rounded-[var(--radius-bubble)] bg-white p-6 shadow-[0_6px_0_#d9d0f0]";
  if (!ready) return <main id="main" className="grid min-h-dvh place-items-center font-bold">{ui.loading}</main>;
  if (phase === "result" && result) return <main id="main" className="mx-auto max-w-xl px-5 py-8"><ExamResultView locale={locale} result={result} seconds={seconds} newBadge={newBadge} guest={!authed} error={error} onRetake={start} backHref={back} /></main>;
  if (phase === "intro" || phase === "submitting" && !result && !questions.length) return (
    <main id="main" className="mx-auto max-w-xl px-5 py-6">
      <Link href={back} className="font-display text-2xl font-extrabold">{""}<BackArrow /> {t.back}</Link>
      <h1 className="mt-4 font-display text-4xl font-extrabold">{t.exTitle}: {unitTitle(unit, locale)}</h1>
      {!unlocked ? <p role="status" className={`mt-6 ${box} font-bold`}>🔒 {t.exLocked}</p> : (
        <div className={`mt-6 grid gap-4 ${box}`}>
          <ul className="grid grid-cols-3 gap-3 text-center font-display text-3xl font-extrabold"><li>{Math.min(10, examPool(unit).length)}<span className="block text-sm font-bold opacity-70">{t.exQuestions}</span></li>
            <li>{minutes}<span className="block text-sm font-bold opacity-70">{t.exMinutes}</span></li><li>{EXAM_PASS_PERCENT}%<span className="block text-sm font-bold opacity-70">{t.exPass}</span></li></ul>
          <p className="font-semibold">{t.exNoFeedback}</p>
          {best && <p className="font-bold text-lagoon-deep">🏆 {t.exYourBest}: {best.best}%</p>}
          {!authed && <p className="text-sm font-semibold opacity-70">{t.exGuestNote}</p>}
          <div><BubbleButton tone="mango" onClick={start}>{best ? t.examRetake : t.exStart}</BubbleButton></div></div>)}
    </main>);

  const answered = questions.filter((q) => answers[q.id]).length; const unanswered = questions.length - answered;
  const q = questions[idx];
  return (
    <SpeechLangContext.Provider value={course.ttsLang}>
    <main id="main" className="mx-auto max-w-2xl px-5 pb-32 pt-5">
      <div className="flex items-center justify-between gap-3 font-display text-xl font-extrabold">
        <span>{t.exQuestion} {idx + 1} {t.exOf} {questions.length}</span>
        <span className={left <= 30 ? "text-coral" : ""} role="timer" aria-label={`${t.exTimeLeft}: ${fmt(left)}`}>⏱ {fmt(left)}</span></div>
      <ol className="mt-3 flex flex-wrap gap-2" aria-label="Questions">{questions.map((qq, k) => (
        <li key={qq.id}><button type="button" onClick={() => setIdx(k)} aria-current={k === idx} aria-label={`${t.exQuestion} ${k + 1}${answers[qq.id] ? ", answered" : ""}${flagged.has(qq.id) ? `, ${t.exFlagged}` : ""}`}
          className={`size-10 rounded-full border-4 font-bold ${k === idx ? "border-plum" : "border-transparent"} ${flagged.has(qq.id) ? "bg-mango" : answers[qq.id] ? "bg-lagoon text-white" : "bg-white"}`}>{k + 1}</button></li>))}</ol>
      {left === 0 && <p role="alert" className="mt-3 font-bold text-coral-deep">{t.exTimeUp}</p>}
      {error && <p role="alert" className="mt-3 font-bold text-coral-deep">{error}</p>}
      <div className="mt-8">{questions.map((qq, k) => (
        <div key={qq.id} hidden={k !== idx}><ExerciseRenderer exercise={qq} locked={phase === "submitting"} active={k === idx} ui={ui}
          onChange={(r) => setAnswers((a) => { const n = { ...a }; if (r) n[qq.id] = r; else delete n[qq.id]; return n; })} /></div>))}</div>
      <div className="fixed inset-x-0 bottom-0 border-t-4 border-mist bg-white px-5 py-4">
        {confirming ? (
          <div role="alertdialog" aria-label={t.exConfirm} className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3">
            <p className="font-bold">{t.exConfirm} {unanswered > 0 && `(${unanswered} ${t.exUnanswered})`}</p>
            <span className="flex gap-3"><BubbleButton tone="white" onClick={() => setConfirming(false)}>{t.exKeep}</BubbleButton><BubbleButton tone="mango" disabled={phase === "submitting"} onClick={() => void submit()}>{phase === "submitting" ? t.exSubmitting : t.exSubmit}</BubbleButton></span></div>
        ) : (
          <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3">
            <span className="flex gap-2"><button type="button" disabled={idx === 0} onClick={() => setIdx(idx - 1)} className="min-h-12 rounded-full border-4 border-mist px-5 font-bold disabled:opacity-40">{t.exPrev}</button>
              <button type="button" disabled={idx >= questions.length - 1} onClick={() => setIdx(idx + 1)} className="min-h-12 rounded-full border-4 border-mist px-5 font-bold disabled:opacity-40">{t.exNext}</button></span>
            <button type="button" aria-pressed={flagged.has(q.id)} onClick={() => setFlagged((f) => { const n = new Set(f); if (n.has(q.id)) n.delete(q.id); else n.add(q.id); return n; })} className="min-h-12 rounded-full px-4 font-bold underline">🚩 {flagged.has(q.id) ? t.exFlagged : t.exFlag}</button>
            <BubbleButton tone="lagoon" onClick={() => setConfirming(true)}>{t.exSubmit}</BubbleButton></div>)}
      </div>
    </main>
    </SpeechLangContext.Provider>);
}
