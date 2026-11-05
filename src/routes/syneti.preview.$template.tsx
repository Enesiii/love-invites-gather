import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SynetiInvitation } from "@/components/SynetiInvitation";
import { SynetiMusic, SynetiOpening } from "@/components/SynetiOpening";
import { PhonePreview } from "@/components/PhonePreview";
import { LanguageSelector } from "@/components/LanguageSelector";
import { WhatsAppContact } from "@/components/WhatsAppContact";
import { THEME_LABELS } from "@/lib/themes";
import { isSynetiTemplateSlug, synetiSampleInvitation } from "@/lib/syneti";
import { useSynetiText } from "@/lib/syneti-i18n";

export const Route = createFileRoute("/syneti/preview/$template")({
  loader: ({ params }) => {
    if (!isSynetiTemplateSlug(params.template)) throw notFound();
    return { template: params.template };
  },
  head: ({ loaderData }) => {
    const name = loaderData ? THEME_LABELS[loaderData.template] : "Syneti";
    const title = `${name} — Ftesa Syneti`;
    const desc = `Shikoni ftesën e Synetit “${name}” me zarf që hapet, muzikë dhe numërim mbrapsht.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: SynetiPreview,
});

function SynetiPreview() {
  const { template } = Route.useLoaderData();
  const { s } = useSynetiText();
  const [opened, setOpened] = useState(false);
  const inv = synetiSampleInvitation(template);
  return (
    <div className="syneti syneti-page">
      <header className="preview-nav">
        <Button asChild variant="ghost">
          <Link to="/syneti"><ArrowLeft className="h-4 w-4" /> Syneti</Link>
        </Button>
        <span className="text-xs text-muted-foreground">{s.creator.previewLabel} · {s.templates[template].name}</span>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Button asChild className="syneti-gold-btn">
            <Link to="/syneti/krijo" search={{ template }}>{s.landing.use} <ArrowUpRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </header>
      <WhatsAppContact />
      <PhonePreview>
        {opened ? (
          <main className="syneti syneti-guest invitation-reveal mx-auto max-w-xl px-3 py-6">
            <div className="mb-4 flex justify-center"><SynetiMusic music={inv.music ?? null} /></div>
            <SynetiInvitation inv={inv} showDirections />
          </main>
        ) : (
          <SynetiOpening inv={inv} onOpen={() => setOpened(true)} />
        )}
      </PhonePreview>
    </div>
  );
}
