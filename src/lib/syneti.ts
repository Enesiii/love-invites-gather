// Kategoria "Ftesa Syneti" — të dhëna të sigurta për shfletues dhe server.
import { SYNETI_THEMES, type SynetiThemeId } from "@/lib/themes";
import type { InvitationView } from "@/components/InvitationCard";

export type SynetiPackageRow = { package: "classic"; price: number; features: string[]; templates: string[] };

export const SYNETI_PATH = "/syneti";

// Çmimi fillestar i fiksuar: 10€. Administratori e ndryshon te /admin (ruhet veçmas).
export const SYNETI_DEFAULT_PRICE = 10;

// Kufijtë e ngarkimeve nga mysafirët — njësoj si Kanagjegji.
export const SYNETI_UPLOAD_LIMITS = { photos: 10, videos: 2, videoSeconds: 60 } as const;

export const SYNETI_MUSIC = ["celebration", "romantic", "waltz", "none"] as const;
export type SynetiMusic = (typeof SYNETI_MUSIC)[number];

export function isSynetiTemplateSlug(v: unknown): v is SynetiThemeId {
  return typeof v === "string" && (SYNETI_THEMES as readonly string[]).includes(v);
}

export function synetiSampleInvitation(theme: SynetiThemeId): InvitationView {
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  return {
    category: "syneti",
    partner_one: "Arber",
    partner_two: "",
    parents: "Familja Berisha",
    event_date: d.toISOString().slice(0, 10),
    event_time: "17:00",
    venue: "Salla Royal",
    address: "Rruga e Kështjellës, Prishtinë",
    message: null,
    theme,
    music: "celebration",
  };
}
