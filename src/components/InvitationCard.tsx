import { CalendarDays, Clock, Heart } from "lucide-react";
import { InvitationLocation } from "@/components/InvitationLocation";
import { Countdown } from "@/components/Countdown";
import { formatDate } from "@/lib/format-date";
import { MapsButton } from "@/components/MapsButton";
import { PremiumInvitation } from "@/components/PremiumInvitation";
import { isPremiumTheme } from "@/lib/themes";
import botanical from "@/assets/wedding-botanical.png";
import archFloral from "@/assets/arch-floral.webp";

export type InvitationView = {
  partner_one: string;
  partner_two: string;
  event_date: string;
  event_time: string;
  venue: string;
  address?: string | null;
  message?: string | null;
  theme: string;
  // Vetëm për dizajnet Premium.
  cover_url?: string | null;
  cover_pos_x?: number;
  cover_pos_y?: number;
  cover_zoom?: number;
  gallery?: string[];
  photoPlaceholder?: boolean;
};

export function InvitationCard({ inv, showDirections = false }: { inv: InvitationView; showDirections?: boolean }) {
  if (isPremiumTheme(inv.theme)) return <PremiumInvitation inv={inv} showDirections={showDirections} />;
  const directions = showDirections ? <MapsButton venue={inv.venue} address={inv.address} /> : null;
  if (inv.theme === "arch") {
    const d = inv.event_date ? new Date(`${inv.event_date}T12:00:00`) : null;
    const months = ["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"];
    const days = ["E diel", "E hënë", "E martë", "E mërkurë", "E enjte", "E premte", "E shtunë"];
    return (
      <div className="theme-arch">
        <div className="arch-invitation">
          <img src={archFloral} alt="" width={768} height={1024} className="arch-frame" />
          <div className="arch-content text-center text-card-foreground">
            <p className="arch-kicker">Së bashku me familjet tona</p>
            <h2 className="arch-names text-primary">
              {inv.partner_one || "Emri"}
              <span className="arch-amp">&</span>
              {inv.partner_two || "Emri"}
            </h2>
            <p className="arch-kicker">ju ftojnë të festoni dasmën</p>
            <div className="arch-date">
              <span>{d ? days[d.getDay()] : "Dita"}</span>
              <strong>{d ? d.getDate() : "--"}</strong>
              <span>{inv.event_time || "Ora"}</span>
            </div>
            <p className="arch-month">{d ? `${months[d.getMonth()]} ${d.getFullYear()}` : "Muaji"}</p>
            <InvitationLocation venue={inv.venue} address={inv.address} />
            {inv.event_date ? <Countdown eventDate={inv.event_date} eventTime={inv.event_time} /> : null}
            {directions}
            {inv.message ? <p className="font-display mx-auto mt-6 max-w-xs text-lg italic text-muted-foreground">“{inv.message}”</p> : null}
          </div>
        </div>
      </div>
    );
  }
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
            <InvitationLocation venue={inv.venue} address={inv.address} />
          </div>
          {inv.event_date ? <Countdown eventDate={inv.event_date} eventTime={inv.event_time} /> : null}
          {directions}
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
