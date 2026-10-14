import { CalendarDays, Clock, Heart, MapPin, Navigation } from "lucide-react";
import { formatDate } from "@/lib/format-date";
import { Button } from "@/components/ui/button";
import botanical from "@/assets/wedding-botanical.png";

export type InvitationView = {
  partner_one: string;
  partner_two: string;
  event_date: string;
  event_time: string;
  venue: string;
  address?: string | null;
  message?: string | null;
  theme: string;
};

export function InvitationCard({ inv, showDirections = false }: { inv: InvitationView; showDirections?: boolean }) {
  return (
    <div className={`theme-${inv.theme}`}>
      <div className="luxury-invitation rounded-sm border border-border bg-card p-3 shadow-[var(--shadow-soft)]">
        <img src={botanical} alt="" width={1024} height={1024} className="invitation-botanical botanical-top" />
        <img src={botanical} alt="" width={1024} height={1024} className="invitation-botanical botanical-bottom" />
        <div className="invitation-inner border border-accent px-5 py-16 text-center text-card-foreground sm:px-12">
          <Heart className="mx-auto mb-5 h-5 w-5 text-accent" strokeWidth={1} />
          <p className="text-xs text-muted-foreground">
            Ju ftojmë në dasmën tonë
          </p>
          <h2 className="font-display invitation-couple mt-6 text-5xl font-medium leading-tight text-primary sm:text-6xl">
            {inv.partner_one || "Emri"}
            <span className="my-1 block text-3xl italic text-accent">&</span>
            {inv.partner_two || "Emri"}
          </h2>
          <div className="invitation-divider mx-auto my-8"><span>✦</span></div>
          <div className="space-y-2 text-sm">
            <p className="flex items-center justify-center gap-2 capitalize">
              <CalendarDays className="h-4 w-4 text-primary" />
              {formatDate(inv.event_date) || "Data e dasmës"}
            </p>
            <p className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              {inv.event_time}
            </p>
            <p className="flex flex-wrap items-center justify-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {inv.venue || "Vendi"}
              {inv.address ? <span className="text-muted-foreground">· {inv.address}</span> : null}
            </p>
          </div>
          {showDirections && inv.venue.trim() ? (
            <Button asChild variant="outline" className="mt-6 max-w-full border-accent bg-card/80">
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent([inv.venue, inv.address].filter(Boolean).join(", "))}`} target="_blank" rel="noopener noreferrer">
                <Navigation className="h-4 w-4" /> Navigo në Google Maps
              </a>
            </Button>
          ) : null}
          {inv.message ? (
            <p className="font-display invitation-message mx-auto mt-8 max-w-sm text-xl italic text-muted-foreground">
              “{inv.message}”
            </p>
          ) : null}
          <p className="mt-10 text-xs text-muted-foreground">Me dashuri & gëzim</p>
        </div>
      </div>
    </div>
  );
}
