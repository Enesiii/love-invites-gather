import { describe, expect, it } from "vitest";
import { kanaPackageOf, kanaSampleInvitation, kanaThemesFor, KANAGJEGJI_DEFAULT_PRICES, KANAGJEGJI_MUSIC } from "@/lib/kanagjegji";
import { KANAGJEGJI_THEMES, isKanagjegjiTheme } from "@/lib/themes";
import { packageLabel, categoryOf } from "@/lib/payment-shared";

describe("kanagjegji category", () => {
  it("defaults to €10 classic and €15 premium", () => {
    expect(KANAGJEGJI_DEFAULT_PRICES.classic).toBe(10);
    expect(KANAGJEGJI_DEFAULT_PRICES.premium).toBe(15);
  });
  it("maps each design to the right package", () => {
    expect(kanaPackageOf("k-traditional")).toBe("classic");
    expect(kanaPackageOf("k-modern")).toBe("classic");
    expect(kanaPackageOf("k-burgundy")).toBe("premium");
    expect(kanaPackageOf("k-ottoman")).toBe("premium");
  });
  it("offers only designs from the same package (edit dialog rule)", () => {
    expect(kanaThemesFor("classic")).toEqual(["k-traditional", "k-modern"]);
    expect(kanaThemesFor("premium")).toEqual(["k-burgundy", "k-ottoman"]);
    kanaThemesFor("classic").forEach((t) => expect(kanaPackageOf(t)).toBe("classic"));
    kanaThemesFor("premium").forEach((t) => expect(kanaPackageOf(t)).toBe("premium"));
  });
  it("labels kanagjegji payments apart from weddings", () => {
    expect(packageLabel("kanagjegji", "classic")).toContain("Kanagjegji");
    expect(packageLabel("wedding", "classic")).not.toContain("Kanagjegji");
    expect(categoryOf("kanagjegji")).toBe("kanagjegji");
    expect(categoryOf(undefined)).toBe("wedding");
  });
  it("samples use kanagjegji themes, music and no second partner", () => {
    KANAGJEGJI_THEMES.forEach((theme) => {
      const inv = kanaSampleInvitation(theme);
      expect(inv.category).toBe("kanagjegji");
      expect(inv.partner_two).toBe("");
      expect(KANAGJEGJI_MUSIC as readonly string[]).toContain(inv.music ?? "");
      expect(isKanagjegjiTheme(theme)).toBe(true);
    });
  });
});
