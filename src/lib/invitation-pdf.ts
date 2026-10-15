import { formatDate } from "@/lib/format-date";

export type PdfInvitation = {
  partner_one: string;
  partner_two: string;
  event_date: string;
  event_time: string;
  venue: string;
  address?: string | null;
  message?: string | null;
  theme: string;
};

type Oklch = [number, number, number];
type Palette = { card: Oklch; text: Oklch; primary: Oklch; accent: Oklch; muted: Oklch };

// Të njëjtat ngjyra si temat në styles.css.
const PALETTES: Record<string, Palette> = {
  rose: {
    card: [0.99, 0.008, 80],
    text: [0.27, 0.03, 20],
    primary: [0.5, 0.1, 15],
    accent: [0.78, 0.09, 80],
    muted: [0.5, 0.03, 30],
  },
  sage: {
    card: [0.985, 0.012, 125],
    text: [0.28, 0.04, 150],
    primary: [0.45, 0.07, 150],
    accent: [0.75, 0.08, 95],
    muted: [0.48, 0.04, 150],
  },
  night: {
    card: [0.25, 0.045, 265],
    text: [0.95, 0.02, 85],
    primary: [0.8, 0.1, 85],
    accent: [0.8, 0.1, 85],
    muted: [0.75, 0.03, 85],
  },
};

function oklchToRgb([l, c, h]: Oklch): [number, number, number] {
  const hr = (h * Math.PI) / 180;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
  const g = lin.map((v) => {
    const x = Math.min(1, Math.max(0, v));
    return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
  });
  return [g[0] ?? 0, g[1] ?? 0, g[2] ?? 0];
}

export async function buildInvitationPdf(inv: PdfInvitation): Promise<Blob> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const pal = (PALETTES[inv.theme] ?? PALETTES["rose"]) as Palette;
  const col = (c: Oklch) => {
    const [r, g, b] = oklchToRgb(c);
    return rgb(r, g, b);
  };

  const doc = await PDFDocument.create();
  const W = 419.53;
  const H = 595.28;
  const page = doc.addPage([W, H]);
  const regular = await doc.embedFont(StandardFonts.TimesRoman);
  const italic = await doc.embedFont(StandardFonts.TimesRomanItalic);
  const bold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const supported = new Set(regular.getCharacterSet());
  const clean = (s: string) =>
    Array.from(s.replace(/[“”„]/g, '"').replace(/[‘’]/g, "'").replace(/[–—]/g, "-").replace(/\s+/g, " "))
      .filter((ch) => supported.has(ch.codePointAt(0) as number))
      .join("")
      .trim();

  const card = col(pal.card);
  const text = col(pal.text);
  const primary = col(pal.primary);
  const accent = col(pal.accent);
  const muted = col(pal.muted);

  // Sfondi dhe korniza e dyfishtë
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: card });
  page.drawRectangle({ x: 18, y: 18, width: W - 36, height: H - 36, borderColor: accent, borderWidth: 1.2 });
  page.drawRectangle({ x: 26, y: 26, width: W - 52, height: H - 52, borderColor: accent, borderWidth: 0.5 });

  const center = (s: string, y: number, size: number, font = regular, color = text) => {
    const t = clean(s);
    if (!t) return;
    const w = font.widthOfTextAtSize(t, size);
    page.drawText(t, { x: (W - w) / 2, y, size, font, color });
  };
  const wrap = (s: string, font: typeof regular, size: number, maxW: number) => {
    const words = clean(s).split(" ").filter(Boolean);
    const lines: string[] = [];
    let line = "";
    for (const w of words) {
      const next = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(next, size) > maxW && line) {
        lines.push(line);
        line = w;
      } else line = next;
    }
    if (line) lines.push(line);
    return lines;
  };
  const diamond = (cx: number, cy: number, r: number) => {
    page.drawSvgPath(`M 0 ${-r} L ${r} 0 L 0 ${r} L ${-r} 0 Z`, { x: cx, y: cy, color: accent });
  };
  const divider = (y: number) => {
    page.drawLine({ start: { x: W / 2 - 70, y }, end: { x: W / 2 - 10, y }, thickness: 0.6, color: accent });
    page.drawLine({ start: { x: W / 2 + 10, y }, end: { x: W / 2 + 70, y }, thickness: 0.6, color: accent });
    diamond(W / 2, y, 3.5);
  };

  let y = H - 90;
  diamond(W / 2, y + 8, 5);
  y -= 30;
  center("JU FTOJMË NË DASMËN TONË", y, 10, regular, muted);
  y -= 62;

  const n1 = inv.partner_one || "Emri";
  const n2 = inv.partner_two || "Emri";
  let size = 42;
  while (size > 24 && Math.max(...[n1, n2].map((n) => bold.widthOfTextAtSize(clean(n), size))) > W - 110) {
    size -= 2;
  }
  center(n1, y, size, regular, primary);
  y -= size * 0.95;
  center("&", y, size * 0.7, italic, accent);
  y -= size * 0.95;
  center(n2, y, size, regular, primary);

  y -= 38;
  divider(y);
  y -= 34;

  const dateText = formatDate(inv.event_date);
  if (dateText) {
    center(dateText.charAt(0).toUpperCase() + dateText.slice(1), y, 15, regular, text);
    y -= 22;
  }
  if (inv.event_time) {
    center(inv.event_time, y, 14, regular, text);
    y -= 24;
  }
  if (inv.venue) {
    center(inv.venue, y, 16, bold, text);
    y -= 19;
  }
  if (inv.address) {
    for (const l of wrap(inv.address, regular, 12, W - 130)) {
      center(l, y, 12, regular, muted);
      y -= 15;
    }
  }

  if (inv.message?.trim()) {
    y -= 14;
    const lines = wrap(inv.message, italic, 12.5, W - 120).slice(0, 9);
    for (const l of lines) {
      if (y < 90) break;
      center(l, y, 12.5, italic, muted);
      y -= 17;
    }
  }

  center("Me dashuri & gëzim", 56, 12, italic, primary);

  const bytes = await doc.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}
