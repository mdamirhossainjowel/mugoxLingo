"use client";
import { BRAND } from "@/lib/brand";
import { BackArrow } from "@/components/Arrows";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Course } from "@/types/course";
import type { Locale } from "@/i18n/dictionaries";
import { uiStrings } from "@/i18n/ui";
import Link2 from "next/link";
import { useGuestProgress } from "@/features/progress/guest";
import type { GuestProgress } from "@/features/progress/guest-core";
import { dayKey } from "@/features/gamification/rules";
import { authStrings } from "@/i18n/authUi";
import StatsBar from "@/components/StatsBar";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { siteStrings } from "@/i18n/siteUi";
import { courseTitle, lessonObjective, lessonTitle, unitTitle } from "@/content/titles";
import PracticeHub from "@/features/practice/PracticeHub";
import ChineseTools from "@/features/practice/ChineseTools";
import type { ExamBest } from "@/features/progress/server";
import BubbleButton from "@/components/BubbleButton";

export default function CoursePath({ locale, course, serverProgress, accountsEnabled, examBest }: { locale: Locale; course: Course; serverProgress?: GuestProgress | null; accountsEnabled?: boolean; examBest?: Record<string, ExamBest> | null }) {
  const at = authStrings[locale];
  const ui = uiStrings[locale];
  const reduce = useReducedMotion();
  const guest = useGuestProgress();
  const state = serverProgress ?? guest.state;
  const ready = serverProgress ? true : guest.ready;
  const storageOk = serverProgress ? true : guest.storageOk;
  const dailyXp = state.daily.day === dayKey(new Date()) ? state.daily.xp : 0;
  const flat = course.units.flatMap((u) => u.lessons);
  const currentIdx = Math.max(0, flat.findIndex((l) => !state.completed[l.id]));
  const allDone = flat.every((l) => state.completed[l.id]);
  const target = flat[allDone ? 0 : currentIdx];
  return (
    <main id="main" className="mx-auto max-w-2xl px-5 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={`/${locale}`} className="font-display text-2xl font-extrabold"><BackArrow /> {BRAND.name}</Link>
        <LocaleSwitcher locale={locale} label={siteStrings[locale].language} />
      </div>
      <h1 className="mt-4 font-display text-4xl font-extrabold">{courseTitle(course, locale)}</h1>
      {course.status === "demo" && <p className="mt-1 inline-block rounded-full bg-mango px-3 py-1 text-sm font-extrabold">{ui.demo}</p>}
      <div className="mt-5"><StatsBar state={state} dailyXp={dailyXp} ui={ui} /></div>
      {course.to === "zh" && course.ttsLang && <ChineseTools locale={locale} lang={course.ttsLang} />}
      {!storageOk && <p role="alert" className="mt-3 text-sm font-bold text-coral-deep">{ui.storageOff}</p>}
      <div className="mt-6"><BubbleButton tone="mango" href={`/${locale}/learn/${course.id}/${target.id}`} disabled={!ready}>{allDone ? ui.replay : ui.continueLearning}</BubbleButton></div>
      <PracticeHub locale={locale} course={course} completed={new Set(Object.keys(state.completed))} dailyXp={dailyXp} serverExamBest={examBest} />
      {course.units.map((u) => (
        <section key={u.id} className="mt-10">
          <h2 className="font-display text-2xl font-extrabold">{unitTitle(u, locale)}</h2>
          <ol className="mt-4 grid gap-4">
            {u.lessons.map((l) => {
              const idx = flat.indexOf(l); const done = Boolean(state.completed[l.id]);
              const open = ready && (done || idx <= currentIdx || allDone);
              const cur = ready && idx === currentIdx && !allDone;
              const body = (<>
                <motion.span aria-hidden className={`grid size-14 shrink-0 place-items-center rounded-full font-display text-2xl font-extrabold ${done ? "bg-lagoon text-white" : cur ? "bg-mango" : "bg-mist"}`}
                  animate={cur && !reduce ? { scale: [1, 1.12, 1] } : undefined} transition={{ duration: 1.4, repeat: Infinity }}>{done ? "✓" : open ? "★" : "🔒"}</motion.span>
                <span><span className="block font-display text-xl font-extrabold">{lessonTitle(l, locale)}</span><span className="block text-sm font-semibold opacity-70">{lessonObjective(l, course, locale)}</span></span>
              </>);
              const cls = "flex items-center gap-4 rounded-[var(--radius-bubble)] bg-white p-4 shadow-[0_6px_0_#d9d0f0]";
              return (<li key={l.id}>{open
                ? <motion.div whileHover={reduce ? undefined : { x: 6 }}><Link href={`/${locale}/learn/${course.id}/${l.id}`} className={cls}>{body}</Link></motion.div>
                : <div className={`${cls} opacity-60`} aria-label={`${lessonTitle(l, locale)} (${ui.locked})`}>{body}</div>}</li>);
            })}
          </ol>
        </section>
      ))}
      {!serverProgress && (
        <div className="mt-10 rounded-[var(--radius-bubble)] bg-white p-5 shadow-[0_6px_0_#d9d0f0]">
          <p className="text-sm font-semibold opacity-70">{ui.saveNote}</p>
          {accountsEnabled && <><p className="mt-2 font-display text-xl font-extrabold">{at.syncTitle}</p><p className="font-semibold">{at.syncBody}</p>
            <Link2 href={`/${locale}/signup`} className="mt-3 inline-block rounded-full bg-lagoon px-5 py-2 font-bold text-white">{at.signup}</Link2></>}
        </div>)}
    </main>
  );
}
