import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { noIndex } from "@/lib/seo";
import { isLocale } from "@/i18n/dictionaries";
import { isDbConfigured } from "@/lib/db";
import AuthForm from "@/features/auth/AuthForm";

export const metadata: Metadata = noIndex;

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ next?: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { next } = await searchParams;
  return <main id="main" className="mx-auto max-w-md px-5 py-10"><AuthForm mode="login" locale={locale} next={next} accountsEnabled={isDbConfigured()} /></main>;
}
