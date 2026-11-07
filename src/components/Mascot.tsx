"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Mugo: an original mango-shaped mascot. Pupils follow the pointer. */
export default function Mascot({ label, happy = false }: { label: string; happy?: boolean }) {
  const reduce = useReducedMotion();
  const [look, setLook] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (reduce) return;
    const move = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2, ny = (e.clientY / window.innerHeight - 0.5) * 2;
      setLook({ x: nx * 5, y: ny * 4 });
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [reduce]);
  return (
    <motion.svg viewBox="0 0 200 220" role="img" aria-label={label} className="h-56 w-52 drop-shadow-[0_14px_0_rgba(58,29,92,0.12)]"
      animate={reduce ? undefined : { y: [0, -12, 0], rotate: happy ? [0, -6, 6, 0] : [-2, 2, -2] }}
      transition={{ duration: happy ? 0.8 : 3.2, repeat: Infinity, ease: "easeInOut" }}>
      <path d="M100 18c-8-14-26-16-34-12 10 2 20 8 24 18" fill="#14b8a6" />
      <path d="M100 30c58 0 92 40 92 92 0 52-38 90-92 90S8 174 8 122c0-52 34-92 92-92z" fill="#ffb020" />
      <ellipse cx="62" cy="70" rx="22" ry="12" fill="#fff" opacity=".35" transform="rotate(-25 62 70)" />
      <circle cx="40" cy="140" r="14" fill="#ff5a6e" opacity=".55" /><circle cx="160" cy="140" r="14" fill="#ff5a6e" opacity=".55" />
      {[68, 132].map((cx) => (
        <g key={cx}><circle cx={cx} cy="112" r="20" fill="#fff" />
          <g className="blink"><circle cx={cx + look.x} cy={112 + look.y} r="10" fill="#3a1d5c" /><circle cx={cx + look.x + 3} cy={108 + look.y} r="3" fill="#fff" /></g></g>
      ))}
      <path d={happy ? "M78 150q22 34 44 0z" : "M82 152q18 18 36 0"} fill={happy ? "#3a1d5c" : "none"} stroke="#3a1d5c" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}
