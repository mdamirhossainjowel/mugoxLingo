"use client";
import { motion } from "framer-motion";
import type { Ui } from "@/i18n/ui";
import { DAILY_GOAL_XP, levelFor } from "@/features/gamification/rules";
import type { GuestProgress } from "@/features/progress/guest";

export default function StatsBar({ state, dailyXp, ui }: { state: GuestProgress; dailyXp: number; ui: Ui }) {
  const pct = Math.min(100, Math.round((dailyXp / DAILY_GOAL_XP) * 100));
  const chip = "rounded-[var(--radius-bubble)] bg-white px-4 py-3 shadow-[0_6px_0_#d9d0f0]";
  const lv = levelFor(state.xp);
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className={`${chip} col-span-3`}>
        <p className="font-display text-xl font-extrabold">🌟 {ui.level} {lv.level} · {ui.levels[Math.min(lv.level - 1, ui.levels.length - 1)]}</p>
        <div className="mt-1 h-3 overflow-hidden rounded-full bg-mist" role="progressbar" aria-label={ui.toNext} aria-valuenow={lv.into} aria-valuemin={0} aria-valuemax={lv.span}>
          <motion.div className="h-full rounded-full bg-mango" initial={{ width: 0 }} animate={{ width: `${(lv.into / lv.span) * 100}%` }} transition={{ type: "spring", stiffness: 100, damping: 16 }} /></div>
        <p className="mt-1 text-sm font-bold opacity-70">{lv.toNext} {ui.toNext}</p>
      </div>
      <div className={chip}><p className="font-display text-3xl font-extrabold text-mango-deep">⚡ {state.xp}</p><p className="text-sm font-bold opacity-70">{ui.xp}</p></div>
      <div className={chip}><p className="font-display text-3xl font-extrabold text-coral">🔥 {state.streak.count}</p><p className="text-sm font-bold opacity-70">{ui.streakDays}</p></div>
      <div className={chip}>
        <p className="font-display text-3xl font-extrabold text-lagoon-deep">{dailyXp}/{DAILY_GOAL_XP}</p>
        <div className="mt-1 h-3 overflow-hidden rounded-full bg-mist" role="progressbar" aria-label={ui.goal} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <motion.div className="h-full rounded-full bg-lagoon" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 100, damping: 16 }} />
        </div>
        <p className="mt-1 text-sm font-bold opacity-70">{ui.goal}</p>
      </div>
    </div>
  );
}
