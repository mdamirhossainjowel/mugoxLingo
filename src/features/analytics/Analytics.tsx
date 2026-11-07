"use client";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { analyticsEnabled, CONSENT_CHANGED, COOKIE_PREFIX, GA_ID, readConsent, type Consent } from "./ga";

/** Loads Google Analytics only after the visitor accepts. Without NEXT_PUBLIC_GA_ID nothing is loaded at all. */
export default function Analytics() {
  const [consent, setConsent] = useState<Consent>(null);
  const pathname = usePathname(); const last = useRef<string | null>(null);
  useEffect(() => {
    setConsent(readConsent());
    const on = () => setConsent(readConsent());
    window.addEventListener(CONSENT_CHANGED, on); return () => window.removeEventListener(CONSENT_CHANGED, on);
  }, []);
  useEffect(() => {
    if (consent !== "granted") { last.current = null; return; }
    if (last.current !== null && last.current !== pathname && window.gtag) window.gtag("event", "page_view", { page_path: pathname, page_location: window.location.href, page_title: document.title });
    last.current = pathname;
  }, [consent, pathname]);
  if (!analyticsEnabled() || consent !== "granted") return null;
  const init = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
gtag('js',new Date());
gtag('config','${GA_ID}',{send_page_view:false,cookie_prefix:'${COOKIE_PREFIX}',cookie_flags:'SameSite=Lax;Secure',allow_google_signals:false,allow_ad_personalization_signals:false});
gtag('event','page_view',{page_path:location.pathname,page_location:location.href,page_title:document.title});`;
  return (<>
    <Script id="ga-src" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    <Script id="ga-init" strategy="afterInteractive">{init}</Script>
  </>);
}
