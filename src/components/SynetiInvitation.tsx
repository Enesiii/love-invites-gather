import { Camera, MapPin, Navigation } from "lucide-react";
import { Countdown } from "@/components/Countdown";
import { Button } from "@/components/ui/button";
import { handleMapsClick } from "@/components/MapsButton";
import { coverStyle } from "@/components/PremiumInvitation";
import { Bunting, Crown, GeoCorner, SparkleDivider, Star } from "@/components/SynetiOrnaments";
import type { InvitationView } from "@/components/InvitationCard";
import { useI18n, type Lang } from "@/lib/i18n";
import { synetiDictionaries } from "@/lib/syneti-i18n";
import { directionsHref, locationDisplay, savedMapsHref } from "@/lib/invitation-location";
import { categoryInvitationDate } from "@/lib/category-invitation-date";

const UNITS: Record<Lang, [string, string, string, string]> = {
  sq: ["Ditë", "Orë", "Minuta", "Sekonda"],
  sr: ["Dana", "Sati", "Minuta", "Sekundi"],
  tr: ["Gün", "Saat", "Dakika", "Saniye"],
  en: ["Days", "Hours", "Minutes", "Seconds"],
};

export const synetiDate = categoryInvitationDate;

export function SynetiInvitation({ inv, showDirections }: { inv: InvitationView; showDirections: boolean }) {
  const { lang, t } = useI18n();
  const s = synetiDictionaries[lang];
  const theme = inv.theme;
  const boy = inv.partner_one || s.creator.boy;
  const title = inv.message?.trim() || s.invite.title(boy);
  const { texts } = locationDisplay(inv.venue, inv.address);
  const mapHref = savedMapsHref(inv.maps_url) ?? directionsHref(inv.venue, inv.address);

  const photo = inv.cover_url ? (
    <figure className="syneti-photo">
      <img src={inv.cover_url} alt={boy} width={768} height={1024} decoding="async" style={coverStyle(inv.cover_pos_x ?? 50, inv.cover_pos_y ?? 50, inv.cover_zoom ?? 100)} />
    </figure>
  ) : inv.photoPlaceholder ? (
    <figure className="syneti-photo syneti-photo-empty">
      <Camera className="h-7 w-7" aria-hidden="true" />
      <span>{s.invite.photoHere}</span>
    </figure>
  ) : null;

  const details = (
    <div className="syneti-details">
      <div>
        <span className="syneti-label">{s.invite.on}</span>
        <span className="syneti-value">{synetiDate(inv.event_date, lang)}</span>
      </div>
      <div>
        <span className="syneti-label">{s.invite.at}</span>
        <span className="syneti-value">{inv.event_time}</span>
      </div>
    </div>
  );

  const location = texts.length || mapHref ? (
    <section className="syneti-location" aria-label={t.location.heading}>
      <span className="syneti-label">{t.location.heading}</span>
      {mapHref ? (
        <a href={mapHref} target="_blank" rel="noopener noreferrer" className="syneti-location-link" onClick={(e) => handleMapsClick(e, t.location.copied)}>
          <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {texts[0] ? <strong>{texts[0]}</strong> : null}
            {texts[1] ? <small>{texts[1]}</small> : null}
            {!texts.length ? <small>{t.location.linkLabel}</small> : null}
          </span>
        </a>
      ) : null}
      {showDirections && mapHref ? (
        <Button asChild variant="outline" className="syneti-maps-button">
          <a href={mapHref} target="_blank" rel="noopener noreferrer" onClick={(e) => handleMapsClick(e, t.location.copied)}>
            <Navigation className="h-4 w-4" aria-hidden="true" /> {t.location.navigate}
          </a>
        </Button>
      ) : null}
    </section>
  ) : null;

  const hosts = inv.parents?.trim() ? (
    <p className="syneti-hosts">
      <span>{s.invite.hostedBy}</span> {inv.parents}
    </p>
  ) : null;

  const countdown = <Countdown eventDate={inv.event_date} eventTime={inv.event_time} label={s.invite.countdown} units={UNITS[lang]} />;

  return (
    <div className={`syneti syneti-${theme}`} lang={lang}>
      <article className="syneti-card">
        {theme === "s-royal" ? (
          <>
            <GeoCorner className="syneti-corner syneti-corner-tl" />
            <GeoCorner className="syneti-corner syneti-corner-tr" />
            <GeoCorner className="syneti-corner syneti-corner-bl" />
            <GeoCorner className="syneti-corner syneti-corner-br" />
            <div className="syneti-stars" aria-hidden="true"><Star className="syneti-star syneti-star-side" /><Star className="syneti-star" /><Star className="syneti-star syneti-star-side" /></div>
            <p className="syneti-eyebrow">{s.invite.invited}</p>
            <h2 className="syneti-title">{title}</h2>
            <SparkleDivider className="syneti-divider" />
            <p className="syneti-boy">{boy}</p>
            {hosts}
            {details}
            {location}
            {countdown}
            <div className="syneti-stars syneti-stars-bottom" aria-hidden="true"><Star className="syneti-star syneti-star-side" /><Star className="syneti-star" /><Star className="syneti-star syneti-star-side" /></div>
          </>
        ) : null}

        {theme === "s-sky" ? (
          <>
            <Bunting className="syneti-bunting" />
            <p className="syneti-eyebrow">{s.invite.invited}</p>
            {photo}
            <p className="syneti-boy">{boy}</p>
            <h2 className="syneti-title">{title}</h2>
            <SparkleDivider className="syneti-divider" />
            {hosts}
            {details}
            {location}
            {countdown}
            <div className="syneti-clouds" aria-hidden="true" />
          </>
        ) : null}

        {theme === "s-minimal" ? (
          <div className="syneti-minimal-grid">
            <div className="syneti-minimal-rule" aria-hidden="true" />
            <div>
              <p className="syneti-eyebrow">{s.invite.invited}</p>
              <p className="syneti-boy">{boy}</p>
              <h2 className="syneti-title">{title}</h2>
              {hosts}
              <Star className="syneti-minimal-star" />
              {details}
              {location}
              {countdown}
            </div>
          </div>
        ) : null}

        {theme === "s-prince" ? (
          <>
            <div className="syneti-crown-wrap" aria-hidden="true"><Crown className="syneti-crown" /></div>
            <p className="syneti-eyebrow">{s.invite.invited}</p>
            {photo}
            <p className="syneti-boy">{boy}</p>
            <h2 className="syneti-title">{title}</h2>
            <SparkleDivider className="syneti-divider" />
            {hosts}
            {details}
            {location}
            {countdown}
            <div className="syneti-stars syneti-stars-bottom" aria-hidden="true"><Star className="syneti-star syneti-star-side" /><Star className="syneti-star" /><Star className="syneti-star syneti-star-side" /></div>
          </>
        ) : null}
      </article>
    </div>
  );
}
