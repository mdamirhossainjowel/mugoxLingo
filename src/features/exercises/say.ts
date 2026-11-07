import type { Exercise } from "@/types/course";

/** Target-language text to read aloud for an exercise, if any. */
export function sayFor(ex: Exercise): string | null {
  if (ex.type === "listen") return ex.say;
  if (ex.type === "mcq") { if (ex.say) return ex.say; const m = ex.prompt.match(/^What does “(.+)” mean\?$/); if (m) return m[1]; }
  return null;
}
