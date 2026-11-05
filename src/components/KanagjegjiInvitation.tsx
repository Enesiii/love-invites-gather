import { Camera, MapPin, Navigation } from "lucide-react";
import { Countdown } from "@/components/Countdown";
import { Button } from "@/components/ui/button";
import { handleMapsClick } from "@/components/MapsButton";
import { coverStyle } from "@/components/PremiumInvitation";
import { ArabesqueCorner, FiligreeDivider, Medallion, Rose, Tulip } from "@/components/KanaOrnaments";
import type { InvitationView } from "@/components/InvitationCard";
import { useI18n, type Lang } from "@/lib/i18n";
import { kanaDictionaries } from "@/lib/kanagjegji-i18n";
import { directionsHref, locationDisplay, savedMapsHref } from "@/lib/invitation-location";
import { categoryInvitationDate } from "@/lib/category-invitation-date";

const UNITS: Record<Lang, [string, string, string, string]> = {
  sq: ["Ditë", "Orë", "Minuta", "Sekonda"],
  sr: ["Dana", "Sati", "Minuta", "Sekundi"],
  tr: ["Gün", "Saat", "Dakika", "Saniye"],
  en: ["Days", "Hours", "Minutes", "Seconds"],
};

export const kanaDate = categoryInvitationDate;

export function KanagjegjiInvitation({ inv, showDirections }: { inv: InvitationView; showDirections: boolean }) {
  const { lang, t } = useI18n();
  const k = kanaDictionaries[lang];
  const theme = inv.theme;
  const premium = theme === "k-burgundy" || theme === "k-ottoman";
  const title = inv.message?.trim() || k.invite.title;
  const bride = inv.partner_one || k.creator.bride;
  const { texts } = locationDisplay(inv.venue, inv.address);
  const mapHref = savedMapsHref(inv.maps_url) ?? directionsHref(inv.venue, inv.address);

  const photo = premium ? (
    inv.cover_url ? (
      <figure className="kana-photo">
        <img src={inv.cover_url} alt={bride} width={768} height={1024} decoding="async" style={coverStyle(inv.cover_pos_x ?? 50, inv.cover_pos_y ?? 50, inv.cover_zoom ?? 100)} />
      </figure>
    ) : inv.photoPlaceholder ? (
      <figure className="kana-photo kana-photo-empty">
        <Camera className="h-7 w-7" aria-hidden="true" />
        <span>{k.invite.photoHere}</span>
      </figure>
    ) : null
  ) : null;

  const details = (
    <div className="kana-details">
      <div>
        <span className="kana-label">{k.invite.on}</span>
        <span className="kana-value">{kanaDate(inv.event_date, lang)}</span>
      </div>
      <div>
        <span className="kana-label">{k.invite.at}</span>
        <span className="kana-value">{inv.event_time}</span>
      </div>
    </div>
  );

  const location = texts.length || mapHref ? (
    <section className="kana-location" aria-label={t.location.heading}>
      <span className="kana-label">{t.location.heading}</span>
      {mapHref ? (
        <a href={mapHref} target="_blank" rel="noopener noreferrer" className="kana-location-link" onClick={(e) => handleMapsClick(e, t.location.copied)}>
          <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {texts[0] ? <strong>{texts[0]}</strong> : null}
            {texts[1] ? <small>{texts[1]}</small> : null}
            {!texts.length ? <small>{t.location.linkLabel}</small> : null}
          </span>
        </a>
      ) : null}
      {showDirections && mapHref ? (
        <Button asChild variant="outline" className="kana-maps-button">
          <a href={mapHref} target="_blank" rel="noopener noreferrer" onClick={(e) => handleMapsClick(e, t.location.copied)}>
            <Navigation className="h-4 w-4" aria-hidden="true" /> {t.location.navigate}
          </a>
        </Button>
      ) : null}
    </section>
  ) : null;

  const hosts = inv.parents?.trim() ? (
    <p className="kana-hosts">
      <span>{k.invite.hostedBy}</span> {inv.parents}
    </p>
  ) : null;

  const countdown = <Countdown eventDate={inv.event_date} eventTime={inv.event_time} label={k.invite.countdown} units={UNITS[lang]} />;

  return (
    <div className={`kana kana-${theme}`} lang={lang}>
      <article className="kana-card">
        {theme === "k-traditional" ? (
          <>
            <ArabesqueCorner className="kana-corner kana-corner-tl" />
            <ArabesqueCorner className="kana-corner kana-corner-tr" />
            <ArabesqueCorner className="kana-corner kana-corner-bl" />
            <ArabesqueCorner className="kana-corner kana-corner-br" />
            <div className="kana-tulips" aria-hidden="true"><Tulip className="kana-tulip kana-tulip-side" /><Tulip className="kana-tulip" /><Tulip className="kana-tulip kana-tulip-side" /></div>
            <p className="kana-eyebrow">{k.invite.invited}</p>
            <h2 className="kana-title">{title}</h2>
            <FiligreeDivider className="kana-divider" />
            <p className="kana-bride">{bride}</p>
            {hosts}
            {details}
            {location}
            {countdown}
            <div className="kana-tulips kana-tulips-bottom" aria-hidden="true"><Tulip className="kana-tulip kana-tulip-side" /><Tulip className="kana-tulip" /><Tulip className="kana-tulip kana-tulip-side" /></div>
          </>
        ) : null}

        {theme === "k-modern" ? (
          <div className="kana-modern-grid">
            <div className="kana-modern-rule" aria-hidden="true" />
            <div>
              <p className="kana-eyebrow">{k.invite.invited}</p>
              <p className="kana-bride">{bride}</p>
              <h2 className="kana-title">{title}</h2>
              {hosts}
              <Tulip className="kana-modern-tulip" />
              {details}
              {location}
              {countdown}
            </div>
          </div>
        ) : null}

        {theme === "k-burgundy" ? (
          <>
            <div className="kana-lace" aria-hidden="true" />
            <div className="kana-roses" aria-hidden="true"><Rose className="kana-rose" /><Rose className="kana-rose kana-rose-lg" /><Rose className="kana-rose" /></div>
            <p className="kana-eyebrow">{k.invite.invited}</p>
            {photo}
            <p className="kana-bride">{bride}</p>
            <h2 className="kana-title">{title}</h2>
            <FiligreeDivider className="kana-divider" />
            {hosts}
            {details}
            {location}
            {countdown}
            <div className="kana-lace kana-lace-bottom" aria-hidden="true" />
          </>
        ) : null}

        {theme === "k-ottoman" ? (
          <>
            <div className="kana-ogee" aria-hidden="true" />
            <div className="kana-medallion-wrap">
              <Medallion className="kana-medallion" />
              {photo}
            </div>
            <p className="kana-eyebrow">{k.invite.invited}</p>
            <h2 className="kana-title">{title}</h2>
            <p className="kana-bride">{bride}</p>
            <FiligreeDivider className="kana-divider" />
            {hosts}
            {details}
            {location}
            {countdown}
            <div className="kana-tulips kana-tulips-bottom" aria-hidden="true"><Tulip className="kana-tulip kana-tulip-side" /><Rose className="kana-rose" /><Tulip className="kana-tulip kana-tulip-side" /></div>
          </>
        ) : null}
      </article>
    </div>
  );
}
