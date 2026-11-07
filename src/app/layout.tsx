import type { Metadata, Viewport } from "next";
import "@fontsource-variable/nunito";
import "@fontsource/baloo-da-2/400.css";
import "@fontsource/baloo-da-2/700.css";
import "@fontsource/baloo-da-2/800.css";
import "./globals.css";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: `${BRAND.name} - Learn languages by playing`, applicationName: BRAND.name, manifest: "/manifest.webmanifest",
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
  description: "Short, playful language lessons with XP, streaks and badges. Start free, no account needed.",
};
export const viewport: Viewport = { themeColor: "#3a1d5c", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}
