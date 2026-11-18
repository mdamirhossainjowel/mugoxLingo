"use client";
import { useState } from "react";

/** The contact method: a mailto link and a copy button (for people without a mail app). No form, because the site has no email backend. */
export default function ContactEmail({ email, label, copy, copied }: { email: string; label: string; copy: string; copied: string }) {
  const [done, setDone] = useState(false);
  async function copyEmail() {
    try { await navigator.clipboard.writeText(email); } catch {
      const t = document.createElement("textarea"); t.value = email; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); } catch { /* nothing else to try */ } t.remove();
    }
    setDone(true); setTimeout(() => setDone(false), 3000);
  }
  return (
    <div className="mt-6 rounded-[var(--radius-bubble)] bg-white p-6 shadow-[0_6px_0_#d9d0f0]">
      <p className="font-bold">{label}</p>
      <p className="mt-1 break-all font-display text-2xl font-extrabold" dir="ltr"><a href={`mailto:${email}?subject=MugoX%20Lingo`} className="underline">{email}</a></p>
      <button type="button" onClick={copyEmail} className="mt-4 rounded-full bg-mango px-6 py-3 font-display text-lg font-bold shadow-[0_5px_0_var(--color-mango-deep)] active:translate-y-1 active:shadow-none">{copy}</button>
      <p role="status" className="mt-3 min-h-6 font-bold text-lagoon-deep">{done ? copied : ""}</p>
    </div>);
}
