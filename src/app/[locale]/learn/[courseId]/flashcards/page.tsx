import type { Metadata } from "next";
import { noIndex } from "@/lib/seo";
import FlashcardsPlayer from "@/features/practice/FlashcardsPlayer";
import { loadLearnContext } from "@/features/progress/context";

export const dynamic = "force-dynamic";
export const metadata: Metadata = noIndex;

export default async function Page({ params }: { params: Promise<{ locale: string; courseId: string }> }) {
  const { locale: l, courseId } = await params;
  const { locale, course, serverProgress } = await loadLearnContext(l, courseId);
  return <FlashcardsPlayer locale={locale} course={course} serverProgress={serverProgress} />;
}
