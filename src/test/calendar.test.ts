import { describe, expect, it } from "vitest";
import { buildIcs, googleCalendarUrl, parseEventTime, type WeddingEvent } from "@/lib/calendar";

const ev: WeddingEvent = {
  partnerOne: "Enes",
  partnerTwo: "Selma",
  date: "2027-06-04",
  time: "ora 17:30",
  venue: "Salla e Dasmave, Prishtinë",
  address: "Rruga e Dasmës 1",
  mapsUrl: "https://maps.app.goo.gl/abc123",
  invitationUrl: "https://ftesa-jone.com/ftesa/123",
};

describe("calendar", () => {
  it("nxjerr orën nga teksti i lirë, me parazgjedhje 17:00", () => {
    expect(parseEventTime("ora 17:30")).toEqual({ h: 17, m: 30 });
    expect(parseEventTime("18.00")).toEqual({ h: 18, m: 0 });
    expect(parseEventTime("mbrëmje")).toEqual({ h: 17, m: 0 });
  });

  it("lidhja e Google Calendar përmban të dhënat reale të ftesës dhe zonën e saktë", () => {
    const url = googleCalendarUrl(ev);
    expect(url).toContain("calendar.google.com/calendar/render");
    expect(url).toContain("ctz=Europe%2FBelgrade");
    expect(url).toContain("dates=20270604T173000%2F20270604T213000");
    expect(url).toContain(encodeURIComponent("Dasma e Enes & Selma").replace(/%20/g, "+"));
    expect(url).toContain("maps.app.goo.gl");
    expect(url).toContain("ftesa-jone.com");
  });

  it("skedari .ics është RFC 5545 me zonën Europe/Belgrade dhe dy kujtesa", () => {
    const ics = buildIcs(ev);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("VERSION:2.0");
    expect(ics).toContain("TZID:Europe/Belgrade");
    expect(ics).toContain("DTSTART;TZID=Europe/Belgrade:20270604T173000");
    expect(ics).toContain("SUMMARY:Dasma e Enes & Selma");
    expect(ics).toContain("LOCATION:Salla e Dasmave\\, Prishtinë\\, Rruga e Dasmës 1");
    expect(ics).toContain("URL:https://ftesa-jone.com/ftesa/123");
    expect(ics.match(/BEGIN:VALARM/g)).toHaveLength(2);
    expect(ics).toContain("TRIGGER:-P10D");
    expect(ics).toContain("TRIGGER:-P3D");
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });

  it("palos rreshtat e gjatë të .ics në 75 oktete", () => {
    const long = buildIcs({ ...ev, venue: "S".repeat(200) });
    for (const line of long.split("\r\n")) {
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    }
  });
});
