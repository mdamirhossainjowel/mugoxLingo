"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { speakable } from "@/lib/pinyin";

/** The course's speech language (for example zh-CN), provided by lesson, exam and practice screens. */
export const SpeechLangContext = createContext<string | undefined>(undefined);
export const useSpeechLang = () => useContext(SpeechLangContext);

const supported = () => typeof window !== "undefined" && "speechSynthesis" in window;
function pickVoice(lang: string) {
  const prefix = lang.split("-")[0].toLowerCase();
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith(prefix));
  return voices.find((v) => v.lang.toLowerCase().replace("_", "-") === lang.toLowerCase()) ?? voices[0];
}

/** Browser text-to-speech. Voice quality depends on the learner's device; this is not recorded native audio. */
export function useSpeech(lang?: string) {
  const [hasVoice, setHasVoice] = useState(false);
  useEffect(() => {
    if (!supported() || !lang) { setHasVoice(false); return; }
    const check = () => setHasVoice(Boolean(pickVoice(lang)));
    check(); window.speechSynthesis.addEventListener("voiceschanged", check);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", check);
  }, [lang]);
  const speak = useCallback((text: string, slow = false) => {
    if (!supported() || !lang) return false;
    const voice = pickVoice(lang); if (!voice) return false;
    const u = new SpeechSynthesisUtterance(speakable(text)); u.voice = voice; u.lang = voice.lang; u.rate = slow ? 0.55 : 0.9;
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); return true;
  }, [lang]);
  return { hasVoice, speak };
}
