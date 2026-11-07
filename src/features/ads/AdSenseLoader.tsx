"use client";
import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useConsent } from "@/features/analytics/useConsent";
import { ADSENSE_CLIENT, PERSONALIZED_ADS, adsAllowedPath } from "./adsense";

/**
 * Loads Google AdSense only after the visitor accepts, and only shows ads on content pages.
 * The script itself is loaded once, so when the visitor moves into a lesson the ads are hidden with CSS (see globals.css).
 */
export default function AdSenseLoader() {
  const consent = useConsent(); const pathname = usePathname();
  const show = ADSENSE_CLIENT !== null && consent === "granted" && adsAllowedPath(pathname);
  useEffect(() => { document.body.dataset.ads = show ? "on" : "off"; }, [show]);
  if (!ADSENSE_CLIENT || consent !== "granted" || !adsAllowedPath(pathname)) return null;
  return (<>
    {!PERSONALIZED_ADS && <Script id="adsense-npa" strategy="afterInteractive">{"window.adsbygoogle=window.adsbygoogle||[];window.adsbygoogle.requestNonPersonalizedAds=1;"}</Script>}
    <Script id="adsense-src" async strategy="afterInteractive" crossOrigin="anonymous" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`} />
  </>);
}
