import type { Metadata } from "next";
import { noIndex } from "@/lib/seo";
import SpeedRound from "@/features/practice/SpeedRound";
import { loadLearnContext } from "@/features/progress/context";

export const dynamic = "force-dynamic";
export const metadata: Metadata = noIndex;

export default async function Page({ params }: { params: Promise<{ locale: string; courseId: string }> }) {
  const { locale: l, courseId } = await params;
  const { locale, course, serverProgress } = await loadLearnContext(l, courseId);
  return <SpeedRound locale={locale} course={course} serverProgress={serverProgress} />;
}
