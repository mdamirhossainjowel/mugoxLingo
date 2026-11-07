import "server-only";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/dictionaries";
import { getCourse } from "@/content/courses";
import { isDbConfigured } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current";
import { getExamBest, getServerProgress } from "./server";

/** Shared loader for practice pages: validates the route and reads account data when signed in. */
export async function loadLearnContext(localeParam: string, courseId: string) {
  const course = getCourse(courseId);
  if (!isLocale(localeParam) || !course) notFound();
  const accountsEnabled = isDbConfigured();
  let serverProgress = null; let examBest = null; let authed = false;
  const user = accountsEnabled ? await getCurrentUser() : null;
  if (user) {
    authed = true;
    try { [serverProgress, examBest] = await Promise.all([getServerProgress(user.id), getExamBest(user.id)]); }
    catch { authed = false; serverProgress = null; examBest = null; } // database hiccup: fall back to guest view instead of a crash
  }
  return { locale: localeParam, course, accountsEnabled, authed, serverProgress, examBest };
}
