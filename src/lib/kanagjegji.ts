// Kategoria "Ftesa Kanagjegji" — të dhëna të sigurta për shfletues dhe server.
import {
  KANAGJEGJI_CLASSIC_THEMES,
  KANAGJEGJI_PREMIUM_THEMES,
  KANAGJEGJI_THEMES,
  type KanagjegjiThemeId,
} from "@/lib/themes";
import type { InvitationView } from "@/components/InvitationCard";

export type KanaPackageRow = { package: "classic" | "premium"; price: number; features: string[]; templates: string[] };

export const KANAGJEGJI_PATH = "/kanagjegji";

// Çmimet fillestare. Administratori i ndryshon te /admin (ruhen veçmas nga dasma).
export const KANAGJEGJI_DEFAULT_PRICES = { classic: 10, premium: 15 } as const;

// Kufijtë e ngarkimeve nga mysafirët për çdo ftesë Kanagjegji.
export const KANAGJEGJI_UPLOAD_LIMITS = { photos: 10, videos: 2, videoSeconds: 60 } as const;

export const KANAGJEGJI_MUSIC = ["henna", "romantic", "waltz", "none"] as const;
export type KanagjegjiMusic = (typeof KANAGJEGJI_MUSIC)[number];

export function kanaPackageOf(theme: string): "classic" | "premium" {
  return (KANAGJEGJI_PREMIUM_THEMES as readonly string[]).includes(theme) ? "premium" : "classic";
}

export function kanaThemesFor(pkg: "classic" | "premium"): readonly KanagjegjiThemeId[] {
  return pkg === "premium" ? KANAGJEGJI_PREMIUM_THEMES : KANAGJEGJI_CLASSIC_THEMES;
}

export function isKanaTemplateSlug(v: unknown): v is KanagjegjiThemeId {
  return typeof v === "string" && (KANAGJEGJI_THEMES as readonly string[]).includes(v);
}

export function kanaSampleInvitation(theme: KanagjegjiThemeId): InvitationView {
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  return {
    category: "kanagjegji",
    partner_one: "Selma",
    partner_two: "",
    parents: "Familja Krasniqi",
    event_date: d.toISOString().slice(0, 10),
    event_time: "19:00",
    venue: "Salla Elita",
    address: "Rruga e Dëshmorëve, Prizren",
    message: null,
    theme,
    music: "henna",
    photoPlaceholder: kanaPackageOf(theme) === "premium",
  };
}
