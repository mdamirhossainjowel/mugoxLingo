"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { Dictionary } from "@/i18n/dictionaries";

export default function Features({ d }: { d: Dictionary }) {
  const reduce = useReducedMotion();
  return (
    <section id="features" className="mx-auto max-w-5xl scroll-mt-6 px-5 py-12">
      <h2 className="font-display text-4xl font-extrabold">{d.featuresTitle}</h2>
      <ul className="mt-6 grid gap-5 md:grid-cols-3">
        {d.features.map((f, i) => (
          <motion.li key={f.title} initial={reduce ? false : { opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            whileHover={reduce ? undefined : { y: -8, rotate: i === 1 ? 2 : -2 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.1 }}
            className="rounded-[var(--radius-bubble)] bg-white p-6 shadow-[0_6px_0_#d9d0f0]">
            <motion.span aria-hidden className="inline-block text-5xl" animate={reduce ? undefined : { rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2 + i, ease: "easeInOut" }}>{f.icon}</motion.span>
            <h3 className="mt-3 font-display text-2xl font-extrabold">{f.title}</h3>
            <p className="mt-1 font-semibold opacity-75">{f.body}</p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
