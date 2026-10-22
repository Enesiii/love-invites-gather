import { describe, expect, it } from "vitest";
import { PRICING } from "@/lib/site-config";
import { sniffImageType, isPremiumTheme } from "@/lib/themes";

describe("premium collection", () => {
  it("prices the Premium package at €15", () => {
    expect(PRICING.packages.find((p) => p.id === "premium")?.price).toBe(15);
  });
  it("prices the Classic package at €20", () => {
    expect(PRICING.packages.find((p) => p.id === "classic")?.price).toBe(20);
  });
  it("accepts only real JPEG, PNG and WebP bytes", () => {
    expect(sniffImageType(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe("image/jpeg");
    expect(sniffImageType(new Uint8Array([0x89, 0x50, 0x4e, 0x47]))).toBe("image/png");
    expect(sniffImageType(new TextEncoder().encode("not an image"))).toBeNull();
  });
  it("has four premium designs", () => {
    expect(["lux-gold", "floral", "minimal", "royal"].every(isPremiumTheme)).toBe(true);
    expect(isPremiumTheme("rose")).toBe(false);
  });
});
