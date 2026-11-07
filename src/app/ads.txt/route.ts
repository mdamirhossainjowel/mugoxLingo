import { ADSENSE_CLIENT, adsTxtLine } from "@/features/ads/adsense";

export const dynamic = "force-static";

/** Authorizes Google to sell ads on this domain. Needed at the root of the domain that serves the ads. */
export function GET() {
  const body = ADSENSE_CLIENT ? `${adsTxtLine(ADSENSE_CLIENT)}\n` : "# Set NEXT_PUBLIC_ADSENSE_CLIENT_ID to publish your AdSense line here.\n";
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
