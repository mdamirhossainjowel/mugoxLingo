"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Locale } from "@/i18n/dictionaries";
import { authStrings } from "@/i18n/authUi";
import BubbleButton from "@/components/BubbleButton";
import { changePasswordAction, loginAction, signUpAction, type AuthError } from "./actions";

export type AuthMode = "login" | "signup" | "update";
const field = "mt-1 min-h-14 w-full rounded-2xl border-4 border-mist bg-white px-4 font-display text-xl font-bold focus:border-lagoon";

export default function AuthForm({ mode, locale, next, accountsEnabled }: { mode: AuthMode; locale: Locale; next?: string; accountsEnabled: boolean }) {
  const t = authStrings[locale];
  const router = useRouter();
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const schema = z.object({
    email: mode === "update" ? z.string().optional() : z.string().email(t.emailInvalid),
    current: z.string().optional(),
    password: mode === "login" ? z.string().min(1, t.passwordMin) : z.string().min(8, t.passwordMin),
    displayName: z.string().max(50).optional(),
  });
  type Values = z.infer<typeof schema>;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });
  const dest = next && next.startsWith("/") && !next.startsWith("//") ? next : `/${locale}/account`;

  if (!accountsEnabled) return (
    <div role="status" className="rounded-[var(--radius-bubble)] bg-white p-6 font-bold shadow-[0_6px_0_#d9d0f0]">
      <p>{t.notConfigured}</p><div className="mt-4"><BubbleButton href={`/${locale}#languages`} tone="mango">{t.orGuest}</BubbleButton></div>
    </div>);

  const explain = (e: AuthError): string => ({
    badLogin: t.badLogin, exists: t.emailTaken, wrong_password: t.wrongPassword, rate_limited: t.rateLimited, invalid: t.passwordMin,
    not_configured: t.notConfigured, unauthenticated: t.loginRequired, server: t.genericError,
  })[e];

  const onSubmit = async (v: Values) => {
    setMsg(null);
    try {
      const r = mode === "login" ? await loginAction({ email: v.email, password: v.password })
        : mode === "signup" ? await signUpAction({ email: v.email, password: v.password, displayName: v.displayName, locale })
        : await changePasswordAction({ current: v.current ?? "", next: v.password });
      if (!r.ok) return setMsg({ kind: "err", text: explain(r.error) });
      if (mode === "update") { setMsg({ kind: "ok", text: t.passwordUpdated }); router.push(`/${locale}/account`); }
      else { router.push(dest); router.refresh(); }
    } catch { setMsg({ kind: "err", text: t.genericError }); }
  };
  const title = { login: t.login, signup: t.signup, update: t.changePassword }[mode];
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 rounded-[var(--radius-bubble)] bg-white p-6 shadow-[0_6px_0_#d9d0f0]">
      <h1 className="font-display text-3xl font-extrabold">{title}</h1>
      {mode === "signup" && <label className="font-bold">{t.displayName}<input className={field} autoComplete="nickname" {...register("displayName")} /></label>}
      {mode !== "update" && <label className="font-bold">{t.email}<input type="email" dir="ltr" className={field} autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
        {errors.email && <span role="alert" className="block text-sm text-coral-deep">{errors.email.message}</span>}</label>}
      {mode === "update" && <label className="font-bold">{t.currentPassword}<input type="password" className={field} autoComplete="current-password" {...register("current")} /></label>}
      <label className="font-bold">{mode === "update" ? t.newPassword : t.password}<input type="password" className={field} autoComplete={mode === "login" ? "current-password" : "new-password"} aria-invalid={!!errors.password} {...register("password")} />
        {errors.password && <span role="alert" className="block text-sm text-coral-deep">{errors.password.message}</span>}</label>
      {msg && <p role={msg.kind === "err" ? "alert" : "status"} className={`font-bold ${msg.kind === "err" ? "text-coral-deep" : "text-lagoon-deep"}`}>{msg.text}</p>}
      <BubbleButton tone="mango" disabled={isSubmitting} onClick={() => { void handleSubmit(onSubmit)(); }}>{title}</BubbleButton>
      <nav className="flex flex-wrap gap-4 text-sm font-bold">
        {mode === "login" && <Link href={`/${locale}/signup`} className="underline">{t.noAccount} {t.signup}</Link>}
        {mode === "signup" && <Link href={`/${locale}/login`} className="underline">{t.haveAccount} {t.login}</Link>}
      </nav>
    </form>
  );
}
