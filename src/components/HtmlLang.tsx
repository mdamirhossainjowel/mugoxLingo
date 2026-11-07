"use client";
import { useEffect } from "react";
import { localeMeta, type Locale } from "@/i18n/config";

/** The root layout is shared by all languages, so the page language is set here for screen readers and browser tools. */
export default function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => { document.documentElement.lang = localeMeta(locale).hreflang; document.documentElement.dir = localeMeta(locale).dir; }, [locale]);
  return null;
}
