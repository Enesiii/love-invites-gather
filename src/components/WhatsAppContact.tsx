import { MessageCircle } from "lucide-react";
import { openExternal } from "@/lib/open-external";

// Butoni "Na shkruani" — hap bisedën në WhatsApp me numrin e biznesit.
export function WhatsAppContact() {
  return (
    <a
      href="https://wa.me/38349706192"
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) =>
        openExternal(
          e,
          "Shfletuesi bllokoi hapjen e WhatsApp këtu. Linku u kopjua — hapeni në shfletues.",
        )
      }
      className="whatsapp-contact"
      aria-label="Na shkruani në WhatsApp"
    >
      <MessageCircle className="h-5 w-5 shrink-0" />
      <span>Na shkruani</span>
    </a>
  );
}
