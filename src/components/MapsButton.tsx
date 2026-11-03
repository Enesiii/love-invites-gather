import { Navigation } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { directionsHref } from "@/lib/invitation-location";

export const mapsHref = directionsHref;

// Brenda parapamjes (iframe), shfletuesi mund ta bllokojë hapjen e faqeve të jashtme.
// Provojmë tab të ri; nëse bllokohet, e kopjojmë linkun dhe e shpjegojmë.
export function handleMapsClick(e: React.MouseEvent<HTMLAnchorElement>, copiedMessage: string) {
  e.preventDefault();
  try {
    const opened = window.open(e.currentTarget.href, "_blank", "noopener,noreferrer");
    if (!opened) {
      navigator.clipboard?.writeText(e.currentTarget.href).catch(() => undefined);
      toast.info(copiedMessage);
    }
  } catch {
    navigator.clipboard?.writeText(e.currentTarget.href).catch(() => undefined);
    toast.info(copiedMessage);
  }
}

export function MapsButton({ venue, address, className = "" }: { venue: string; address?: string | null | undefined; className?: string }) {
  const { t } = useI18n();
  const href = mapsHref(venue, address);
  if (!href) return null;
  return (
    <Button asChild variant="outline" className={`maps-control mt-6 max-w-full border-accent bg-card/80 ${className}`}>
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={(e) => handleMapsClick(e, t.location.copied)}>
        <Navigation className="h-4 w-4 shrink-0" aria-hidden="true" /> <span>{t.location.navigate}</span>
      </a>
    </Button>
  );
}
