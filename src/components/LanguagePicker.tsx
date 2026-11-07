"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { uiStrings } from "@/i18n/ui";
import { languageName } from "@/content/titles";
import BubbleButton from "./BubbleButton";

// Catalogue metadata only. Lesson content lives in src/content (Phase 3).
const languages = [
  { code: "es", native: "Español", name: "Spanish", color: "bg-coral", ready: true, course: "en-es" },
  { code: "en", native: "English", name: "English", color: "bg-lagoon", ready: true, course: "bn-en" },
  { code: "zh-Hans", native: "中文", name: "Chinese", color: "bg-mango", ready: true, course: "en-zh" },
  { code: "ja", native: "日本語", name: "Japanese", color: "bg-plum-soft", ready: true, course: "en-ja" },
  { code: "ko", native: "한국어", name: "Korean", color: "bg-lagoon-deep", ready: true, course: "en-ko" },
  { code: "bn", native: "বাংলা", name: "Bengali", color: "bg-coral-deep", ready: true, course: "en-bn" },
];

export default function LanguagePicker({ d, locale, englishCourse, englishNote }: { d: Dictionary; locale: Locale; englishCourse: string; englishNote?: string }) {
  const ui = uiStrings[locale];
  const reduce = useReducedMotion();
  const [sel, setSel] = useState(languages[0].code);
  const items = languages.map((l) => (l.code === "en" ? { ...l, course: englishCourse } : l));
  const cur = items.find((l) => l.code === sel)!;
  return (
    <section id="languages" className="mx-auto max-w-5xl scroll-mt-6 px-5 py-12">
      <h2 className="font-display text-4xl font-extrabold">{d.pickTitle}</h2>
      <p className="mt-1 font-semibold opacity-70">{d.pickHint}</p>
      <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        {items.map((l, i) => (
          <motion.li key={l.code} initial={reduce ? false : { opacity: 0, scale: 0.8, y: 30 }} whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }} transition={{ type: "spring", stiffness: 300, damping: 16, delay: i * 0.06 }}>
            <motion.button type="button" aria-pressed={sel === l.code} onClick={() => setSel(l.code)}
              whileHover={reduce ? undefined : { rotate: i % 2 ? 3 : -3, scale: 1.05 }} whileTap={reduce ? undefined : { scale: 0.94 }}
              className={`${l.color} relative w-full rounded-[var(--radius-bubble)] p-5 text-start text-white shadow-[0_6px_0_rgba(58,29,92,0.25)] ${sel === l.code ? "ring-4 ring-plum ring-offset-4 ring-offset-mist" : ""}`}>
              <span lang={l.code} className="block font-display text-3xl font-extrabold">{l.native}</span>
              <span className="block font-bold opacity-90">{languageName(l.code.split("-")[0], locale)}</span>
              <span className="mt-3 inline-block rounded-full bg-white/90 px-3 py-1 text-sm font-extrabold text-plum">{l.ready ? d.available : l.course ? ui.demo : d.soon}</span>
            </motion.button>
          </motion.li>
        ))}
      </ul>
      <AnimatePresence mode="wait">
        <motion.div key={cur.code} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-bubble)] bg-white p-6 shadow-[0_6px_0_#d9d0f0]">
          <p className="max-w-md text-lg font-bold">{cur.course ? <><span lang={cur.code}>{cur.native}</span> · {languageName(cur.code.split("-")[0], locale)}{cur.code === "en" && englishNote ? ` (${englishNote})` : ""}</> : d.courseSoon}</p>
          <BubbleButton tone="lagoon" href={cur.course ? `/${locale}/learn/${cur.course}` : undefined} disabled={!cur.course}>{cur.course ? ui.start : d.soon}</BubbleButton>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
