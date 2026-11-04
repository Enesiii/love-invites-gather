import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { WhatsAppContact } from "@/components/WhatsAppContact";
import { KanagjegjiInvitation } from "@/components/KanagjegjiInvitation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getKanaPackages } from "@/lib/kanagjegji.functions";
import { KANAGJEGJI_DEFAULT_PRICES, kanaSampleInvitation, kanaPackageOf } from "@/lib/kanagjegji";
import { useKanaText } from "@/lib/kanagjegji-i18n";
import { KANAGJEGJI_THEMES } from "@/lib/themes";

const TITLE = "Ftesa Kanagjegji — ftesa dixhitale luksoze në të kuqe dhe ar | Ftesa Jone";
const DESC = "Krijoni ftesë dixhitale për natën e kanagjegjit: zarf që hapet, muzikë, RSVP online, Google Maps dhe foto nga mysafirët. Klasike €10, Premium me foto €15.";

export const Route = createFileRoute("/kanagjegji/")({
  loader: async () => {
    try {
      return await getKanaPackages();
    } catch {
      return null;
    }
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: "Ftesa Kanagjegji — në të kuqe dhe ar" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KanaLanding,
});

function KanaLanding() {
  const pkgs = Route.useLoaderData();
  const { k, lang } = useKanaText();
  const navigate = useNavigate();
  const openPreview = (id: string) => navigate({ to: "/kanagjegji/preview/$template", params: { template: id } });
  const price = (p: "classic" | "premium") => pkgs?.find((r) => r.package === p)?.price ?? KANAGJEGJI_DEFAULT_PRICES[p];
  const active = (id: string) => {
    const row = pkgs?.find((r) => r.package === kanaPackageOf(id));
    return !row || !row.templates.length || row.templates.includes(id);
  };
  // Shqip: përfshirjet e ndryshueshme nga administratori; gjuhët e tjera: përkthimet.
  const featuresFor = (p: "classic" | "premium", fallback: string[]) => {
    const row = pkgs?.find((r) => r.package === p);
    return lang === "sq" && row?.features.length ? row.features : fallback;
  };

  return (
    <div className="kana kana-page">
      <header className="kana-nav">
        <Link to="/" className="kana-brand inline-flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> FTESA JONE</Link>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Button asChild className="kana-gold-btn hidden sm:inline-flex"><Link to="/kanagjegji/krijo">{k.landing.create}</Link></Button>
        </div>
      </header>
      <main>
        <section className="kana-section grid items-center gap-10 pt-10 lg:grid-cols-2">
          <div>
            <p className="kana-eyebrow">{k.landing.eyebrow}</p>
            <h1 className="kana-h mt-4">{k.landing.title} <em>{k.landing.titleEm}</em></h1>
            <p className="kana-lead mt-5">{k.landing.desc}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="kana-gold-btn min-h-12"><Link to="/kanagjegji/krijo">{k.landing.create} <ArrowUpRight className="h-4 w-4" /></Link></Button>
              <Button asChild size="lg" variant="outline" className="min-h-12 bg-transparent"><a href="#dizajnet">{k.landing.see}</a></Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">{k.landing.note}</p>
          </div>
          <div className="mx-auto w-full max-w-sm">
            <KanagjegjiInvitation inv={kanaSampleInvitation("k-traditional")} showDirections={false} />
          </div>
        </section>

        <section id="dizajnet" className="kana-section">
          <p className="kana-eyebrow">{k.landing.galleryEyebrow}</p>
          <h2 className="kana-h mt-3">{k.landing.galleryTitle}</h2>
          <p className="kana-lead mt-3">{k.landing.galleryDesc}</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {KANAGJEGJI_THEMES.filter(active).map((id) => (
              <article key={id} className="kana-panel flex flex-col">
                <div
                  role="link"
                  tabIndex={0}
                  className="block h-72 cursor-pointer overflow-hidden"
                  aria-label={`${k.landing.preview}: ${k.templates[id].name}`}
                  onClick={() => openPreview(id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPreview(id); } }}
                >
                  <div className="pointer-events-none origin-top scale-[.62]" style={{ width: "161%", marginLeft: "-30.5%" }}>
                    <KanagjegjiInvitation inv={kanaSampleInvitation(id)} showDirections={false} />
                  </div>
                </Link>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <p className="kana-eyebrow">{kanaPackageOf(id) === "premium" ? k.landing.premiumTag : k.landing.classicTag}</p>
                  <h3 className="font-display text-lg">{k.templates[id].name}</h3>
                  <p className="text-sm text-muted-foreground">{k.templates[id].desc}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-3">
                    <Button asChild size="sm" variant="outline" className="bg-transparent"><Link to="/kanagjegji/preview/$template" params={{ template: id }}>{k.landing.preview}</Link></Button>
                    <Button asChild size="sm" className="kana-gold-btn"><Link to="/kanagjegji/krijo" search={{ template: id }}>{k.landing.use}</Link></Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="kana-section">
          <p className="kana-eyebrow">{k.landing.howEyebrow}</p>
          <h2 className="kana-h mt-3">{k.landing.howTitle}</h2>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {k.landing.steps.map(([title, desc], i) => (
              <li key={title} className="kana-panel p-5">
                <span className="kana-bride block text-5xl" aria-hidden="true">{i + 1}</span>
                <h3 className="font-display mt-2 text-lg">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="cmimet" className="kana-section">
          <p className="kana-eyebrow">{k.landing.pricingEyebrow}</p>
          <h2 className="kana-h mt-3">{k.landing.pricingTitle}</h2>
          <p className="kana-lead mt-3">{k.landing.pricingDesc}</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <PackageCard name={k.packages.classic} price={price("classic")} per={k.landing.per} tag={k.packages.noPhoto} features={featuresFor("classic", k.packages.classicFeatures)} cta={k.landing.choose} pkg="classic" />
            <PackageCard name={k.packages.premium} price={price("premium")} per={k.landing.per} tag={k.packages.withPhoto} includes={k.packages.premiumIncludes} features={featuresFor("premium", k.packages.premiumFeatures)} cta={k.landing.choose} pkg="premium" featured={k.landing.recommended} />
          </div>
          <p className="mt-6 text-sm text-muted-foreground">{k.landing.active}</p>
          <p className="mt-1 text-sm text-muted-foreground">{k.landing.payment}</p>
        </section>

        <section className="kana-section">
          <p className="kana-eyebrow">{k.landing.faqEyebrow}</p>
          <h2 className="kana-h mt-3">{k.landing.faqTitle}</h2>
          <Accordion type="single" collapsible className="mt-8 max-w-3xl">
            {k.landing.faq.map(([q, a]) => (
              <AccordionItem key={q} value={q} className="border-border">
                <AccordionTrigger className="text-left">{q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="kana-section text-center">
          <h2 className="kana-h">{k.landing.finalTitle}</h2>
          <p className="kana-lead mx-auto mt-3">{k.landing.finalDesc}</p>
          <Button asChild size="lg" className="kana-gold-btn mt-8 min-h-12"><Link to="/kanagjegji/krijo">{k.landing.create}</Link></Button>
          <p className="mt-8 text-sm"><Link to="/" className="underline">{k.landing.wedding}</Link></p>
        </section>
      </main>
      <WhatsAppContact />
    </div>
  );
}

function PackageCard({ name, price, per, tag, includes, features, cta, pkg, featured }: { name: string; price: number; per: string; tag: string; includes?: string; features: string[]; cta: string; pkg: "classic" | "premium"; featured?: string }) {
  return (
    <article className={`kana-panel relative flex flex-col p-6 ${featured ? "border-2" : ""}`} style={featured ? { borderColor: "var(--kana-gold)" } : undefined}>
      {featured ? <span className="category-badge absolute right-4 top-4 bg-primary px-2 py-1 text-[10px] tracking-[0.2em] text-primary-foreground">{featured}</span> : null}
      <h3 className="font-display flex items-center gap-2 text-xl">{pkg === "premium" ? <Crown className="h-5 w-5 text-primary" /> : null}{name}</h3>
      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{tag}</p>
      <p className="mt-4"><span className="kana-bride text-6xl">€{price}</span> <span className="text-sm text-muted-foreground">{per}</span></p>
      {includes ? <p className="mt-4 text-sm font-medium text-primary">{includes}</p> : null}
      <ul className="mt-3 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{f}</li>
        ))}
      </ul>
      <Button asChild className="kana-gold-btn mt-6 min-h-11"><Link to="/kanagjegji/krijo" search={{ package: pkg }}>{cta}</Link></Button>
    </article>
  );
}
