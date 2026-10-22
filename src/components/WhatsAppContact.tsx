import { MessageCircle } from "lucide-react";
import { openExternal } from "@/lib/open-external";
import { useI18n } from "@/lib/i18n";
import { whatsappUrl } from "@/lib/site-config";

// Butoni "Na shkruani" — numri ndryshohet te src/lib/site-config.ts.
export function WhatsAppContact() {
  const { t } = useI18n();
  const href = whatsappUrl();
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => openExternal(e, t.whatsapp.blocked)}
      className="whatsapp-contact"
      aria-label={t.whatsapp.aria}
    >
      <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span>{t.whatsapp.label}</span>
    </a>
  );
}
