import { notFound } from "next/navigation";
import { getCourse } from "@/content/courses";

// Validates before any streaming starts, so unknown courses return a real 404 status.
export default async function CourseLayout({ children, params }: { children: React.ReactNode; params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  if (!getCourse(courseId)) notFound();
  return children;
}
