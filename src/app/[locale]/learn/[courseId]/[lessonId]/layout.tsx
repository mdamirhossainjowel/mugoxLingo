import { notFound } from "next/navigation";
import { getCourse, getLesson } from "@/content/courses";

export default async function LessonLayout({ children, params }: { children: React.ReactNode; params: Promise<{ courseId: string; lessonId: string }> }) {
  const { courseId, lessonId } = await params;
  const course = getCourse(courseId);
  if (!course || !getLesson(course, lessonId)) notFound();
  return children;
}
