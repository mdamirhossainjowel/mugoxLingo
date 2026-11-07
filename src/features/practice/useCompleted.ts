"use client";
import { useMemo } from "react";
import { useGuestProgress, type GuestProgress } from "@/features/progress/guest";

/** Completed lesson ids from the account when signed in, otherwise from this device. */
export function useCompleted(serverProgress?: GuestProgress | null) {
  const guest = useGuestProgress();
  const state = serverProgress ?? guest.state;
  const ready = serverProgress ? true : guest.ready;
  const ids = useMemo(() => new Set(Object.keys(state.completed)), [state.completed]);
  return { ids, ready, state, guest };
}
