"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ZodType, ZodTypeDef } from "zod";

/** Validated localStorage state. Corrupted or unavailable storage falls back to the empty value. */
export function useLocalStore<T>(key: string, schema: ZodType<T, ZodTypeDef, unknown>, empty: () => T) {
  const [value, setValue] = useState<T>(empty);
  const [ready, setReady] = useState(false);
  const ref = useRef(value);
  useEffect(() => {
    let v = empty();
    try { const raw = window.localStorage.getItem(key); if (raw) { const p = schema.safeParse(JSON.parse(raw)); if (p.success) v = p.data; } } catch { /* storage blocked: use empty state */ }
    ref.current = v; setValue(v); setReady(true);
  }, [key, schema, empty]);
  const update = useCallback((fn: (v: T) => T) => {
    const next = fn(ref.current); ref.current = next; setValue(next);
    try { window.localStorage.setItem(key, JSON.stringify(next)); } catch { /* keep in memory only */ }
  }, [key]);
  return { value, update, ready };
}
