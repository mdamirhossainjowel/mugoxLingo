"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { dayKey } from "@/features/gamification/rules";
import { applyCompletion, emptyProgress, loadGuest, saveGuest, type CompletionInput, type GuestProgress } from "./guest-core";
export * from "./guest-core";

export function useGuestProgress() {
  const [state, setState] = useState<GuestProgress>(emptyProgress);
  const [ready, setReady] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const ref = useRef(state);
  useEffect(() => { const r = loadGuest(); ref.current = r.state; setState(r.state); setStorageOk(r.ok); setReady(true); }, []);
  const complete = useCallback((input: CompletionInput) => {
    const r = applyCompletion(ref.current, input);
    if (!r.duplicate) { ref.current = r.state; setStorageOk(saveGuest(r.state)); setState(r.state); }
    return r;
  }, []);
  const awardBadge = useCallback((id: string) => {
    if (ref.current.badges.includes(id)) return;
    const next = { ...ref.current, badges: [...ref.current.badges, id] };
    ref.current = next; setStorageOk(saveGuest(next)); setState(next);
  }, []);
  const dailyXp = state.daily.day === dayKey(new Date()) ? state.daily.xp : 0;
  return { state, ready, storageOk, complete, awardBadge, dailyXp };
}
