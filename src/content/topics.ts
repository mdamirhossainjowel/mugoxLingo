import type { TopicKey } from "@/i18n/catalog";

const EXPLICIT: Record<string, TopicKey> = {
  "es-greetings-1": "greetings", "es-greetings-2": "meeting", "es-numbers-1": "numbers_1_5", "es-food-1": "food", "es-family-1": "family", "es-colors-1": "colors",
  "es-animals-1": "animals", "es-days-1": "days", "es-places-1": "places", "es-phrases-1": "phrases", "es-verbs-1": "verbs", "es-time-1": "time",
  "zh-tones-1": "tones", "zh-greetings-1": "greetings", "zh-intro-1": "intro", "zh-family-1": "family", "zh-numbers-1": "numbers_1_5", "zh-numbers-2": "numbers_6_10",
  "zh-food-1": "food", "zh-time-1": "time", "zh-shopping-1": "shopping", "zh-verbs-1": "verbs", "zh-colors-1": "colors",
  "ja-hiragana-1": "kana_vowels", "ja-hiragana-2": "kana_k", "ja-hiragana-3": "kana_s", "ja-hiragana-4": "kana_t", "ja-greetings-1": "greetings",
  "ja-numbers-1": "numbers_1_5", "ja-food-1": "food", "ja-family-1": "family",
  "ko-hangul-1": "hangul_vowels", "ko-hangul-2": "hangul_consonants", "ko-greetings-1": "greetings", "ko-numbers-1": "numbers_1_5", "ko-food-1": "food",
  "ko-intro-1": "intro", "ko-family-1": "family", "ko-colors-1": "colors",
  "bn-first-1": "first_words", "bn-people-1": "people", "bn-greetings-1": "greetings", "bn-numbers-1": "numbers_1_5", "bn-colors-1": "colors", "bn-food-1": "food",
  "en-greetings-1": "greetings", "en-numbers-1": "numbers_1_5", "en-colors-1": "colors", "en-family-1": "family", "en-food-1": "food", "en-animals-1": "animals", "en-days-1": "days",
};
const ENGLISH_FOR = /^[a-z]{2}en-(greetings|colors|family|food|animals|days)-1$/;
const ENGLISH_FOR_NUMBERS = /^[a-z]{2}en-numbers-1$/;

/** The topic of a lesson, or undefined if the lesson id has not been mapped (a test makes sure none is missing). */
export function topicOf(lessonId: string): TopicKey | undefined {
  if (EXPLICIT[lessonId]) return EXPLICIT[lessonId];
  const m = lessonId.match(ENGLISH_FOR);
  if (m) return m[1] as TopicKey;
  if (ENGLISH_FOR_NUMBERS.test(lessonId)) return "numbers_1_5";
  return undefined;
}
