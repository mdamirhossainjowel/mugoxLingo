"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BackArrow } from "@/components/Arrows";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Course } from "@/types/course";
import type { Locale } from "@/i18n/dictionaries";
import { learnStrings } from "@/i18n/learnUi";
import { courseVocab, type VocabCard } from "@/content/courses";
import { dayKey } from "@/features/gamification/rules";
import type { GuestProgress } from "@/features/progress/guest-core";
import BubbleButton from "@/components/BubbleButton";
import Confetti from "@/components/Confetti";
import RichText from "@/components/RichText";
import SpeakButton from "@/features/speech/SpeakButton";
import { plainText } from "@/lib/pinyin";
import { ACTIVITY_KEY, activitySchema, emptyActivity, emptyFlashcards, FLASHCARD_KEY, flashcardSchema, forToday } from "./schemas";
import { useLocalStore } from "./store";
import { useCompleted } from "./useCompleted";

const SESSION_SIZE = 10;

export default function FlashcardsPlayer({ locale, course, serverProgress }: { locale: Locale; course: Course; serverProgress?: GuestProgress | null }) {
  const t = learnStrings[locale]; const reduce = useReducedMotion();
  const { ids, ready } = useCompleted(serverProgress);
  const deck = useMemo(() => courseVocab(course, ids), [course, ids]);
  const cards = useLocalStore(FLASHCARD_KEY, flashcardSchema, emptyFlashcards);
  const activity = useLocalStore(ACTIVITY_KEY, activitySchema, emptyActivity);
  const [session, setSession] = useState<VocabCard[] | null>(null);
  const [i, setI] = useState(0); const [flipped, setFlipped] = useState(false);

  const start = useCallback(() => {
    const boxOf = (c: VocabCard) => cards.value.cards[c.id]?.box ?? 1;
    setSession([...deck].sort((a, b) => boxOf(a) - boxOf(b)).slice(0, SESSION_SIZE)); setI(0); setFlipped(false);
  }, [deck, cards.value]);
  useEffect(() => { if (ready && cards.ready && !session && deck.length) start(); }, [ready, cards.ready, session, deck.length, start]);

  const card = session?.[i]; const done = session !== null && i >= session.length;
  const rate = useCallback((know: boolean) => {
    if (!card || !flipped) return;
    cards.update((s) => ({ ...s, cards: { ...s.cards, [card.id]: { box: know ? (Math.min(3, (s.cards[card.id]?.box ?? 1) + 1) as 1 | 2 | 3) : 1 } } }));
    activity.update((a) => { const x = forToday(a, dayKey(new Date())); return { ...x, cardsReviewed: x.cardsReviewed + 1 }; });
    setFlipped(false); setI((n) => n + 1);
  }, [card, flipped, cards, activity]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLButtonElement || done || !card) return;
      if (e.key === " ") { e.preventDefault(); setFlipped((f) => !f); } else if (e.key === "1") rate(false); else if (e.key === "2") rate(true);
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [card, done, rate]);

  const counts = [1, 2, 3].map((b) => deck.filter((c) => (cards.value.cards[c.id]?.box ?? 1) === b).length);
  const face = "absolute inset-0 grid place-items-center rounded-[var(--radius-bubble)] p-6 text-center [backface-visibility:hidden]";
  return (
    <main id="main" className="mx-auto max-w-xl px-5 py-6">
      <Link href={`/${locale}/learn/${course.id}`} className="font-display text-2xl font-extrabold">{""}<BackArrow /> {t.back}</Link>
      <h1 className="mt-4 font-display text-4xl font-extrabold">{t.fcTitle}</h1>
      <p className="mt-1 text-sm font-bold opacity-70">{t.forFun}</p>
      {ready && deck.length === 0 && <p className="mt-8 rounded-[var(--radius-bubble)] bg-white p-6 font-bold shadow-[0_6px_0_#d9d0f0]">{t.fcEmpty}</p>}
      {card && !done && (<>
        <p className="mt-6 text-center font-bold" aria-live="polite">{session!.length - i} {t.cardsLeft}</p>
        <div className="mt-3 [perspective:1000px]">
          <motion.button type="button" aria-pressed={flipped} onClick={() => setFlipped((f) => !f)} aria-label={`${plainText(card.term)}. ${t.tapToFlip}`}
            className="relative block h-64 w-full [transform-style:preserve-3d]" animate={{ rotateY: reduce ? 0 : flipped ? 180 : 0 }} transition={{ type: "spring", stiffness: 160, damping: 16 }}>
            <span aria-hidden={flipped} className={`${face} bg-white font-display text-5xl font-extrabold shadow-[0_8px_0_#d9d0f0] ${reduce && flipped ? "invisible" : ""}`}><RichText text={card.term} /></span>
            <span aria-hidden={!flipped} className={`${face} bg-mango font-display text-4xl font-extrabold shadow-[0_8px_0_var(--color-mango-deep)] ${reduce ? (flipped ? "" : "invisible") : "[transform:rotateY(180deg)]"}`}><RichText text={card.meaning} /></span>
          </motion.button>
        </div>
        <div className="mt-4 flex justify-center"><SpeakButton text={card.term} lang={course.ttsLang} /></div>
        <p className="mt-3 text-center text-sm font-semibold opacity-70">{t.tapToFlip} · {t.flipHint}</p>
        <AnimatePresence>{flipped && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 flex justify-center gap-4">
            <BubbleButton tone="white" onClick={() => rate(false)}>{t.again}</BubbleButton><BubbleButton tone="lagoon" onClick={() => rate(true)}>{t.gotIt}</BubbleButton>
          </motion.div>)}</AnimatePresence>
      </>)}
      {done && (
        <div className="mt-8 grid justify-items-center gap-4 text-center"><Confetti />
          <h2 className="font-display text-4xl font-extrabold">{t.fcDone} 🎉</h2>
          <ul className="flex gap-3">{counts.map((n, k) => <li key={k} className="rounded-2xl bg-white px-4 py-2 font-bold shadow-[0_4px_0_#d9d0f0]">{t.boxes[k + 1]}: {n}</li>)}</ul>
          <div className="flex gap-3"><BubbleButton tone="mango" onClick={start}>{t.reviewAgain}</BubbleButton><BubbleButton tone="white" href={`/${locale}/learn/${course.id}`}>{t.back}</BubbleButton></div>
        </div>)}
    </main>);
}
