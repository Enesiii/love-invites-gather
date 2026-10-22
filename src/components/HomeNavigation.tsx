import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useI18n } from "@/lib/i18n";

export function HomeNavigation() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const items = [
    { label: t.nav.collection, id: "koleksioni" },
    { label: t.nav.how, id: "si-funksionon" },
    { label: t.nav.pricing, id: "cmimet" },
    { label: t.nav.faq, id: "pyetje" },
  ];
  function go(id: string) {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }
  return (
    <header className="home-header">
      <a href="#main" className="skip-link">
        {t.nav.skip}
      </a>
      <div className="home-container home-nav">
        <Link to="/" className="home-brand font-display">
          <Heart className="h-5 w-5 fill-primary text-primary" aria-hidden="true" /> Ftesa Dasme
          <span className="brand-period">.</span>
        </Link>
        <nav className="home-desktop-nav" aria-label={t.nav.main}>
          {items.map((item) => (
            <Button key={item.id} variant="ghost" onClick={() => go(item.id)}>
              {item.label}
            </Button>
          ))}
        </nav>
        <div className="home-nav-actions">
          <LanguageSelector />
          <Button asChild className="home-cta nav-cta">
            <Link to="/krijo">
              {t.nav.create} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="home-menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.nav.close : t.nav.open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" className="home-mobile-nav home-container" aria-label={t.nav.mobile}>
          {items.map((item) => (
            <Button key={item.id} variant="ghost" onClick={() => go(item.id)}>
              {item.label}
            </Button>
          ))}
        </nav>
      )}
    </header>
  );
}
