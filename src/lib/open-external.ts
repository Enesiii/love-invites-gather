import type { MouseEvent } from "react";
import { toast } from "sonner";

// Brenda parapmjes (iframe), shfletuesi mund ta bllokojë hapjen e faqeve të jashtme.
// Ndalojmë navigimin e vetë fremit dhe provojmë tab të ri; nëse bllokohet,
// e kopjojmë linkun dhe e shpjegojmë përdoruesit.
export function openExternal(e: MouseEvent<HTMLAnchorElement>, blockedMessage: string) {
  e.preventDefault();
  const href = e.currentTarget.href;
  try {
    const opened = window.open(href, "_blank", "noopener,noreferrer");
    if (!opened) {
      navigator.clipboard?.writeText(href).catch(() => undefined);
      toast.info(blockedMessage);
    }
  } catch {
    navigator.clipboard?.writeText(href).catch(() => undefined);
    toast.info("Linku u kopjua — hapeni në shfletues.");
  }
}
