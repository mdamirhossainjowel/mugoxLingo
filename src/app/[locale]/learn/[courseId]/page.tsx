import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { noIndex } from "@/lib/seo";
import { isLocale, locales } from "@/i18n/dictionaries";
import { courses, getCourse } from "@/content/courses";
import CoursePath from "@/features/lessons/CoursePath";
import { isDbConfigured } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current";
import { getExamBest, getServerProgress } from "@/features/progress/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = noIndex;
export function generateStaticParams() { return locales.flatMap((locale) => courses.map((c) => ({ locale, courseId: c.id }))); }

export default async function CoursePage({ params }: { params: Promise<{ locale: string; courseId: string }> }) {
  const { locale, courseId } = await params;
  const course = getCourse(courseId);
  if (!isLocale(locale) || !course) notFound();
  const accountsEnabled = isDbConfigured();
  let serverProgress = null; let examBest = null;
  const user = accountsEnabled ? await getCurrentUser() : null;
  if (user) { try { [serverProgress, examBest] = await Promise.all([getServerProgress(user.id), getExamBest(user.id)]); } catch { /* database hiccup: show the guest view */ } }
  return <CoursePath locale={locale} course={course} serverProgress={serverProgress} accountsEnabled={accountsEnabled} examBest={examBest} />;
}
