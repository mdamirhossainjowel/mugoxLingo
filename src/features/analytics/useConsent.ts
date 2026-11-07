"use client";
import { useEffect, useState } from "react";
import { CONSENT_CHANGED, readConsent, type Consent } from "./ga";

/** The visitor's cookie choice, kept in sync when they change it from the banner or the footer. */
export function useConsent(): Consent {
  const [consent, setConsent] = useState<Consent>(null);
  useEffect(() => {
    setConsent(readConsent());
    const on = () => setConsent(readConsent());
    window.addEventListener(CONSENT_CHANGED, on); return () => window.removeEventListener(CONSENT_CHANGED, on);
  }, []);
  return consent;
}
