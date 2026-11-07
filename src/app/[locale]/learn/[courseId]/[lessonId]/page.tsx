import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { noIndex } from "@/lib/seo";
import { isLocale, locales } from "@/i18n/dictionaries";
import { allLessons, courses, getCourse, getLesson, nextLessonId } from "@/content/courses";
import LessonPlayer from "@/features/lessons/LessonPlayer";
import { isDbConfigured } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current";

export const dynamic = "force-dynamic";
export const metadata: Metadata = noIndex;
export function generateStaticParams() {
  return locales.flatMap((locale) => courses.flatMap((c) => allLessons(c).map((l) => ({ locale, courseId: c.id, lessonId: l.id }))));
}

export default async function LessonPage({ params }: { params: Promise<{ locale: string; courseId: string; lessonId: string }> }) {
  const { locale, courseId, lessonId } = await params;
  const course = getCourse(courseId);
  const lesson = course && getLesson(course, lessonId);
  if (!isLocale(locale) || !course || !lesson) notFound();
  const accountsEnabled = isDbConfigured();
  const authed = accountsEnabled ? Boolean(await getCurrentUser()) : false;
  return <LessonPlayer locale={locale} courseId={course.id} lesson={lesson} nextLessonId={nextLessonId(course, lesson.id)} authed={authed} accountsEnabled={accountsEnabled} lang={course.ttsLang} />;
}
