"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const tones = {
  mango: "bg-mango text-plum shadow-[0_6px_0_var(--color-mango-deep)]",
  lagoon: "bg-lagoon text-white shadow-[0_6px_0_var(--color-lagoon-deep)]",
  white: "bg-white text-plum shadow-[0_6px_0_#d9d0f0]",
} as const;

type Props = { children: React.ReactNode; tone?: keyof typeof tones; href?: string; onClick?: () => void; disabled?: boolean };

export default function BubbleButton({ children, tone = "mango", href, onClick, disabled }: Props) {
  const reduce = useReducedMotion();
  const cls = `inline-flex min-h-14 items-center justify-center rounded-full px-8 font-display text-xl font-bold ${tones[tone]} ${disabled ? "opacity-50" : ""}`;
  const motionProps = disabled || reduce ? {} : {
    whileHover: { scale: 1.06, rotate: -2 }, whileTap: { scale: 0.96, y: 5, boxShadow: "0 1px 0 rgba(0,0,0,0)" },
    transition: { type: "spring" as const, stiffness: 500, damping: 12 },
  };
  if (href) return <motion.span className="inline-block" {...motionProps}><Link href={href} className={cls}>{children}</Link></motion.span>;
  return <motion.button type="button" onClick={onClick} disabled={disabled} className={cls} {...motionProps}>{children}</motion.button>;
}
