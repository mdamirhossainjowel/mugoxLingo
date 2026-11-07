"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/dictionaries";
import { LOCALES } from "@/i18n/config";
import { authStrings } from "@/i18n/authUi";
import { logoutAction, updateProfileAction } from "@/features/auth/actions";
import { migrateGuestAction, resetCourseAction } from "@/features/progress/actions";
import { loadGuest, STORAGE_KEY } from "@/features/progress/guest-core";
import BubbleButton from "@/components/BubbleButton";

const card = "rounded-[var(--radius-bubble)] bg-white p-5 shadow-[0_6px_0_#d9d0f0]";
const input = "mt-1 min-h-12 w-full rounded-2xl border-4 border-mist bg-white px-3 font-bold focus:border-lagoon";

export function SignOutButton({ locale }: { locale: Locale }) {
  const router = useRouter();
  return <BubbleButton tone="white" onClick={async () => { await logoutAction(); router.push(`/${locale}`); router.refresh(); }}>{authStrings[locale].logout}</BubbleButton>;
}

export function ProfileForm({ locale, courses, courseLabel, initial }: { locale: Locale; courses: { id: string; title: string }[]; courseLabel: string; initial: { displayName: string; interfaceLocale: Locale; courseId: string } }) {
  const t = authStrings[locale]; const router = useRouter();
  const [v, setV] = useState(initial); const [msg, setMsg] = useState<string | null>(null); const [err, setErr] = useState(false);
  const save = async () => {
    setMsg(null);
    const r = await updateProfileAction({ displayName: v.displayName, interfaceLocale: v.interfaceLocale, courseId: v.courseId });
    const error = !r.ok;
    setErr(Boolean(error)); setMsg(error ? t.genericError : t.saved);
    if (!error && v.interfaceLocale !== locale) router.push(`/${v.interfaceLocale}/account`); else router.refresh();
  };
  return (
    <section className={card}><h2 className="font-display text-2xl font-extrabold">{t.profile}</h2>
      <div className="mt-3 grid gap-3">
        <label className="font-bold">{t.displayName}<input className={input} maxLength={50} value={v.displayName} onChange={(e) => setV({ ...v, displayName: e.target.value })} /></label>
        <label className="font-bold">{t.interfaceLang}<select className={input} value={v.interfaceLocale} onChange={(e) => setV({ ...v, interfaceLocale: e.target.value as Locale })}>{LOCALES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}</select></label>
        <label className="font-bold">{courseLabel}<select className={input} value={v.courseId} onChange={(e) => setV({ ...v, courseId: e.target.value })}>{courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</select></label>
        {msg && <p role={err ? "alert" : "status"} className={`font-bold ${err ? "text-coral-deep" : "text-lagoon-deep"}`}>{msg}</p>}
        <div><BubbleButton tone="lagoon" onClick={save}>{t.save}</BubbleButton></div>
      </div></section>);
}

export function ImportBanner({ locale }: { locale: Locale }) {
  const t = authStrings[locale]; const router = useRouter();
  const [count, setCount] = useState(0); const [msg, setMsg] = useState<string | null>(null); const [busy, setBusy] = useState(false);
  useEffect(() => { setCount(Object.keys(loadGuest().state.completed).length); }, []);
  if (count === 0 && !msg) return null;
  const run = async () => {
    setBusy(true);
    const r = await migrateGuestAction(loadGuest().state);
    setBusy(false);
    if (!r.ok) return setMsg(r.error === "rate_limited" ? t.rateLimited : t.genericError);
    try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* storage unavailable: nothing to clear */ }
    setCount(0); setMsg(r.data.imported > 0 ? `${r.data.imported} ${t.importDone}` : t.importNone); router.refresh();
  };
  return (
    <section className={`${card} border-4 border-mango`} role="region" aria-label={t.importTitle}>
      <h2 className="font-display text-2xl font-extrabold">{t.importTitle}</h2>
      {count > 0 && <p className="mt-1 font-semibold">{t.importBody}</p>}
      {msg && <p role="status" className="mt-2 font-bold text-lagoon-deep">{msg}</p>}
      {count > 0 && <div className="mt-3 flex gap-3"><BubbleButton tone="mango" disabled={busy} onClick={run}>{t.importBtn}</BubbleButton><BubbleButton tone="white" onClick={() => setCount(0)}>{t.dismiss}</BubbleButton></div>}
    </section>);
}

export function ResetCourse({ locale, courses }: { locale: Locale; courses: { id: string; title: string }[] }) {
  const t = authStrings[locale]; const router = useRouter();
  const [confirming, setConfirming] = useState<string | null>(null); const [msg, setMsg] = useState<string | null>(null);
  const run = async (id: string) => {
    const r = await resetCourseAction(id); setConfirming(null);
    setMsg(r.ok ? t.resetDone : t.genericError); if (r.ok) router.refresh();
  };
  return (
    <section className={card}><h2 className="font-display text-2xl font-extrabold">{t.resetTitle}</h2>
      <p className="mt-1 font-semibold opacity-80">{t.resetWarn}</p>
      <ul className="mt-3 grid gap-3">{courses.map((c) => (
        <li key={c.id} className="flex flex-wrap items-center justify-between gap-3"><span className="font-bold">{c.title}</span>
          {confirming === c.id
            ? <span role="alertdialog" aria-label={t.resetTitle} className="flex gap-2"><BubbleButton tone="white" onClick={() => setConfirming(null)}>{t.cancel}</BubbleButton><BubbleButton tone="mango" onClick={() => run(c.id)}>{t.resetConfirm}</BubbleButton></span>
            : <button type="button" className="min-h-11 rounded-full border-4 border-mist px-4 font-bold" onClick={() => setConfirming(c.id)}>{t.resetTitle}</button>}
        </li>))}</ul>
      {msg && <p role="status" className="mt-3 font-bold">{msg}</p>}
    </section>);
}
