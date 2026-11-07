"use client";
import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function Confetti({ count = 24 }: { count?: number }) {
  const reduce = useReducedMotion();
  const bits = useMemo(() => Array.from({ length: count }, (_, k) => ({ k, x: (k * 37) % 100, d: 0.04 * k, e: ["🎉", "⭐", "✨", "🔥", "🎈"][k % 5] })), [count]);
  if (reduce) return null;
  return <>{bits.map((c) => (
    <motion.span key={c.k} aria-hidden className="pointer-events-none fixed top-0 z-40 text-3xl" style={{ left: `${c.x}%` }}
      initial={{ y: -40, opacity: 1 }} animate={{ y: "100vh", rotate: 360, opacity: 0 }} transition={{ duration: 2.6, delay: c.d, ease: "easeIn" }}>{c.e}</motion.span>))}</>;
}
