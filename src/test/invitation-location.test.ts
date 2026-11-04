import { describe, expect, it } from "vitest";
import { directionsHref, locationDisplay, locationHref, savedMapsHref } from "@/lib/invitation-location";

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
  it("prefers the precise shared Maps link already saved in the example venue", () => {
    const url = "https://maps.app.goo.gl/5UNAXPDaQks6hk7u8";
    expect(locationHref(url, "Mushnikovë")).toBe(url);
    expect(directionsHref(url, "Mushnikovë")).toBe(url);
  });
  it("accepts a saved Maps address link", () => {
    expect(locationHref("Salla", "https://www.google.com/maps/place/Mushnikove")).toBe("https://www.google.com/maps/place/Mushnikove");
  });
  it("does not treat unsafe or unrelated URLs as saved Maps destinations", () => {
    for (const value of ["javascript:alert(1)", "https://maps.app.goo.gl.evil.example/place", "https://www.google.com/search", "http://maps.google.com/maps", "https://user@maps.google.com/maps"]) {
      expect(savedMapsHref(value)).toBeNull();
    }
  });
  it("hides directions without data and supports address-only directions", () => {
    expect(directionsHref(" ", null)).toBeNull();
    expect(directionsHref("", " Mushnikovë ")).toBe("https://www.google.com/maps/dir/?api=1&destination=Mushnikov%C3%AB");
  });
  it("never shows a raw Maps URL on the invitation", () => {
    expect(locationDisplay("https://maps.app.goo.gl/5UNAXPDaQks6hk7u8", null)).toEqual({ texts: [], hasLink: true });
    expect(locationDisplay("https://maps.app.goo.gl/5UNAXPDaQks6hk7u8", "Mushnikovë")).toEqual({
      texts: ["Mushnikovë"],
      hasLink: true,
    });
    expect(locationDisplay("Salla Royal", "https://www.google.com/maps/place/Mushnikove")).toEqual({
      texts: ["Salla Royal"],
      hasLink: true,
    });
    expect(locationDisplay("Salla Royal", "Prishtinë")).toEqual({ texts: ["Salla Royal", "Prishtinë"], hasLink: false });
  });
});