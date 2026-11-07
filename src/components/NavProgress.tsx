"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Shows a thin progress bar as soon as an internal link is clicked, until the new page arrives.
 * Without it a slow first visit (the dev server compiles each page on demand) looks like a dead button.
 */
export default function NavProgress({ label }: { label: string }) {
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);
  const [slow, setSlow] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  useEffect(() => { clear(); setBusy(false); setSlow(false); }, [pathname]);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || (url.pathname === window.location.pathname && url.search === window.location.search)) return;
      clear(); setBusy(true);
      timers.current = [setTimeout(() => setSlow(true), 1200), setTimeout(() => { setBusy(false); setSlow(false); }, 60_000)];
    };
    document.addEventListener("click", onClick, true);
    return () => { document.removeEventListener("click", onClick, true); clear(); };
  }, []);

  if (!busy) return null;
  return (
    <>
      <div role="progressbar" aria-label={label} aria-busy="true" className="fixed inset-x-0 top-0 z-[60] h-1.5 overflow-hidden bg-plum/10">
        <div className="nav-progress-bar h-full w-1/3 rounded-full bg-mango" />
      </div>
      {slow && <p role="status" className="fixed bottom-4 start-1/2 z-[60] -translate-x-1/2 rounded-full bg-plum px-5 py-2 font-bold text-white shadow-lg rtl:translate-x-1/2">⏳ {label}</p>}
    </>
  );
}
