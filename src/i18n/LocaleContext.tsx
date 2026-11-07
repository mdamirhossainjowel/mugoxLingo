"use client";
import { createContext, useContext } from "react";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";
import { usePathname } from "next/navigation";

export const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);
export const useLocale = () => useContext(LocaleContext);

/** A server layout cannot use a context object from a client file directly, so it renders this wrapper instead. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

/** For places that render outside the layout's context (such as error boundaries): read the language from the URL. */
export function useLocaleFromPath(): Locale {
  const first = (usePathname() ?? "").split("/")[1] ?? "";
  return isLocale(first) ? first : DEFAULT_LOCALE;
}
