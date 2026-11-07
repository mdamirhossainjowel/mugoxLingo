import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { noIndex } from "@/lib/seo";
import { isLocale } from "@/i18n/dictionaries";
import { isDbConfigured } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current";
import AuthForm from "@/features/auth/AuthForm";

export const metadata: Metadata = noIndex;
export const dynamic = "force-dynamic";

/** Change password for a signed-in user (needs the current password). */
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const enabled = isDbConfigured();
  if (enabled && !(await getCurrentUser())) redirect(`/${locale}/login?next=${encodeURIComponent(`/${locale}/update-password`)}`);
  return <main id="main" className="mx-auto max-w-md px-5 py-10"><AuthForm mode="update" locale={locale} accountsEnabled={enabled} /></main>;
}
