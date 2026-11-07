"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/dictionaries";
import { authStrings } from "@/i18n/authUi";

export default function AuthLink({ locale }: { locale: Locale }) {
  const t = authStrings[locale];
  const [state, setState] = useState<{ enabled: boolean; signedIn: boolean } | null>(null);
  useEffect(() => {
    let live = true;
    fetch("/api/auth/session", { cache: "no-store" }).then((r) => r.json()).then((j) => live && setState(j)).catch(() => {});
    return () => { live = false; };
  }, []);
  if (!state?.enabled) return null;
  return <Link href={`/${locale}/${state.signedIn ? "account" : "login"}`} className="rounded-full bg-mango px-4 py-2 font-bold shadow-[0_4px_0_var(--color-mango-deep)] transition-transform hover:rotate-2 active:translate-y-1 active:shadow-none">{state.signedIn ? t.account : t.login}</Link>;
}
