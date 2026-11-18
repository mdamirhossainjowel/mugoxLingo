import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";
export const alt = `${BRAND.name} - Learn languages by playing`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f5f2ff", color: "#3a1d5c" }}>
      <div style={{ display: "flex", width: 220, height: 220, borderRadius: 110, background: "#ffb020" }} />
      <div style={{ display: "flex", fontSize: 120, fontWeight: 800, marginTop: 24 }}>{BRAND.name}</div>
      <div style={{ display: "flex", fontSize: 44, marginTop: 8 }}>Learn languages by playing</div>
    </div>, size);
}
