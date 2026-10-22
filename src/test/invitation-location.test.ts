import { describe, expect, it } from "vitest";
import { locationHref } from "@/lib/invitation-location";

describe("invitation location links", () => {
  it("uses the saved venue and address in the requested Google Maps search format", () => {
    expect(locationHref("Salla Royal", "Prishtinë, Kosovë")).toBe(
      "https://www.google.com/maps/search/?api=1&query=Salla%20Royal%2C%20Prishtin%C3%AB%2C%20Kosov%C3%AB",
    );
  });
  it("does not link invitations without location data", () => {
    expect(locationHref("   ", null)).toBeNull();
    expect(locationHref(undefined, " ")).toBeNull();
  });
  it("supports address-only locations without a dangling separator", () => {
    expect(locationHref("", " Prizren ")).toBe("https://www.google.com/maps/search/?api=1&query=Prizren");
  });
  it("keeps each invitation's location separate", () => {
    expect(locationHref("Salla A", "Prishtinë")).not.toBe(locationHref("Salla B", "Prizren"));
  });
});