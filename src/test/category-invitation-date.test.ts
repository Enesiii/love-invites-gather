import { describe, expect, it } from "vitest";
import { categoryInvitationDate } from "@/lib/category-invitation-date";

describe("category invitation date localization", () => {
  it("formats Friday in February in Albanian without relying on browser locale support", () => {
    expect(categoryInvitationDate("2027-02-19", "sq")).toBe("Premte, 19 Shkurt 2027");
  });

  it("keeps the chosen non-Albanian language", () => {
    expect(categoryInvitationDate("2027-02-19", "en")).toBe("Friday, 19 February 2027");
    expect(categoryInvitationDate("2027-02-19", "tr")).toBe("Cuma, 19 Şubat 2027");
  });

  it("preserves empty and invalid dates", () => {
    expect(categoryInvitationDate("", "sq")).toBe("");
    expect(categoryInvitationDate("invalid", "sq")).toBe("invalid");
  });
});