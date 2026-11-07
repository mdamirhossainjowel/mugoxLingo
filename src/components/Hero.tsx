"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Dictionary } from "@/i18n/dictionaries";
import AnimatedText from "./AnimatedText";
import BubbleButton from "./BubbleButton";
import Mascot from "./Mascot";

const hellos = [
  { text: "¡Hola!", lang: "Español" }, { text: "你好!", lang: "中文" }, { text: "こんにちは!", lang: "日本語" },
  { text: "안녕!", lang: "한국어" }, { text: "হ্যালো!", lang: "বাংলা" }, { text: "Hello!", lang: "English" },
];

export default function Hero({ d }: { d: Dictionary }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [happy, setHappy] = useState(false);
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % hellos.length), 2200);
    return () => clearInterval(t);
  }, [reduce]);
  const h = hellos[i];
  return (
    <section className="mx-auto grid max-w-5xl items-center gap-6 px-5 pb-12 pt-4 md:grid-cols-[1.1fr_1fr]">
      <div>
        <h1 className="font-display text-5xl font-extrabold leading-[1.05] md:text-7xl"><AnimatedText text={d.heroTitle} /></h1>
        <p className="mt-5 max-w-md text-lg font-semibold opacity-80">{d.heroBody}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <BubbleButton href="#languages" tone="mango">{d.cta}</BubbleButton>
          <BubbleButton href="#features" tone="white">{d.ctaSecondary}</BubbleButton>
        </div>
      </div>
      <div className="relative flex min-h-80 items-end justify-center">
        <div className="absolute start-0 top-2 h-28 w-56 md:start-4" aria-live="off">
          <AnimatePresence mode="wait">
            <motion.div key={h.text} initial={{ scale: 0, rotate: -12, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0, y: -20 }} transition={{ type: "spring", stiffness: 420, damping: 15 }}
              className="relative inline-block rounded-[var(--radius-bubble)] bg-white px-6 py-3 shadow-[0_6px_0_#d9d0f0]">
              <span className="block font-display text-4xl font-extrabold">{h.text}</span>
              <span className="block text-sm font-bold text-lagoon-deep">{h.lang}</span>
              <span className="absolute -bottom-3 start-10 size-6 rotate-45 bg-white" />
            </motion.div>
          </AnimatePresence>
        </div>
        <button type="button" onClick={() => { setHappy(true); setTimeout(() => setHappy(false), 1600); }}
          className="rounded-3xl" aria-label={d.mascotLabel}><Mascot label={d.mascotLabel} happy={happy} /></button>
      </div>
    </section>
  );
}
