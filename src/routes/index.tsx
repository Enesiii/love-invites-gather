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
import { Button } from "@/components/ui/button";
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

const steps = [
  {
    icon: Palette,
    title: "Zgjidhni stilin",
    text: "Një prekje romantike, natyrale apo klasike. Gjeni ftesën që ju përfaqëson.",
  },
  {
    icon: ListChecks,
    title: "Shtoni detajet",
    text: "Emrat tuaj, data, salla dhe një mesazh i veçantë për mysafirët.",
  },
  {
    icon: Link2,
    title: "Ndani dashurinë",
    text: "Dërgojeni lidhjen në WhatsApp, Viber ose kudo që janë njerëzit tuaj.",
  },
  {
    icon: Users,
    title: "Merrni përgjigjet",
    text: "Të gjitha konfirmimet dhe numri i të ftuarve, në një vend.",
  },
];
const faqs = [
  [
    "A duhet aplikacion për ta hapur ftesën?",
    "Jo. Ftesa hapet drejtpërdrejt në shfletuesin e telefonit ose kompjuterit, pa shkarkuar asgjë.",
  ],
  [
    "A mund ta shoh ftesën para se ta krijoj?",
    "Po. Hapni një stil nga koleksioni për të provuar zarfin, muzikën dhe pamjen e ftesës. Gjatë krijimit shihni edhe detajet tuaja në pamjen paraprake.",
  ],
  [
    "Si i marr përgjigjet e mysafirëve?",
    "Mysafirët plotësojnë formularin në ftesë. Ju i shihni përgjigjet dhe numrin e pjesëmarrësve në lidhjen private të menaxhimit që merrni pas krijimit.",
  ],
  [
    "A mund ta dërgoj edhe jashtë Kosovës?",
    "Po. Lidhja e ftesës mund të ndahet me familjen dhe miqtë kudo që ndodhen.",
  ],
  [
    "A fillon muzika automatikisht?",
    "Jo. Mysafirët mund ta luajnë ose ta ndalojnë vetë muzikën, kur dëshirojnë.",
  ],
  [
    "A më duhet një llogari?",
    "Jo. Pas krijimit merrni një lidhje private për të parë përgjigjet. Ruajeni me kujdes dhe mos e ndani me mysafirët.",
  ],
];

function Index() {
  function scrollToCollection() {
    document
      .getElementById("koleksioni")
      ?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  }
  return (
    <div className="home-page">
      <HomeNavigation />
      <main>
        <section className="home-hero">
          <img
            src={stationery}
            width={1536}
            height={1024}
            fetchPriority="high"
            alt="Zarf elegant me vulë zemre dhe ftesë të bardhë"
            className="home-hero-image"
          />
          <div className="home-container hero-content">
            <p className="home-eyebrow hero-eyebrow">
              <span /> PËR MOMENTET QË MBETEN
            </p>
            <h1 className="font-display">
              Ftesa Dasme
              <span>
                Dixhitale. <em>Me dashuri.</em>
              </span>
            </h1>
            <p className="hero-description">
              Dita juaj meriton një fillim të bukur. Ftoni njerëzit tuaj me një ftesë elegante,
              personale dhe të lehtë për t’u ndarë.
            </p>
            <div className="hero-actions">
              <Button asChild size="lg" className="home-cta">
                <Link to="/krijo">
                  Krijo ftesën tënde <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="home-secondary">
                <Link to="/preview/$style" params={{ style: "rose" }}>
                  Shiko një ftesë <Heart className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <p className="hero-note">
              <Check className="h-3.5 w-3.5" /> Një lidhje. Një kujtim. Të gjithë pranë.
            </p>
          </div>
          <div className="hero-invitation-copy" aria-hidden="true">
            <Heart className="h-5 w-5 fill-primary text-primary" />
            <span>ME GËZIM JU FTOJMË</span>
            <p className="font-display">
              Enes{"\u00a0"}<em>&</em>{"\u00a0"}Selma
            </p>
            <span>19 QERSHOR 2027 · PRISHTINË</span>
          </div>
        </section>
        <div className="home-promise">
          <div className="home-container">
            <span>
              <Mail /> Zarf që hapet me dashuri
            </span>
            <span>
              <Users /> Përgjigjet në një vend
            </span>
            <span>
              <Music2 /> Muzikë për momentin
            </span>
            <span>
              <Smartphone /> E bukur në çdo telefon
            </span>
          </div>
        </div>
        <section id="koleksioni" className="home-section collection-section">
          <div className="home-container">
            <div className="section-heading">
              <p className="home-eyebrow">KOLEKSIONI I FTESAVE</p>
              <h2 className="font-display">
                Një stil për <em>historinë tuaj.</em>
              </h2>
              <p>Detaje të menduara me kujdes. Elegancë që ndihet që në hapjen e zarfit.</p>
            </div>
            <HomeGallery />
            <div className="collection-bottom">
              <span>Çdo histori dashurie është e veçantë. Edhe ftesa juaj.</span>
              <Button variant="ghost" onClick={scrollToCollection}>
                Gjeni stilin tuaj <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        <section id="si-funksionon" className="home-section how-section">
          <div className="home-container">
            <div className="section-heading">
              <p className="home-eyebrow">NGA IDEJA TE FTESA</p>
              <h2 className="font-display">
                Pak hapa. <em>Shumë emocion.</em>
              </h2>
              <p>Më pak organizim, më shumë kohë për ditën tuaj.</p>
            </div>
            <div className="home-steps">
              {steps.map(({ icon: Icon, title, text }, i) => (
                <div key={title} className="home-step">
                  <div className="step-top">
                    <span className="step-icon">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="step-line" />
                  </div>
                  <span className="step-number font-display">0{i + 1}</span>
                  <h3 className="font-display">{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="home-section home-comparison">
          <div className="home-container comparison-layout">
            <div className="comparison-copy">
              <p className="home-eyebrow">TRADITA TAKON TË SOTMEN</p>
              <h2 className="font-display">
                E njëjta ndjenjë.
                <br />
                <em>Një mënyrë e re.</em>
              </h2>
              <p>
                Bukuria e një ftese tradicionale, me lehtësinë e një lidhjeje dixhitale. Nga
                Prishtina te familja larg, dashuria arrin menjëherë.
              </p>
            </div>
            <div className="comparison-list">
              <h3 className="font-display">
                <Sparkles className="h-5 w-5" /> E menduar për ju
              </h3>
              {[
                "Pa printim, pa pritje për dërgim",
                "Një lidhje që ndahet menjëherë",
                "Konfirmime pa telefonata të panumërta",
                "Drejtimet për në sallë me Google Maps",
              ].map((text) => (
                <p key={text}>
                  <Check className="h-4 w-4" />
                  {text}
                </p>
              ))}
              <Button asChild className="comparison-button" variant="outline">
                <Link to="/krijo">
                  Krijo ftesën tënde <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        <section id="pyetje" className="home-section faq-section">
          <div className="home-container faq-layout">
            <div>
              <p className="home-eyebrow">ME KËNAQËSI JU PËRGJIGJEMI</p>
              <h2 className="font-display">
                Pyetje të
                <br />
                <em>shpeshta.</em>
              </h2>
              <p>Pak qartësi përpara një fillimi të bukur.</p>
            </div>
            <Accordion type="single" collapsible className="home-faq">
              {faqs.map(([q, a], i) => (
                <AccordionItem key={q} value={`faq-${i}`}>
                  <AccordionTrigger>{q}</AccordionTrigger>
                  <AccordionContent>{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
        <section className="home-final">
          <div className="home-container">
            <Heart className="mx-auto h-6 w-6 text-primary" strokeWidth={1} />
            <h2 className="font-display">
              Le të fillojë me <em>një ftesë.</em>
            </h2>
            <p>Një ditë e juaja. Një kujtim për të gjithë.</p>
            <Button asChild size="lg" className="home-cta">
              <Link to="/krijo">
                Krijo ftesën tënde <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="home-footer home-container">
        <Link to="/" className="home-brand font-display">
          <Heart className="h-4 w-4 text-primary" /> Ftesa Dasme.
        </Link>
        <span>Me dashuri, në Kosovë.</span>
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
          Në fillim <ArrowDown className="h-4 w-4 rotate-180" />
        </Button>
      </footer>
      <WhatsAppContact />
    </div>
  );
}
