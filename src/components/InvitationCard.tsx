import { CalendarDays, Clock, MapPin } from "lucide-react";

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

export function formatDate(d: string) {
  if (!d) return "";
  const date = new Date(d + "T12:00:00");
  return date.toLocaleDateString("sq-AL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function InvitationCard({ inv }: { inv: InvitationView }) {
  return (
    <div className={`theme-${inv.theme}`}>
      <div className="rounded-sm border border-border bg-card p-3 shadow-[var(--shadow-soft)]">
        <div className="border border-accent px-6 py-12 text-center text-card-foreground sm:px-12">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Ju ftojmë në dasmën tonë
          </p>
          <h2 className="font-display mt-6 text-5xl font-medium leading-tight text-primary sm:text-6xl">
            {inv.partner_one || "Emri"}
            <span className="my-1 block text-3xl italic text-accent">&</span>
            {inv.partner_two || "Emri"}
          </h2>
          <div className="mx-auto my-8 h-px w-24 bg-accent" />
          <div className="space-y-2 text-sm">
            <p className="flex items-center justify-center gap-2 capitalize">
              <CalendarDays className="h-4 w-4 text-primary" />
              {formatDate(inv.event_date) || "Data e dasmës"}
            </p>
            <p className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              {inv.event_time}
            </p>
            <p className="flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {inv.venue || "Vendi"}
              {inv.address ? <span className="text-muted-foreground">· {inv.address}</span> : null}
            </p>
          </div>
          {inv.message ? (
            <p className="font-display mx-auto mt-8 max-w-sm text-xl italic text-muted-foreground">
              “{inv.message}”
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
