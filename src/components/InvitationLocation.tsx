import { MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { locationDisplay, locationHref } from "@/lib/invitation-location";

export function InvitationLocation({ venue, address }: { venue?: string | null | undefined; address?: string | null | undefined }) {
  const { t, lang } = useI18n();
  const href = locationHref(venue, address);
  if (!href) return null;
  const { texts, hasLink } = locationDisplay(venue, address);
  if (!texts.length && !hasLink) return null;

  return (
    <section className="my-3 text-center" lang={lang} aria-label={t.location.heading}>
      <h3 className="mb-1 text-xs text-muted-foreground">{t.location.heading}</h3>
      <a href={href} target="_blank" rel="noopener noreferrer"
        className="mx-auto inline-flex max-w-full items-start justify-center gap-2 rounded-sm text-card-foreground underline decoration-accent/50 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4"
        aria-label={texts.length ? `${t.location.open}: ${texts.join(", ")}` : t.location.open}>
        <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <span className="min-w-0 break-words">
          {texts[0] ? <span className="block font-medium">{texts[0]}</span> : null}
          {texts[1] ? <span className="block text-xs">{texts[1]}</span> : null}
          {hasLink ? <span className="block text-xs italic text-muted-foreground">{t.location.linkLabel}</span> : null}
        </span>
      </a>
    </section>
  );
}
