import { describe, expect, it } from "vitest";
import { COOKIE_PREFIX, CONSENT_KEY, isValidGaId, sanitizeParams, track } from "@/features/analytics/ga";

describe("analytics safety", () => {
  it("accepts only GA4 measurement ids", () => {
    expect(isValidGaId("G-ABC123XYZ9")).toBe(true);
    for (const bad of ["", "UA-12345-1", "G-", "G-abc123", "G-ABC123'); alert(1);//", "GTM-ABCDEF"]) expect(isValidGaId(bad), bad).toBe(false);
  });
  it("sends only plain, short values", () => {
    expect(sanitizeParams({ a: "x".repeat(300), b: 3, c: true, d: { name: "Ana" }, e: ["x"], f: NaN, g: undefined })).toEqual({ a: "x".repeat(100), b: 3, c: true });
  });
  it("track is a harmless no-op without a browser, id or consent", () => {
    expect(() => track("lesson_complete", { lesson_id: "x" })).not.toThrow();
  });
  it("uses its own cookie prefix and storage key so it cannot collide with another site's _ga", () => {
    expect(COOKIE_PREFIX).toBe("mgxl"); expect(CONSENT_KEY.startsWith("mugoxlingo:")).toBe(true);
  });
});
