import { Navigation } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function mapsHref(venue: string, address?: string | null) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    [venue, address].filter(Boolean).join(", "),
  )}`;
}

// Brenda parapamjes (iframe), shfletuesi mund ta bllokojë hapjen e faqeve të jashtme.
// Provojmë tab të ri; nëse bllokohet, e kopjojmë linkun dhe e shpjegojmë.
export function handleMapsClick(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  try {
    const opened = window.open(e.currentTarget.href, "_blank", "noopener,noreferrer");
    if (!opened) {
      navigator.clipboard?.writeText(e.currentTarget.href).catch(() => undefined);
      toast.info(
        "Shfletuesi bllokoi hapjen e Google Maps këtu. Linku u kopjua — hapeni në shfletues ose hapni ftesën me linkun e ndarë.",
      );
    }
  } catch {
    navigator.clipboard?.writeText(e.currentTarget.href).catch(() => undefined);
    toast.info("Linku i Google Maps u kopjua — hapeni në shfletues.");
  }
}

export function MapsButton({ venue, address, className = "" }: { venue: string; address?: string | null; className?: string }) {
  if (!venue.trim()) return null;
  return (
    <Button asChild variant="outline" className={`maps-control mt-6 max-w-full border-accent bg-card/80 ${className}`}>
      <a href={mapsHref(venue, address)} target="_blank" rel="noopener noreferrer" onClick={handleMapsClick}>
        <Navigation className="h-4 w-4 shrink-0" /> <span>Navigo në Google Maps</span>
      </a>
    </Button>
  );
}
