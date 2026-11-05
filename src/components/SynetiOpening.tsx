import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvitationMusic } from "@/components/InvitationOpening";
import { Star } from "@/components/SynetiOrnaments";
import type { InvitationView } from "@/components/InvitationCard";
import { useI18n, type Lang } from "@/lib/i18n";
import { synetiDictionaries } from "@/lib/syneti-i18n";

const MUSIC_LABELS: Record<Lang, { play: string; stop: string; failed: string }> = {
  sq: { play: "Luaj muzikën", stop: "Ndalo muzikën", failed: "Muzika nuk u hap — provo sërish" },
  sr: { play: "Pusti muziku", stop: "Zaustavi muziku", failed: "Muzika se nije pokrenula — pokušajte ponovo" },
  tr: { play: "Müziği çal", stop: "Müziği durdur", failed: "Müzik açılamadı — tekrar deneyin" },
  en: { play: "Play music", stop: "Stop music", failed: "Music didn't start — try again" },
};

// Zarf blu mbretërore me vulë ylli dhe shkëndija argjendi gjatë hapjes.
export function SynetiOpening({ inv, onOpen }: { inv: InvitationView; onOpen: () => void }) {
  const { lang } = useI18n();
  const s = synetiDictionaries[lang];
  const [opening, setOpening] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function open() {
    if (opening) return;
    setOpening(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = setTimeout(onOpen, reduced ? 0 : 1600);
  }

  return (
    <div className={`syneti syneti-opening syneti-${inv.theme} ${opening ? "is-opening" : ""}`} lang={lang}>
      <p className="syneti-opening-dedication">{s.invite.dedication}</p>
      <h1 className="syneti-opening-name">{inv.partner_one}</h1>
      <div className="syneti-envelope" aria-hidden="true">
        <div className="syneti-envelope-letter">
          <Star className="syneti-envelope-star" />
          <p>{s.invite.invited}</p>
        </div>
        <div className="syneti-envelope-pocket" />
        <div className="syneti-envelope-flap" />
        <div className="syneti-envelope-seal"><Star className="h-7 w-7" /></div>
        <div className="syneti-sparks">{Array.from({ length: 10 }, (_, i) => <span key={i} style={{ "--i": i } as React.CSSProperties} />)}</div>
      </div>
      <Button size="lg" onClick={open} disabled={opening} className="syneti-open-button">
        <Sparkles className="h-4 w-4" /> {opening ? s.invite.opening : s.invite.open}
      </Button>
    </div>
  );
}

export function SynetiMusic({ music }: { music?: string | null }) {
  const { lang } = useI18n();
  if (music === "none") return null;
  const variant = music === "romantic" ? "romantic" : music === "waltz" ? "waltz" : "celebration";
  return <InvitationMusic key={variant} variant={variant} labels={MUSIC_LABELS[lang]} />;
}
