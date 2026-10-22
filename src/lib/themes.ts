// Lista e vetme e dizajneve. Shtoni një dizajn këtu dhe ai pranohet kudo.
export const CLASSIC_THEMES = ["rose", "sage", "night", "gold", "ivory", "blush", "arch"] as const;
export const PREMIUM_THEMES = ["lux-gold", "floral", "minimal", "royal"] as const;
export const THEME_IDS = [...CLASSIC_THEMES, ...PREMIUM_THEMES] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export const THEME_LABELS: Record<ThemeId, string> = {
  rose: "Trëndafil",
  sage: "Sherbelë",
  night: "Natë",
  gold: "Ar",
  ivory: "Fildiş",
  blush: "Rozë",
  arch: "Harku",
  "lux-gold": "Ari Luksoz",
  floral: "Lule Romantike",
  minimal: "Minimal Modern",
  royal: "Dasmë Mbretërore",
};

export function isThemeId(v: unknown): v is ThemeId {
  return typeof v === "string" && (THEME_IDS as readonly string[]).includes(v);
}
export function isPremiumTheme(v: string) {
  return (PREMIUM_THEMES as readonly string[]).includes(v);
}

// Kontroll në server: lejon vetëm JPEG, PNG, WebP duke lexuar bajtet e para.
export const COVER_MAX_BYTES = 6 * 1024 * 1024;
export function sniffImageType(bin: Uint8Array): "image/jpeg" | "image/png" | "image/webp" | null {
  if (bin[0] === 0xff && bin[1] === 0xd8 && bin[2] === 0xff) return "image/jpeg";
  if (bin[0] === 0x89 && bin[1] === 0x50 && bin[2] === 0x4e && bin[3] === 0x47) return "image/png";
  if (
    bin[0] === 0x52 && bin[1] === 0x49 && bin[2] === 0x46 && bin[3] === 0x46 &&
    bin[8] === 0x57 && bin[9] === 0x45 && bin[10] === 0x42 && bin[11] === 0x50
  )
    return "image/webp";
  return null;
}
