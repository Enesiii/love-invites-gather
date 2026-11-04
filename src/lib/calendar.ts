// Ndërtimi i ngjarjeve të kalendarit për dasmë (Google Calendar + skedar .ics RFC 5545).
// I sigurt për shfletues — pa sekrete, pa importime nga serveri.

export const WEDDING_TIMEZONE = "Europe/Belgrade";

export interface WeddingEvent {
  partnerOne: string;
  partnerTwo: string;
  /** YYYY-MM-DD */
  date: string;
  /** p.sh. "17:00" — pranohet edhe tekst si "ora 17:00" */
  time: string;
  venue: string;
  address?: string | null;
  mapsUrl?: string | null;
  invitationUrl: string;
}

/** Nxjerr orën dhe minutat nga teksti i lirë; parazgjedhja 17:00. */
export function parseEventTime(time: string): { h: number; m: number } {
  const match = /(\d{1,2})[:.](\d{2})/.exec(time);
  if (!match) return { h: 17, m: 0 };
  const h = Math.min(23, Math.max(0, Number(match[1])));
  const m = Math.min(59, Math.max(0, Number(match[2])));
  return { h, m };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** YYYYMMDDTHHMMSS në kohën lokale (pa zonë — zona jepet veçmas). */
function localStamp(date: string, h: number, m: number) {
  return `${date.replace(/-/g, "")}T${pad(h)}${pad(m)}00`;
}

function eventTimes(ev: WeddingEvent) {
  const { h, m } = parseEventTime(ev.time);
  const start = localStamp(ev.date, h, m);
  // Dasma zgjat 4 orë si parazgjedhje e kalendarit.
  const endH = h + 4;
  const end = endH < 24 ? localStamp(ev.date, endH, m) : localStamp(ev.date, 23, 59);
  return { start, end };
}

function eventTitle(ev: WeddingEvent) {
  return `Dasma e ${ev.partnerOne} & ${ev.partnerTwo}`;
}

function eventLocation(ev: WeddingEvent) {
  return [ev.venue.trim(), ev.address?.trim()].filter(Boolean).join(", ");
}

function eventDescription(ev: WeddingEvent) {
  const lines = [
    `Jeni të ftuar në dasmën e ${ev.partnerOne} & ${ev.partnerTwo}.`,
    ev.mapsUrl ? `Vendndodhja në Google Maps: ${ev.mapsUrl}` : null,
    `Ftesa juaj: ${ev.invitationUrl}`,
  ];
  return lines.filter(Boolean).join("\n");
}

/** Lidhje "Shto në Google Calendar" me të dhënat reale të ftesës. */
export function googleCalendarUrl(ev: WeddingEvent) {
  const { start, end } = eventTimes(ev);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventTitle(ev),
    dates: `${start}/${end}`,
    details: eventDescription(ev),
    location: eventLocation(ev),
    ctz: WEDDING_TIMEZONE,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ---- Skedari .ics (RFC 5545) ----

function icsEscape(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Palos rreshtat e gjatë në 75 oktete sipas RFC 5545. */
function foldLine(line: string) {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const parts: string[] = [];
  let current = "";
  let currentLen = 0;
  for (const ch of line) {
    const len = new TextEncoder().encode(ch).length;
    if (currentLen + len > (parts.length === 0 ? 75 : 74)) {
      parts.push(current);
      current = "";
      currentLen = 0;
    }
    current += ch;
    currentLen += len;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

export function buildIcs(ev: WeddingEvent): string {
  const { start, end } = eventTimes(ev);
  const title = eventTitle(ev);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ftesa Jonë//Wedding Reminders//SQ",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    `TZID:${WEDDING_TIMEZONE}`,
    "BEGIN:STANDARD",
    "DTSTART:19701025T030000",
    "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
    "TZOFFSETFROM:+0200",
    "TZOFFSETTO:+0100",
    "TZNAME:CET",
    "END:STANDARD",
    "BEGIN:DAYLIGHT",
    "DTSTART:19700329T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
    "TZOFFSETFROM:+0100",
    "TZOFFSETTO:+0200",
    "TZNAME:CEST",
    "END:DAYLIGHT",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}@ftesa-jone.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    `DTSTART;TZID=${WEDDING_TIMEZONE}:${start}`,
    `DTEND;TZID=${WEDDING_TIMEZONE}:${end}`,
    `SUMMARY:${icsEscape(title)}`,
    `LOCATION:${icsEscape(eventLocation(ev))}`,
    `DESCRIPTION:${icsEscape(eventDescription(ev))}`,
    `URL:${ev.invitationUrl}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape(title)}`,
    "TRIGGER:-P10D",
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape(title)}`,
    "TRIGGER:-P3D",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(foldLine).join("\r\n") + "\r\n";
}

/** Shkarkon skedarin .ics në shfletues. */
export function downloadIcs(ev: WeddingEvent) {
  const blob = new Blob([buildIcs(ev)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dasma-${ev.partnerOne}-${ev.partnerTwo}.ics`.toLowerCase().replace(/\s+/g, "-");
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
