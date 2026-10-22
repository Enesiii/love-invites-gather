import { Camera, Heart } from "lucide-react";
import { Countdown } from "@/components/Countdown";
import { MapsButton } from "@/components/MapsButton";
import { InvitationLocation } from "@/components/InvitationLocation";
import type { InvitationView } from "@/components/InvitationCard";
import botanical from "@/assets/wedding-botanical.png";

const MONTHS = ["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"];
const DAYS = ["E diel", "E hënë", "E martë", "E mërkurë", "E enjte", "E premte", "E shtunë"];

export function coverStyle(x = 50, y = 50, zoom = 100): React.CSSProperties {
  return {
    objectPosition: `${x}% ${y}%`,
    transform: `scale(${zoom / 100})`,
    transformOrigin: `${x}% ${y}%`,
  };
}

export function PremiumInvitation({ inv, showDirections }: { inv: InvitationView; showDirections: boolean }) {
  const d = inv.event_date ? new Date(`${inv.event_date}T12:00:00`) : null;
  const names = (
    <h2 className="premium-names">
      <span>{inv.partner_one || "Emri"}</span>
      <em>&</em>
      <span>{inv.partner_two || "Emri"}</span>
    </h2>
  );
  const photo = inv.cover_url ? (
    <figure className="premium-photo">
      <img
        src={inv.cover_url}
        alt={`${inv.partner_one} dhe ${inv.partner_two}`}
        width={768}
        height={1024}
        decoding="async"
        style={coverStyle(inv.cover_pos_x ?? 50, inv.cover_pos_y ?? 50, inv.cover_zoom ?? 100)}
      />
    </figure>
  ) : inv.photoPlaceholder ? (
    <figure className="premium-photo premium-photo-empty">
      <Camera className="h-8 w-8" aria-hidden="true" />
      <span>Fotoja juaj këtu</span>
    </figure>
  ) : null;

  return (
    <div className={`theme-${inv.theme} premium premium-${inv.theme}`}>
      <article className="premium-card">
        {inv.theme === "floral" ? (
          <>
            <img src={botanical} alt="" aria-hidden="true" className="premium-floral premium-floral-top" />
            <img src={botanical} alt="" aria-hidden="true" className="premium-floral premium-floral-bottom" />
          </>
        ) : null}
        <header className="premium-hero">
          {inv.theme === "minimal" ? (
            <>
              {photo}
              <div className="premium-overlay">
                <p className="premium-kicker">Ne martohemi</p>
                {names}
              </div>
            </>
          ) : (
            <>
              <p className="premium-kicker">Ju ftojmë në dasmën tonë</p>
              {photo}
              {names}
            </>
          )}
        </header>
        <div className="premium-body">
          <div className="premium-ornament" aria-hidden="true">
            <span /> <Heart className="h-4 w-4" /> <span />
          </div>
          <div className="premium-date">
            <span>{d ? DAYS[d.getDay()] : "Dita"}</span>
            <strong>{d ? d.getDate() : "--"}</strong>
            <span>{inv.event_time || "Ora"}</span>
          </div>
          <p className="premium-month">{d ? `${MONTHS[d.getMonth()]} ${d.getFullYear()}` : "Muaji"}</p>
          <InvitationLocation venue={inv.venue} address={inv.address} />
          {inv.event_date ? <Countdown eventDate={inv.event_date} eventTime={inv.event_time} /> : null}
          {showDirections ? <MapsButton venue={inv.venue} address={inv.address} /> : null}
          {inv.message ? <p className="premium-message">“{inv.message}”</p> : null}
          {inv.gallery && inv.gallery.length ? (
            <section className="premium-gallery" aria-label="Galeria e çiftit">
              <p className="premium-kicker">Momentet tona</p>
              <div>
                {inv.gallery.map((url, i) => (
                  <a key={url} href={url} target="_blank" rel="noreferrer">
                    <img src={url} alt={`Foto e çiftit ${i + 1}`} loading="lazy" decoding="async" />
                  </a>
                ))}
              </div>
            </section>
          ) : null}
          <p className="premium-sign">Me dashuri & gëzim</p>
        </div>
      </article>
    </div>
  );
}
