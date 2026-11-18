"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { speakable } from "@/lib/pinyin";

/** The course's speech language (for example zh-CN), provided by lesson, exam and practice screens. */
export const SpeechLangContext = createContext<string | undefined>(undefined);
export const useSpeechLang = () => useContext(SpeechLangContext);

const synthesis = () => (typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined" ? window.speechSynthesis : null);
function pickVoice(synth: SpeechSynthesis, lang: string) {
  const prefix = lang.split("-")[0].toLowerCase();
  const voices = synth.getVoices().filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith(prefix));
  return voices.find((v) => v.lang.toLowerCase().replace("_", "-") === lang.toLowerCase()) ?? voices[0];
}
/** Some mobile browsers drop an utterance's events if nothing references it, so we keep them until they finish. */
const alive = new Set<SpeechSynthesisUtterance>();

/**
 * Browser text-to-speech (not recorded native audio: quality depends on the device).
 * Built for phones: it does not wait for a voice list (many phones report none until the first call),
 * does not cancel right before speaking (that drops the sound on Android and iPhone), and tells the learner when nothing played.
 */
export function useSpeech(lang?: string) {
  const [canSpeak, setCanSpeak] = useState(false);
  const [voiceFound, setVoiceFound] = useState(false);
  const [failed, setFailed] = useState(false);
  const watchdog = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const synth = synthesis();
    setCanSpeak(Boolean(synth && lang));
    if (!synth || !lang) return;
    const check = () => setVoiceFound(Boolean(pickVoice(synth, lang)));
    check();
    synth.addEventListener?.("voiceschanged", check);
    const poll = setInterval(check, 700); // some phones never fire voiceschanged
    const stop = setTimeout(() => clearInterval(poll), 6000);
    return () => { synth.removeEventListener?.("voiceschanged", check); clearInterval(poll); clearTimeout(stop); };
  }, [lang]);

  /** `auto` is for playback the page starts by itself: browsers may block it, so a failure is not shown as an error. */
  const speak = useCallback((text: string, slow = false, auto = false) => {
    const synth = synthesis();
    if (!synth || !lang) return false;
    const u = new SpeechSynthesisUtterance(speakable(text));
    const voice = pickVoice(synth, lang);
    if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = lang; // let the phone choose when its list is empty
    u.rate = slow ? 0.55 : 0.9; u.volume = 1;
    alive.add(u); clearTimeout(watchdog.current); setFailed(false);
    u.onstart = () => { clearTimeout(watchdog.current); setFailed(false); };
    u.onend = () => { alive.delete(u); clearTimeout(watchdog.current); };
    u.onerror = (e) => { alive.delete(u); clearTimeout(watchdog.current); if (!auto && e.error !== "interrupted" && e.error !== "canceled") setFailed(true); };
    if (!auto) watchdog.current = setTimeout(() => setFailed(true), 3000); // nothing started: silent mode, no voice, or blocked
    if (synth.speaking || synth.pending) synth.cancel();
    try { synth.resume?.(); synth.speak(u); }
    catch { alive.delete(u); clearTimeout(watchdog.current); setFailed(true); return false; } // some phones throw instead of staying silent
    return true;
  }, [lang]);

  return { canSpeak, voiceFound, failed, speak, hasVoice: canSpeak };
}
