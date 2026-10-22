import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Heart,
  Link2,
  ListChecks,
  Mail,
  Music2,
  Palette,
  Smartphone,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HomePricing } from "@/components/HomePricing";
import { useI18n } from "@/lib/i18n";
import { SupportButton } from "@/components/SupportButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HomeNavigation } from "@/components/HomeNavigation";
import { WhatsAppContact } from "@/components/WhatsAppContact";
import { HomeGallery } from "@/components/HomeGallery";
import stationery from "@/assets/home-stationery.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ftesa Dasme — ftesa dixhitale elegante në Kosovë" },
      {
        name: "description",
        content:
          "Zbuloni ftesa dasme elegante, hapje zarfi me animacion dhe RSVP online. Krijoni ftesën tuaj dhe ndajeni me më të dashurit në Kosovë dhe kudo.",
      },
      { property: "og:title", content: "Ftesa Dasme — një fillim i bukur për ditën tuaj" },
      {
        property: "og:description",
        content:
          "Ftesa dixhitale me elegancë, muzikë dhe RSVP. Zgjidhni stilin që tregon historinë tuaj.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const stepIcons = [Palette, ListChecks, Link2, Users];
const promiseIcons = [Mail, Users, Music2, Smartphone];

function Index() {
  const { t, lang } = useI18n();
  useEffect(() => {
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = "sq";
    };
  }, [lang]);
  function scrollToCollection() {
    document.getElementById("koleksioni")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }
  return (
    <div className="home-page">
      <HomeNavigation />
      <main id="main" tabIndex={-1}>
        <section className="home-hero">
          <img
            src={stationery}
            width={1536}
            height={1024}
            fetchPriority="high"
            decoding="async"
            alt={t.hero.alt}
            className="home-hero-image"
          />
          <div className="home-container hero-content">
            <p className="home-eyebrow hero-eyebrow">
              <span /> {t.hero.eyebrow}
            </p>
            <h1 className="font-display">
              {t.hero.title}
              <span>
                {t.hero.line} <em>{t.hero.lineEm}</em>
              </span>
            </h1>
            <p className="hero-description">{t.hero.desc}</p>
            <div className="hero-actions">
              <Button asChild size="lg" className="home-cta">
                <Link to="/krijo">
                  {t.hero.cta} <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="home-secondary">
                <Link to="/preview/$style" params={{ style: "rose" }}>
                  {t.hero.see} <Heart className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <p className="hero-note">
              <Check className="h-3.5 w-3.5" aria-hidden="true" /> {t.hero.note}
            </p>
          </div>
          <div className="hero-invitation-copy" aria-hidden="true">
            <Heart className="h-5 w-5 fill-primary text-primary" />
            <span>{t.hero.invite}</span>
            <p className="font-display">
              Enes{"\u00a0"}<em>&</em>{"\u00a0"}Selma
            </p>
            <span>{t.hero.date}</span>
          </div>
        </section>
        <div className="home-promise">
          <div className="home-container">
            {t.promise.map((text, i) => {
              const Icon = promiseIcons[i];
              return (
                <span key={text}>
                  <Icon aria-hidden="true" /> {text}
                </span>
              );
            })}
          </div>
        </div>
        <section id="koleksioni" className="home-section collection-section">
          <div className="home-container">
            <div className="section-heading">
              <p className="home-eyebrow">{t.collection.eyebrow}</p>
              <h2 className="font-display">
                {t.collection.title} <em>{t.collection.em}</em>
              </h2>
              <p>{t.collection.desc}</p>
            </div>
            <HomeGallery />
            <div className="collection-bottom">
              <span>{t.collection.bottom}</span>
              <Button variant="ghost" onClick={scrollToCollection}>
                {t.collection.find} <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        <section id="si-funksionon" className="home-section how-section">
          <div className="home-container">
            <div className="section-heading">
              <p className="home-eyebrow">{t.how.eyebrow}</p>
              <h2 className="font-display">
                {t.how.title} <em>{t.how.em}</em>
              </h2>
              <p>{t.how.desc}</p>
            </div>
            <div className="home-steps">
              {t.how.steps.map(([title, text], i) => {
                const Icon = stepIcons[i];
                return (
                  <div key={title} className="home-step">
                    <div className="step-top">
                      <span className="step-icon">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="step-line" />
                    </div>
                    <span className="step-number font-display">0{i + 1}</span>
                    <h3 className="font-display">{title}</h3>
                    <p>{text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <section className="home-section home-comparison">
          <div className="home-container comparison-layout">
            <div className="comparison-copy">
              <p className="home-eyebrow">{t.compare.eyebrow}</p>
              <h2 className="font-display">
                {t.compare.title}
                <br />
                <em>{t.compare.em}</em>
              </h2>
              <p>{t.compare.desc}</p>
            </div>
            <div className="comparison-list">
              <h3 className="font-display">
                <Sparkles className="h-5 w-5" aria-hidden="true" /> {t.compare.listTitle}
              </h3>
              {t.compare.items.map((text) => (
                <p key={text}>
                  <Check className="h-4 w-4" aria-hidden="true" />
                  {text}
                </p>
              ))}
              <Button asChild className="comparison-button" variant="outline">
                <Link to="/krijo">
                  {t.compare.cta} <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        <HomePricing />
        <section id="pyetje" className="home-section faq-section">
          <div className="home-container faq-layout">
            <div>
              <p className="home-eyebrow">{t.faq.eyebrow}</p>
              <h2 className="font-display">
                {t.faq.title}
                <br />
                <em>{t.faq.em}</em>
              </h2>
              <p>{t.faq.desc}</p>
            </div>
            <Accordion type="single" collapsible className="home-faq">
              {t.faq.items.map(([q, a], i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger>{q}</AccordionTrigger>
                  <AccordionContent>{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
        <section className="home-final">
          <div className="home-container">
            <Heart className="mx-auto h-6 w-6 text-primary" strokeWidth={1} aria-hidden="true" />
            <h2 className="font-display">
              {t.final.title} <em>{t.final.em}</em>
            </h2>
            <p>{t.final.desc}</p>
            <Button asChild size="lg" className="home-cta">
              <Link to="/krijo">
                {t.final.cta} <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="home-footer home-container">
        <Link to="/" className="home-brand font-display">
          <Heart className="h-4 w-4 text-primary" aria-hidden="true" /> Ftesa Dasme.
        </Link>
        <span>{t.footer.tagline}</span>
        <SupportButton variant="ghost" className="home-support" />
        <Button
          variant="ghost"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth",
            })
          }
        >
          {t.footer.top} <ArrowDown className="h-4 w-4 rotate-180" />
        </Button>
      </footer>
      <WhatsAppContact />
    </div>
  );
}
