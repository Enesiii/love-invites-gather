import { describe, expect, it } from "vitest";
import { SYNETI_DEFAULT_PRICE, SYNETI_UPLOAD_LIMITS, isSynetiTemplateSlug, synetiSampleInvitation } from "@/lib/syneti";
import { ALL_THEME_IDS, SYNETI_THEMES, THEME_LABELS, isKanagjegjiTheme, isSynetiTheme, isThemeId } from "@/lib/themes";
import { categoryOf, packageLabel } from "@/lib/payment-shared";
import { synetiDictionaries } from "@/lib/syneti-i18n";

describe("Kategoria Syneti", () => {
  it("ka çmim fillestar fiks 10€", () => {
    expect(SYNETI_DEFAULT_PRICE).toBe(10);
  });

  it("ka katër dizajne unike, të ndara nga dasma dhe Kanagjegji", () => {
    expect(SYNETI_THEMES).toEqual(["s-royal", "s-sky", "s-minimal", "s-prince"]);
    for (const id of SYNETI_THEMES) {
      expect(isSynetiTheme(id)).toBe(true);
      expect(isThemeId(id)).toBe(false);
      expect(isKanagjegjiTheme(id)).toBe(false);
      expect(ALL_THEME_IDS).toContain(id);
      expect(THEME_LABELS[id]).toBeTruthy();
    }
  });

  it("njeh vetëm slug-et e vlefshme të dizajneve", () => {
    expect(isSynetiTemplateSlug("s-royal")).toBe(true);
    expect(isSynetiTemplateSlug("k-traditional")).toBe(false);
    expect(isSynetiTemplateSlug("rose")).toBe(false);
    expect(isSynetiTemplateSlug(undefined)).toBe(false);
  });

  it("kufijtë e ngarkimeve janë 10 foto / 2 video / 60 sekonda", () => {
    expect(SYNETI_UPLOAD_LIMITS).toEqual({ photos: 10, videos: 2, videoSeconds: 60 });
  });

  it("kategoria dhe etiketat e porosive dallojnë Synetin", () => {
    expect(categoryOf("syneti")).toBe("syneti");
    expect(categoryOf("kanagjegji")).toBe("kanagjegji");
    expect(categoryOf("wedding")).toBe("wedding");
    expect(packageLabel("syneti", "classic")).toBe("Ftesa Syneti");
    expect(packageLabel("kanagjegji", "premium")).toBe("Paketa Premium · Kanagjegji");
    expect(packageLabel("wedding", "classic")).toBe("Paketa Klasike");
  });

  it("shembulli i ftesës ka emrin e djalit si element kryesor dhe pa partner të dytë", () => {
    const inv = synetiSampleInvitation("s-prince");
    expect(inv.category).toBe("syneti");
    expect(inv.partner_one).toBe("Arber");
    expect(inv.partner_two).toBe("");
    expect(inv.theme).toBe("s-prince");
  });

  it("titulli parazgjedhur përfshin emrin e djalit në të katërta gjuhët", () => {
    expect(synetiDictionaries.sq.invite.title("Arber")).toBe("Mirë se vini në festën e Synetisë së Arber");
    for (const lang of ["sq", "sr", "tr", "en"] as const) {
      const d = synetiDictionaries[lang];
      expect(d.invite.title("Arber")).toContain("Arber");
      expect(d.home.synetiTitle).toBeTruthy();
      expect(d.creator.boy).toBeTruthy();
      for (const id of SYNETI_THEMES) expect(d.templates[id].name).toBeTruthy();
    }
  });
});
