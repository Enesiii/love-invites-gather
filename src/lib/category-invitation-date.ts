import { format } from "date-fns";
import { enGB, sq, srLatn, tr } from "date-fns/locale";
import type { Lang } from "@/lib/i18n";

const locales = { sq, sr: srLatn, tr, en: enGB };

// Bundled locales avoid browsers silently falling back to English for Albanian.
export function categoryInvitationDate(date: string, lang: Lang): string {
  if (!date) return "";
  const d = new Date(`${date}T12:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return format(d, "EEEE, d MMMM yyyy", { locale: locales[lang] });
}