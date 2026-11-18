import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** The icon iPhones and iPads use when the site is added to the home screen. */
export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#3a1d5c" }}>
      <div style={{ display: "flex", width: 128, height: 128, borderRadius: 64, background: "#ffb020", alignItems: "center", justifyContent: "center", color: "#3a1d5c", fontSize: 84, fontWeight: 800 }}>M</div>
    </div>, size);
}
