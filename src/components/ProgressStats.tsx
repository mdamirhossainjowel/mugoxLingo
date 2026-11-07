"use client";
import type { Locale } from "@/i18n/dictionaries";
import { uiStrings } from "@/i18n/ui";
import { dayKey } from "@/features/gamification/rules";
import type { GuestProgress } from "@/features/progress/guest-core";
import StatsBar from "./StatsBar";

/** Stats for server-backed progress; "today" is decided in the browser so it matches the learner's local day. */
export default function ProgressStats({ state, locale }: { state: GuestProgress; locale: Locale }) {
  const dailyXp = state.daily.day === dayKey(new Date()) ? state.daily.xp : 0;
  return <StatsBar state={state} dailyXp={dailyXp} ui={uiStrings[locale]} />;
}
