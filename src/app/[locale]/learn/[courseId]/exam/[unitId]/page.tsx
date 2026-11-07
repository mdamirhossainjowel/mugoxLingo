import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { noIndex } from "@/lib/seo";
import ExamRunner from "@/features/exam/ExamRunner";
import { loadLearnContext } from "@/features/progress/context";

export const dynamic = "force-dynamic";
export const metadata: Metadata = noIndex;

export default async function Page({ params }: { params: Promise<{ locale: string; courseId: string; unitId: string }> }) {
  const { locale: l, courseId, unitId } = await params;
  const { locale, course, authed, serverProgress, examBest } = await loadLearnContext(l, courseId);
  const unit = course.units.find((u) => u.id === unitId);
  if (!unit) notFound();
  return <ExamRunner locale={locale} course={course} unit={unit} authed={authed} serverProgress={serverProgress} serverBest={examBest?.[unit.id] ?? null} />;
}
