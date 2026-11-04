import { describe, expect, it } from "vitest";
import {
  ORDER_NUMBER_PATTERN,
  PACKAGE_LABELS,
  amountForPackage,
  packageForTheme,
} from "@/lib/payment-shared";

describe("payment packages", () => {
  it("premium themes map to the premium package at €15", () => {
    for (const t of ["lux-gold", "floral", "minimal", "royal"] as const) {
      expect(packageForTheme(t)).toBe("premium");
    }
    expect(amountForPackage("premium")).toBe(15);
  });

  it("classic themes map to the classic package at €10", () => {
    for (const t of ["rose", "sage", "night", "gold", "ivory", "blush", "arch"] as const) {
      expect(packageForTheme(t)).toBe("classic");
    }
    expect(amountForPackage("classic")).toBe(10);
  });

  it("package labels exist for both packages", () => {
    expect(PACKAGE_LABELS.classic).toBeTruthy();
    expect(PACKAGE_LABELS.premium).toBeTruthy();
  });
});

describe("order number format", () => {
  it("accepts FD-YYYY-NNNNNN and rejects other shapes", () => {
    expect(ORDER_NUMBER_PATTERN.test("FD-2026-000001")).toBe(true);
    expect(ORDER_NUMBER_PATTERN.test("FD-2026-123456")).toBe(true);
    expect(ORDER_NUMBER_PATTERN.test("FD-26-000001")).toBe(false);
    expect(ORDER_NUMBER_PATTERN.test("FD-2026-1")).toBe(false);
    expect(ORDER_NUMBER_PATTERN.test("fd-2026-000001")).toBe(false);
    expect(ORDER_NUMBER_PATTERN.test("FD-2026-0000010")).toBe(false);
  });
});
