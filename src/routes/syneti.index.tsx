import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { WhatsAppContact } from "@/components/WhatsAppContact";
import { SynetiInvitation } from "@/components/SynetiInvitation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getSynetiPackages } from "@/lib/syneti.functions";
import { SYNETI_DEFAULT_PRICE, synetiSampleInvitation } from "@/lib/syneti";
import { useSynetiText } from "@/lib/syneti-i18n";
import { SYNETI_THEMES } from "@/lib/themes";

const TITLE = "Ftesa Digjitale për Syneti | Ftesa Jone";
const DESC = "Krijoni ftesa digjitale elegante për festën e Synetisë. Zgjidhni dizajnin tuaj të preferuar, personalizoni ftesën me emrin e djalit dhe dërgojeni online te mysafirët tuaj.";

export const Route = createFileRoute("/syneti/")({
  loader: async () => {
    try {
      return await getSynetiPackages();
    } catch {
      return null;
    }
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: "Ftesa Syneti — në blu mbretërore" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SynetiLanding,
});

function SynetiLanding() {
  const pkgs = Route.useLoaderData();
  const { s, lang } = useSynetiText();
  const navigate = useNavigate();
  const openPreview = (id: string) => navigate({ to: "/syneti/preview/$template", params: { template: id } });
  const row = pkgs?.find((r) => r.package === "classic");
  const price = row?.price ?? SYNETI_DEFAULT_PRICE;
  const active = (id: string) => !row || !row.templates.length || row.templates.includes(id);
  // Shqip: përfshirjet e ndryshueshme nga administratori; gjuhët e tjera: përkthimet.
  const features = lang === "sq" && row?.features.length ? row.features : s.packages.features;

  return (
    <div className="syneti syneti-page">
      <header className="syneti-nav">
        <Link to="/" className="syneti-brand inline-flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> FTESA JONE</Link>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Button asChild className="syneti-gold-btn hidden sm:inline-flex"><Link to="/syneti/krijo">{s.landing.create}</Link></Button>
        </div>
      </header>
      <main>
        <section className="syneti-section grid items-center gap-10 pt-10 lg:grid-cols-2">
          <div>
            <p className="syneti-eyebrow">{s.landing.eyebrow}</p>
            <h1 className="syneti-h mt-4">{s.landing.title} <em>{s.landing.titleEm}</em></h1>
            <p className="syneti-lead mt-5">{s.landing.desc}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="syneti-gold-btn min-h-12"><Link to="/syneti/krijo">{s.landing.create} <ArrowUpRight className="h-4 w-4" /></Link></Button>
              <Button asChild size="lg" variant="outline" className="min-h-12 bg-transparent"><a href="#dizajnet">{s.landing.see}</a></Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">{s.landing.note}</p>
          </div>
          <div className="mx-auto w-full max-w-sm">
            <SynetiInvitation inv={synetiSampleInvitation("s-royal")} showDirections={false} />
          </div>
        </section>

        <section id="dizajnet" className="syneti-section">
          <p className="syneti-eyebrow">{s.landing.galleryEyebrow}</p>
          <h2 className="syneti-h mt-3">{s.landing.galleryTitle}</h2>
          <p className="syneti-lead mt-3">{s.landing.galleryDesc}</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SYNETI_THEMES.filter(active).map((id) => (
              <article key={id} className="syneti-panel flex flex-col">
                <div
                  role="link"
                  tabIndex={0}
                  className="block h-72 cursor-pointer overflow-hidden"
                  aria-label={`${s.landing.preview}: ${s.templates[id].name}`}
                  onClick={() => openPreview(id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPreview(id); } }}
                >
                  <div className="pointer-events-none origin-top scale-[.62]" style={{ width: "161%", marginLeft: "-30.5%" }}>
                    <SynetiInvitation inv={synetiSampleInvitation(id)} showDirections={false} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <p className="syneti-eyebrow">{s.landing.tag}</p>
                  <h3 className="font-display text-lg">{s.templates[id].name}</h3>
                  <p className="text-sm text-muted-foreground">{s.templates[id].desc}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-3">
                    <Button asChild size="sm" variant="outline" className="bg-transparent"><Link to="/syneti/preview/$template" params={{ template: id }}>{s.landing.preview}</Link></Button>
                    <Button asChild size="sm" className="syneti-gold-btn"><Link to="/syneti/krijo" search={{ template: id }}>{s.landing.use}</Link></Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="syneti-section">
          <p className="syneti-eyebrow">{s.landing.howEyebrow}</p>
          <h2 className="syneti-h mt-3">{s.landing.howTitle}</h2>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {s.landing.steps.map(([title, desc], i) => (
              <li key={title} className="syneti-panel p-5">
                <span className="syneti-boy block text-5xl" aria-hidden="true">{i + 1}</span>
                <h3 className="font-display mt-2 text-lg">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="cmimet" className="syneti-section">
          <p className="syneti-eyebrow">{s.landing.pricingEyebrow}</p>
          <h2 className="syneti-h mt-3">{s.landing.pricingTitle}</h2>
          <p className="syneti-lead mt-3">{s.landing.pricingDesc}</p>
          <div className="mt-10 max-w-md">
            <article className="syneti-panel relative flex flex-col p-6">
              <h3 className="font-display flex items-center gap-2 text-xl"><Star className="h-5 w-5 text-primary" />{s.packages.name}</h3>
              <p className="mt-4"><span className="syneti-boy text-6xl">€{price}</span> <span className="text-sm text-muted-foreground">{s.landing.per}</span></p>
              <ul className="mt-3 space-y-2 text-sm">
                {features.map((f) => (
                  <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{f}</li>
                ))}
              </ul>
              <Button asChild className="syneti-gold-btn mt-6 min-h-11"><Link to="/syneti/krijo">{s.landing.choose}</Link></Button>
            </article>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">{s.landing.active}</p>
          <p className="mt-1 text-sm text-muted-foreground">{s.landing.payment}</p>
        </section>

        <section className="syneti-section">
          <p className="syneti-eyebrow">{s.landing.faqEyebrow}</p>
          <h2 className="syneti-h mt-3">{s.landing.faqTitle}</h2>
          <Accordion type="single" collapsible className="mt-8 max-w-3xl">
            {s.landing.faq.map(([q, a]) => (
              <AccordionItem key={q} value={q} className="border-border">
                <AccordionTrigger className="text-left">{q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="syneti-section text-center">
          <h2 className="syneti-h">{s.landing.finalTitle}</h2>
          <p className="syneti-lead mx-auto mt-3">{s.landing.finalDesc}</p>
          <Button asChild size="lg" className="syneti-gold-btn mt-8 min-h-12"><Link to="/syneti/krijo">{s.landing.create}</Link></Button>
          <p className="mt-8 text-sm"><Link to="/" className="underline">{s.landing.wedding}</Link></p>
        </section>
      </main>
      <WhatsAppContact />
    </div>
  );
}
