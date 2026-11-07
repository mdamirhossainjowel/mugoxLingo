import type { Course, Lesson, Unit } from "@/types/course";
import { esExtraUnits } from "./es-extra";
import { zhCourse } from "./zh";
import { jaCourse } from "./ja";
import { koCourse } from "./ko";
import { bnEnCourse } from "./en-for-bn";
import { bnCourse } from "./bn";
import { englishForCourses } from "./english-for";
import { bnEnMoreUnits, esMoreUnits, jaMoreLessons, koMoreUnits, zhMoreUnits } from "./more";

const enEs: Course = {
  id: "en-es", from: "en", to: "es", ttsLang: "es-ES", title: "Spanish for English speakers", status: "full",
  units: [{
    id: "es-u1", title: "Greetings and basics",
    lessons: [
      {
        id: "es-greetings-1", title: "Hello and thanks", objective: "Say hello, goodbye, please and thank you.",
        vocab: [{ term: "Hola", meaning: "Hello" }, { term: "Adiós", meaning: "Goodbye" }, { term: "Gracias", meaning: "Thank you" }, { term: "Por favor", meaning: "Please" }, { term: "Buenos días", meaning: "Good morning" }],
        exercises: [
          { id: "g1-1", type: "mcq", prompt: "What does “Hola” mean?", choices: ["Hello", "Goodbye", "Please", "Thank you"], answer: 0 },
          { id: "g1-2", type: "mcq", prompt: "How do you say “Thank you”?", choices: ["Adiós", "Gracias", "Por favor", "Hola"], answer: 1 },
          { id: "g1-3", type: "match", prompt: "Match each word to its meaning", pairs: [
            { left: "Hola", right: "Hello" }, { left: "Adiós", right: "Goodbye" },
            { left: "Gracias", right: "Thank you" }, { left: "Por favor", right: "Please" }] },
          { id: "g1-4", type: "fill", prompt: "Good morning", before: "¡Buenos", after: "!", choices: ["días", "noches", "gracias"], answer: 0,
            explain: "“Buenos días” is used until around midday." },
          { id: "g1-5", type: "build", prompt: "Translate: My name is Ana", tiles: ["Me", "llamo", "Ana", "soy", "tú"], answer: ["Me", "llamo", "Ana"] },
          { id: "g1-6", type: "translate", prompt: "Translate: Thank you", accepted: ["Gracias"] },
          { id: "g1-7", type: "mcq", prompt: "What does “Adiós” mean?", choices: ["Hello", "Goodbye", "Yes", "Please"], answer: 1 },
        ],
      },
      {
        id: "es-greetings-2", title: "Meeting people", objective: "Ask how someone is and introduce yourself.",
        vocab: [{ term: "¿Cómo estás?", meaning: "How are you?" }, { term: "Mucho gusto", meaning: "Nice to meet you" }, { term: "Bien", meaning: "Fine" }, { term: "Mal", meaning: "Bad" }, { term: "Sí", meaning: "Yes" }, { term: "Buenas noches", meaning: "Good night" }],
        exercises: [
          { id: "g2-1", type: "mcq", prompt: "What does “¿Cómo estás?” mean?", choices: ["Where are you?", "How are you?", "Who are you?", "What is this?"], answer: 1 },
          { id: "g2-2", type: "mcq", prompt: "What does “Mucho gusto” mean?", choices: ["Good night", "See you soon", "Nice to meet you", "You are welcome"], answer: 2 },
          { id: "g2-3", type: "fill", prompt: "I am Ana", before: "Yo", after: "Ana.", choices: ["soy", "eres", "es"], answer: 0,
            explain: "“Soy” is “I am” (from ser). “Eres” is “you are” and “es” is “he/she is”." },
          { id: "g2-4", type: "build", prompt: "Translate: I am fine, thank you", tiles: ["Estoy", "bien", "gracias", "soy", "mal"], answer: ["Estoy", "bien", "gracias"] },
          { id: "g2-5", type: "match", prompt: "Match each word to its meaning", pairs: [
            { left: "Bien", right: "Fine" }, { left: "Mal", right: "Bad" },
            { left: "Sí", right: "Yes" }, { left: "Buenas noches", right: "Good night" }] },
          { id: "g2-6", type: "translate", prompt: "Translate: Good morning", accepted: ["Buenos días"] },
          { id: "g2-7", type: "translate", prompt: "Translate: Nice to meet you", accepted: ["Mucho gusto", "Encantado", "Encantada"] },
        ],
      },
    ],
  }, ...esExtraUnits],
};

/** Adds lessons to existing units (by unit id) and appends whole new units. */
const extend = (c: Course, addLessons: Record<string, Lesson[]> = {}, addUnits: Unit[] = []): Course => ({
  ...c, units: [...c.units.map((u) => (addLessons[u.id] ? { ...u, lessons: [...u.lessons, ...addLessons[u.id]] } : u)), ...addUnits],
});

export const courses: Course[] = [
  extend(enEs, {}, esMoreUnits), extend(zhCourse, {}, zhMoreUnits), extend(jaCourse, jaMoreLessons), extend(koCourse, {}, koMoreUnits),
  extend(bnEnCourse, {}, bnEnMoreUnits), bnCourse, ...englishForCourses,
];
export const getCourse = (id: string) => courses.find((c) => c.id === id);
export const allLessons = (c: Course): Lesson[] => c.units.flatMap((u) => u.lessons);
/** Listening exercises are practice only: they never count towards score, XP or exams. */
export const scoredExercises = (l: Lesson) => l.exercises.filter((e) => e.type !== "listen");
export const getLesson = (c: Course, lessonId: string) => allLessons(c).find((l) => l.id === lessonId);
export const nextLessonId = (c: Course, lessonId: string) => {
  const list = allLessons(c); const i = list.findIndex((l) => l.id === lessonId);
  return i >= 0 && i < list.length - 1 ? list[i + 1].id : null;
};

export interface VocabCard { id: string; term: string; meaning: string; lessonId: string }
/** Words from lessons the learner has finished; the deck grows as they progress. */
export function courseVocab(c: Course, completedLessonIds: ReadonlySet<string> | string[]): VocabCard[] {
  const done = new Set(completedLessonIds);
  return allLessons(c).filter((l) => done.has(l.id)).flatMap((l) => (l.vocab ?? []).map((v, i) => ({ id: `${l.id}:${i}`, term: v.term, meaning: v.meaning, lessonId: l.id })));
}
export const unitComplete = (u: Unit, done: ReadonlySet<string>) => u.lessons.every((l) => done.has(l.id));
