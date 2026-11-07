import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { noIndex } from "@/lib/seo";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/dictionaries";
import { authStrings } from "@/i18n/authUi";
import { uiStrings } from "@/i18n/ui";
import { allLessons, courses, getCourse } from "@/content/courses";
import { BRAND } from "@/lib/brand";
import { isDbConfigured } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current";
import { getServerProgress } from "@/features/progress/server";
import ProgressStats from "@/components/ProgressStats";
import BubbleButton from "@/components/BubbleButton";
import { BackArrow } from "@/components/Arrows";
import { courseTitle, lessonTitle } from "@/content/titles";
import { catalogs } from "@/i18n/catalog";
import { ImportBanner, ProfileForm, ResetCourse, SignOutButton } from "@/features/profile/AccountControls";

export const dynamic = "force-dynamic";
export const metadata: Metadata = noIndex;

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = authStrings[locale]; const ui = uiStrings[locale];
  if (!isDbConfigured()) redirect(`/${locale}/login`);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login?next=${encodeURIComponent(`/${locale}/account`)}`);
  const progress = await getServerProgress(user.id);
  const course = getCourse(user.currentCourseId ?? "") ?? courses[0];
  const lessons = allLessons(course);
  const next = lessons.find((l) => !progress.completed[l.id]) ?? lessons[0];
  const doneLessons = courses.flatMap(allLessons).filter((l) => progress.completed[l.id]);
  const name = user.displayName ?? user.email.split("@")[0];
  return (
    <main id="main" className="mx-auto grid max-w-2xl gap-6 px-5 py-8">
      <Link href={`/${locale}`} className="font-display text-2xl font-extrabold"><BackArrow /> {BRAND.name}</Link>
      <h1 className="font-display text-4xl font-extrabold">{name}</h1>
      <ProgressStats state={progress} locale={locale} />
      <div><BubbleButton tone="mango" href={`/${locale}/learn/${course.id}/${next.id}`}>{t.continueCourse}</BubbleButton></div>
      <ImportBanner locale={locale} />
      <section><h2 className="font-display text-2xl font-extrabold">{t.achievements}</h2>
        <ul className="mt-2 flex flex-wrap gap-2">{progress.badges.length ? progress.badges.map((b) => <li key={b} className="rounded-full bg-mango px-4 py-2 font-bold">🏅 {ui.badges[b] ?? b}</li>) : <li className="font-semibold opacity-70">{t.noneYet}</li>}</ul></section>
      <section><h2 className="font-display text-2xl font-extrabold">{t.completedLessons}</h2>
        <ul className="mt-2 grid gap-2">{doneLessons.length ? doneLessons.map((l) => <li key={l.id} className="rounded-2xl bg-white px-4 py-3 font-bold">✓ {lessonTitle(l, locale)}</li>) : <li className="font-semibold opacity-70">{t.noneYet}</li>}</ul></section>
      <ProfileForm locale={locale} courses={courses.map((c) => ({ id: c.id, title: courseTitle(c, locale) }))} courseLabel={catalogs[locale].courseLabel} initial={{ displayName: user.displayName ?? "", interfaceLocale: isLocale(user.interfaceLocale) ? (user.interfaceLocale as Locale) : locale, courseId: course.id }} />
      <ResetCourse locale={locale} courses={courses.map((c) => ({ id: c.id, title: courseTitle(c, locale) }))} />
      <div className="flex flex-wrap gap-3"><BubbleButton tone="white" href={`/${locale}/update-password`}>{t.changePassword}</BubbleButton><SignOutButton locale={locale} /></div>
    </main>
  );
}
