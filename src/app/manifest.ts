import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return { name: BRAND.name, short_name: BRAND.short, description: "Learn languages by playing.", start_url: "/en", display: "standalone", background_color: "#f5f2ff", theme_color: "#3a1d5c",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }] };
}
