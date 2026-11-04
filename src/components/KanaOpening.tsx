import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvitationMusic } from "@/components/InvitationOpening";
import { Tulip } from "@/components/KanaOrnaments";
import type { InvitationView } from "@/components/InvitationCard";
import { useI18n, type Lang } from "@/lib/i18n";
import { kanaDictionaries } from "@/lib/kanagjegji-i18n";

const MUSIC_LABELS: Record<Lang, { play: string; stop: string; failed: string }> = {
  sq: { play: "Luaj muzikën", stop: "Ndalo muzikën", failed: "Muzika nuk u hap — provo sërish" },
  sr: { play: "Pusti muziku", stop: "Zaustavi muziku", failed: "Muzika se nije pokrenula — pokušajte ponovo" },
  tr: { play: "Müziği çal", stop: "Müziği durdur", failed: "Müzik açılamadı — tekrar deneyin" },
  en: { play: "Play music", stop: "Stop music", failed: "Music didn't start — try again" },
};

// Zarf i kuq me vulë të artë dhe shkëndija ari gjatë hapjes.
export function KanaOpening({ inv, onOpen }: { inv: InvitationView; onOpen: () => void }) {
  const { lang } = useI18n();
  const k = kanaDictionaries[lang];
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
    <div className={`kana kana-opening kana-${inv.theme} ${opening ? "is-opening" : ""}`} lang={lang}>
      <p className="kana-opening-dedication">{k.invite.dedication}</p>
      <h1 className="kana-opening-name">{inv.partner_one}</h1>
      <div className="kana-envelope" aria-hidden="true">
        <div className="kana-envelope-letter">
          <Tulip className="kana-envelope-tulip" />
          <p>{k.invite.invited}</p>
        </div>
        <div className="kana-envelope-pocket" />
        <div className="kana-envelope-flap" />
        <div className="kana-envelope-seal"><Tulip className="h-7 w-7" /></div>
        <div className="kana-sparks">{Array.from({ length: 10 }, (_, i) => <span key={i} style={{ "--i": i } as React.CSSProperties} />)}</div>
      </div>
      <Button size="lg" onClick={open} disabled={opening} className="kana-open-button">
        <Sparkles className="h-4 w-4" /> {opening ? k.invite.opening : k.invite.open}
      </Button>
    </div>
  );
}

export function KanaMusic({ music }: { music?: string | null }) {
  const { lang } = useI18n();
  if (music === "none") return null;
  const variant = music === "romantic" ? "romantic" : music === "waltz" ? "waltz" : "henna";
  return <InvitationMusic key={variant} variant={variant} labels={MUSIC_LABELS[lang]} />;
}
