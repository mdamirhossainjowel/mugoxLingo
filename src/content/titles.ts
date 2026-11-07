import type { Course, Lesson, Unit } from "@/types/course";
import { catalogs } from "@/i18n/catalog";
import { localeMeta, type Locale } from "@/i18n/config";
import { topicOf } from "./topics";

const tag = (locale: Locale) => localeMeta(locale).hreflang;
const upperFirst = (s: string, locale: Locale) => (s ? s.charAt(0).toLocaleUpperCase(tag(locale)) + s.slice(1) : s);

/** Name of a language in the visitor's language, from the browser's own data (no hand-written list). */
export function languageName(code: string, locale: Locale): string {
  try { return new Intl.DisplayNames([tag(locale)], { type: "language" }).of(code) ?? code; } catch { return code; }
}
export function courseTitle(course: Course, locale: Locale): string {
  const s = catalogs[locale].courseTitle.replace("{target}", languageName(course.to, locale)).replace("{source}", languageName(course.from, locale));
  return upperFirst(s, locale);
}
export function lessonTitle(lesson: Lesson, locale: Locale): string {
  const topic = topicOf(lesson.id);
  return topic ? catalogs[locale].topics[topic] : lesson.title;
}
export function unitTitle(unit: Unit, locale: Locale): string {
  const names = [...new Set(unit.lessons.map((l) => lessonTitle(l, locale)))];
  try { return new Intl.ListFormat([tag(locale)], { style: "long", type: "conjunction" }).format(names); } catch { return names.join(", "); }
}
export const lessonObjective = (lesson: Lesson, course: Course, locale: Locale) => `${languageName(course.to, locale)} · ${lessonTitle(lesson, locale)}`;
