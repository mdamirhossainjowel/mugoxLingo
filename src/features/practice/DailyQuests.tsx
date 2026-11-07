"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/i18n/dictionaries";
import { learnStrings } from "@/i18n/learnUi";
import type { Course } from "@/types/course";
import { courseVocab } from "@/content/courses";
import { DAILY_GOAL_XP, dayKey } from "@/features/gamification/rules";
import BubbleButton from "@/components/BubbleButton";
import Confetti from "@/components/Confetti";
import RichText from "@/components/RichText";
import { ACTIVITY_KEY, activitySchema, emptyActivity, forToday } from "./schemas";
import { useLocalStore } from "./store";

const ALL = ["lesson", "xp", "cards", "speed"] as const;
const dayNumber = (key: string) => { const [y, m, d] = key.split("-").map(Number); return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000); };

export default function DailyQuests({ locale, course, completed, dailyXp }: { locale: Locale; course: Course; completed: Set<string>; dailyXp: number }) {
  const t = learnStrings[locale]; const reduce = useReducedMotion();
  const activity = useLocalStore(ACTIVITY_KEY, activitySchema, emptyActivity);
  const today = dayKey(new Date()); const n = dayNumber(today);
  const a = forToday(activity.value, today);
  const quests = ALL.filter((_, i) => i !== n % ALL.length); // the set rotates daily
  const progress: Record<string, number> = { lesson: dailyXp > 0 ? 1 : 0, xp: Math.min(dailyXp / DAILY_GOAL_XP, 1), cards: Math.min(a.cardsReviewed / 5, 1), speed: Math.min(a.speedRounds, 1) };
  const all = quests.every((q) => progress[q] >= 1); const opened = a.chestDay === today;
  const vocab = courseVocab(course, completed); const word = vocab.length ? vocab[n % vocab.length] : null;
  return (
    <section className="rounded-[var(--radius-bubble)] bg-white p-5 shadow-[0_6px_0_#d9d0f0]" aria-labelledby="quests">
      <h3 id="quests" className="font-display text-2xl font-extrabold">🎯 {t.questsTitle}</h3>
      <ul className="mt-3 grid gap-3">{quests.map((q) => (
        <li key={q}><div className="flex justify-between font-bold"><span>{progress[q] >= 1 ? "✅" : "⬜"} {t.quests[q]}</span></div>
          <div className="mt-1 h-3 overflow-hidden rounded-full bg-mist" role="progressbar" aria-label={t.quests[q]} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress[q] * 100)}>
            <motion.div className="h-full rounded-full bg-lagoon" initial={{ width: 0 }} animate={{ width: `${progress[q] * 100}%` }} transition={{ type: "spring", stiffness: 100, damping: 16 }} /></div></li>))}</ul>
      <div className="mt-4 grid justify-items-start gap-2">
        <motion.span aria-hidden className="text-5xl" animate={all && !opened && !reduce ? { rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.15, 1] } : undefined} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }}>{opened ? "🎁" : "📦"}</motion.span>
        {!all && !opened && <p className="font-semibold">{t.chestLocked}</p>}
        {all && !opened && <BubbleButton tone="mango" onClick={() => activity.update((x) => ({ ...forToday(x, today), chestDay: today }))}>{t.chestOpen}</BubbleButton>}
        {opened && <><Confetti count={16} /><p className="font-display text-xl font-extrabold">{t.bonusWord}</p>
          <p className="rounded-2xl bg-mango px-4 py-2 font-display text-2xl font-extrabold">{word ? <><RichText text={word.term} /> = {word.meaning}</> : t.chestEmpty}</p></>}
      </div>
      <p className="mt-3 text-sm font-semibold opacity-70">{t.questsNote}</p>
    </section>);
}
