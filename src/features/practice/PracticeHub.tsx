"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Course } from "@/types/course";
import type { Locale } from "@/i18n/dictionaries";
import { learnStrings } from "@/i18n/learnUi";
import { courseVocab, unitComplete } from "@/content/courses";
import { dayKey, xpMultiplier } from "@/features/gamification/rules";
import type { ExamBest } from "@/features/progress/server";
import { ForwardArrow } from "@/components/Arrows";
import { unitTitle } from "@/content/titles";
import DailyQuests from "./DailyQuests";
import { EXAMS_KEY, emptyExams, examBestFromLocal, examsSchema } from "./schemas";
import { useLocalStore } from "./store";

const tile = "block rounded-[var(--radius-bubble)] bg-white p-5 shadow-[0_6px_0_#d9d0f0]";

export default function PracticeHub({ locale, course, completed, dailyXp, serverExamBest }: { locale: Locale; course: Course; completed: Set<string>; dailyXp: number; serverExamBest?: Record<string, ExamBest> | null }) {
  const t = learnStrings[locale]; const reduce = useReducedMotion();
  const exams = useLocalStore(EXAMS_KEY, examsSchema, emptyExams);
  const best = serverExamBest ?? examBestFromLocal(exams.value);
  const words = courseVocab(course, completed).length;
  const boost = xpMultiplier(dayKey(new Date())) > 1;
  const base = `/${locale}/learn/${course.id}`;
  const hover = reduce ? undefined : { y: -6, rotate: -1.5 };
  return (
    <section className="mt-10 grid gap-5" aria-labelledby="practice">
      <h2 id="practice" className="font-display text-3xl font-extrabold">{t.practiceTitle}</h2>
      {boost && (
        <motion.div role="status" initial={reduce ? false : { scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 12 }}
          className="flex items-center gap-4 rounded-[var(--radius-bubble)] bg-mango p-5 shadow-[0_6px_0_var(--color-mango-deep)]">
          <motion.span aria-hidden className="text-5xl" animate={reduce ? undefined : { rotate: [0, 12, -12, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>🚀</motion.span>
          <div><p className="font-display text-2xl font-extrabold">{t.boostTitle}</p><p className="font-bold">{t.boostBody}</p></div></motion.div>)}
      <DailyQuests locale={locale} course={course} completed={completed} dailyXp={dailyXp} />
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div whileHover={hover}><Link href={`${base}/flashcards`} className={tile}><span aria-hidden className="text-4xl">🃏</span>
          <p className="font-display text-2xl font-extrabold">{t.flashcards}</p><p className="font-semibold opacity-75">{words} {t.flashcardsBody}</p></Link></motion.div>
        <motion.div whileHover={hover}><Link href={`${base}/speed`} className={tile}><span aria-hidden className="text-4xl">⚡</span>
          <p className="font-display text-2xl font-extrabold">{t.speed}</p><p className="font-semibold opacity-75">{t.speedBody}</p></Link></motion.div>
      </div>
      <div><h3 className="font-display text-2xl font-extrabold">📝 {t.exams}</h3>
        <ul className="mt-3 grid gap-3">{course.units.map((u) => {
          const open = unitComplete(u, completed); const b = best[u.id];
          const body = (<><span><span className="block font-display text-xl font-extrabold">{unitTitle(u, locale)}</span>
            <span className="block text-sm font-semibold opacity-75">{open ? (b ? `🏆 ${t.examBest}: ${b.best}%${b.passed ? " ✓" : ""}` : t.examTake) : `🔒 ${t.examLocked}`}</span></span>
            <span aria-hidden className="font-display text-2xl">{open ? <ForwardArrow /> : null}</span></>);
          return (<li key={u.id}>{open ? <motion.div whileHover={reduce ? undefined : { x: 6 }}><Link href={`${base}/exam/${u.id}`} className={`${tile} flex items-center justify-between`}>{body}</Link></motion.div>
            : <div className={`${tile} flex items-center justify-between opacity-60`}>{body}</div>}</li>);
        })}</ul></div>
    </section>);
}
