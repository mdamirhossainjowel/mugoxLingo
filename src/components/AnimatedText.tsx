"use client";
import { motion, useReducedMotion } from "framer-motion";

/** Splits by grapheme so Bengali conjuncts and accents stay intact. */
function graphemes(text: string): string[] {
  const Seg = (Intl as unknown as { Segmenter?: new (l?: string, o?: { granularity: string }) => { segment(s: string): Iterable<{ segment: string }> } }).Segmenter;
  return Seg ? Array.from(new Seg(undefined, { granularity: "grapheme" }).segment(text), (s) => s.segment) : Array.from(text);
}

export default function AnimatedText({ text, className = "" }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={className} aria-label={text}>
      {graphemes(text).map((g, i) => (
        <motion.span key={`${g}-${i}`} aria-hidden className="inline-block whitespace-pre"
          initial={reduce ? false : { y: 40, opacity: 0, rotate: -8 }} animate={{ y: 0, opacity: 1, rotate: 0 }}
          whileHover={reduce ? undefined : { y: -8, rotate: 6, color: "#ff5a6e" }}
          transition={{ type: "spring", stiffness: 380, damping: 14, delay: reduce ? 0 : i * 0.03 }}>{g}</motion.span>
      ))}
    </span>
  );
}
