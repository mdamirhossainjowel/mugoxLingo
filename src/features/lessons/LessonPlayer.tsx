"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { CheckResult, Exercise, ExerciseResponse, Lesson } from "@/types/course";
import type { Locale } from "@/i18n/dictionaries";
import { uiStrings } from "@/i18n/ui";
import { checkAnswer } from "@/features/exercises/check";
import ExerciseRenderer from "@/features/exercises/ExerciseRenderer";
import { MAX_HEARTS } from "@/features/gamification/rules";
import { useGuestProgress } from "@/features/progress/guest";
import { completeLessonAction } from "@/features/progress/actions";
import { dayKey } from "@/features/gamification/rules";
import { authStrings } from "@/i18n/authUi";
import BubbleButton from "@/components/BubbleButton";
import RichText from "@/components/RichText";
import { scoredExercises } from "@/content/courses";
import { SpeechLangContext } from "@/features/speech/speech";
import { track } from "@/features/analytics/ga";
import Mascot from "@/components/Mascot";

interface Props { locale: Locale; courseId: string; lesson: Lesson; nextLessonId: string | null; authed: boolean; accountsEnabled: boolean; lang?: string }
interface Done { xpGained: number; newBadges: string[] }

export default function LessonPlayer({ locale, courseId, lesson, nextLessonId, authed, accountsEnabled, lang }: Props) {
  const ui = uiStrings[locale]; const at = authStrings[locale];
  const reduce = useReducedMotion();
  const { complete, storageOk } = useGuestProgress();
  const attemptId = useRef(`${lesson.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const [queue, setQueue] = useState<Exercise[]>(lesson.exercises);
  const [i, setI] = useState(0);
  const [resp, setResp] = useState<ExerciseResponse | null>(null);
  const [fb, setFb] = useState<CheckResult | null>(null);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [missed, setMissed] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<Done | null>(null);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const firstResponses = useRef<Record<string, ExerciseResponse>>({});
  const started = useRef(false);
  const total = scoredExercises(lesson).length;
  const [combo, setCombo] = useState(0);
  const failed = hearts <= 0;
  const finished = i >= queue.length;
  const ex = queue[i];
  const back = `/${locale}/learn/${courseId}`;

  useEffect(() => {
    if (!finished || failed || started.current) return;
    started.current = true;
    if (!authed) { const r = complete({ attemptId: attemptId.current, lessonId: lesson.id, firstTryCorrect: total - missed.size, total }); setResult({ xpGained: r.xpGained, newBadges: r.newBadges }); return; }
    // Signed in: the server re-scores the first answers itself and awards XP; nothing the browser claims about score is trusted.
    completeLessonAction({ courseId, lessonId: lesson.id, attemptId: attemptId.current, today: dayKey(new Date()), answers: firstResponses.current })
      .then((r) => r.ok ? setResult({ xpGained: r.data.xpGained, newBadges: r.data.newBadges }) : setSaveErr(r.error === "rate_limited" ? at.rateLimited : at.genericError))
      .catch(() => setSaveErr(at.genericError));
  }, [finished, failed, authed, complete, courseId, lesson.id, total, missed, at]);

  useEffect(() => { if (result) track("lesson_complete", { course_id: courseId, lesson_id: lesson.id, perfect: missed.size === 0, signed_in: authed }); }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

  const check = () => {
    if (!ex || !resp || fb) return;
    if (!(ex.id in firstResponses.current)) firstResponses.current[ex.id] = resp;
    const r = checkAnswer(ex, resp); setFb(r);
    if (!r.correct) {
      setHearts((h) => h - 1); setCombo(0); if (ex.type !== "listen") setMissed((m) => new Set(m).add(ex.id)); setQueue((q) => [...q, ex]);
    } else {
      setCombo((c) => c + 1);
    }
  };
  const next = () => { setFb(null); setResp(null); setI((n) => n + 1); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || (e.target instanceof HTMLElement && e.target.tagName === "BUTTON")) return;
      if (fb) next(); else check();
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  });

  const confetti = useMemo(() => Array.from({ length: 24 }, (_, k) => ({ k, x: (k * 41) % 100, d: 0.04 * k, e: ["🎉", "⭐", "✨", "🔥"][k % 4] })), []);
  const pct = Math.min(100, Math.round((Math.min(i, queue.length) / queue.length) * 100));

  if (failed) return (
    <Screen><Mascot label="" /><h1 className="font-display text-4xl font-extrabold">{ui.outOfHearts}</h1>
      <p className="font-semibold opacity-75">{ui.outHint}</p>
      <div className="flex gap-3"><BubbleButton tone="mango" onClick={() => window.location.reload()}>{ui.tryAgain}</BubbleButton>
        <BubbleButton tone="white" href={back}>{ui.backToPath}</BubbleButton></div></Screen>);

  if (finished) return (
    <Screen>
      {!reduce && result && confetti.map((c) => (
        <motion.span key={c.k} aria-hidden className="pointer-events-none fixed top-0 text-3xl" style={{ left: `${c.x}%` }}
          initial={{ y: -40, opacity: 1 }} animate={{ y: "100vh", rotate: 360, opacity: 0 }} transition={{ duration: 2.4, delay: c.d, ease: "easeIn" }}>{c.e}</motion.span>))}
      <Mascot label="" happy />
      <h1 className="font-display text-4xl font-extrabold">{ui.lessonDone}</h1>
      {result && (<>
        <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}
          className="font-display text-6xl font-extrabold text-mango-deep">+{result.xpGained} {ui.xp}</motion.p>
        {missed.size === 0 && <p className="font-bold text-lagoon-deep">{ui.perfect}</p>}
        {result.newBadges.length > 0 && <p className="font-bold">🏅 {ui.newBadges}: {result.newBadges.map((b) => ui.badges[b]).join(", ")}</p>}
      </>)}
      {saveErr && <p role="alert" className="max-w-sm font-bold text-coral-deep">{saveErr}</p>}
      {!authed && !storageOk && <p role="alert" className="max-w-sm text-sm font-bold text-coral-deep">{ui.storageOff}</p>}
      {!authed && <p className="max-w-sm text-sm font-semibold opacity-70">{ui.saveNote}</p>}
      {!authed && accountsEnabled && <Link href={`/${locale}/signup`} className="font-bold underline">{at.syncTitle}: {at.signup}</Link>}
      <div className="flex flex-wrap justify-center gap-3">
        {nextLessonId && <BubbleButton tone="mango" href={`${back}/${nextLessonId}`}>{ui.nextLesson}</BubbleButton>}
        <BubbleButton tone="white" href={back}>{ui.backToPath}</BubbleButton>
      </div>
    </Screen>);

  return (
    <SpeechLangContext.Provider value={lang}>
    <main id="main" className="mx-auto flex min-h-dvh max-w-2xl flex-col px-5 pb-44 pt-5">
      <div className="flex items-center gap-4">
        <Link href={back} aria-label={ui.exit} className="grid size-11 place-items-center rounded-full bg-white text-xl font-bold shadow-[0_4px_0_#d9d0f0]">✕</Link>
        <div className="h-5 flex-1 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
          <motion.div className="h-full rounded-full bg-lagoon" animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 120, damping: 18 }} />
        </div>
        <motion.span key={hearts} initial={reduce ? false : { scale: 1.5 }} animate={{ scale: 1 }} aria-label={`${ui.hearts}: ${hearts}`} className="font-display text-2xl font-extrabold text-coral">♥ {hearts}</motion.span>
      </div>
      {combo >= 3 && <motion.p key={combo} initial={reduce ? false : { scale: 0.6, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 500, damping: 12 }} className="mt-3 self-center rounded-full bg-mango px-4 py-1 font-display text-lg font-extrabold">🔥 {combo} {ui.inARow}</motion.p>}
      <motion.div key={`${i}-${ex.id}`} className="mt-10" initial={reduce ? false : { opacity: 0, x: 40 }}
        animate={fb && !fb.correct && !reduce ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
        <ExerciseRenderer exercise={ex} locked={fb !== null} ui={ui} onChange={setResp} />
      </motion.div>
      <div className={`fixed inset-x-0 bottom-0 border-t-4 px-5 py-4 transition-colors ${fb ? (fb.correct ? "border-lagoon bg-lagoon/20" : "border-coral bg-coral/20") : "border-mist bg-white"}`}>
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <AnimatePresence mode="wait">
            {fb && (<motion.div key={fb.correct ? "ok" : "no"} role="status" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>
              <p className={`font-display text-2xl font-extrabold ${fb.correct ? "text-lagoon-deep" : "text-coral-deep"}`}>{fb.correct ? `${ui.cheers[i % ui.cheers.length]}` : ui.wrong}</p>
              {!fb.correct && <p className="font-bold">{ui.answerWas} <RichText text={fb.expected} /></p>}
              {ex && "explain" in ex && ex.explain && <p className="text-sm font-semibold opacity-80"><RichText text={ex.explain} /></p>}
            </motion.div>)}
          </AnimatePresence>
          <div className="ms-auto"><BubbleButton tone={fb && !fb.correct ? "white" : "lagoon"} disabled={!fb && !resp} onClick={fb ? next : check}>{fb ? ui.cont : ui.check}</BubbleButton></div>
        </div>
      </div>
    </main>
    </SpeechLangContext.Provider>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return <main id="main" className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-4 px-5 text-center">{children}</main>;
}
