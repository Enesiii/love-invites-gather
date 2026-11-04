import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KanagjegjiInvitation } from "@/components/KanagjegjiInvitation";
import { KanaMusic, KanaOpening } from "@/components/KanaOpening";
import { PhonePreview } from "@/components/PhonePreview";
import { LanguageSelector } from "@/components/LanguageSelector";
import { WhatsAppContact } from "@/components/WhatsAppContact";
import { THEME_LABELS } from "@/lib/themes";
import { isKanaTemplateSlug, kanaSampleInvitation } from "@/lib/kanagjegji";
import { useKanaText } from "@/lib/kanagjegji-i18n";

export const Route = createFileRoute("/kanagjegji/preview/$template")({
  loader: ({ params }) => {
    if (!isKanaTemplateSlug(params.template)) throw notFound();
    return { template: params.template };
  },
  head: ({ loaderData }) => {
    const name = loaderData ? THEME_LABELS[loaderData.template] : "Kanagjegji";
    const title = `${name} — Ftesa Kanagjegji`;
    const desc = `Shikoni ftesën e Kanagjegjit “${name}” me zarf që hapet, muzikë dhe numërim mbrapsht.`;
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
  component: KanaPreview,
});

function KanaPreview() {
  const { template } = Route.useLoaderData();
  const { k } = useKanaText();
  const [opened, setOpened] = useState(false);
  const inv = kanaSampleInvitation(template);
  return (
    <div className="kana kana-page">
      <header className="preview-nav">
        <Button asChild variant="ghost">
          <Link to="/kanagjegji"><ArrowLeft className="h-4 w-4" /> Kanagjegji</Link>
        </Button>
        <span className="text-xs text-muted-foreground">{k.creator.previewLabel} · {k.templates[template].name}</span>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Button asChild className="kana-gold-btn">
            <Link to="/kanagjegji/krijo" search={{ template }}>{k.landing.use} <ArrowUpRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </header>
      <WhatsAppContact />
      <PhonePreview>
        {opened ? (
          <main className="kana kana-guest invitation-reveal mx-auto max-w-xl px-3 py-6">
            <div className="mb-4 flex justify-center"><KanaMusic music={inv.music} /></div>
            <KanagjegjiInvitation inv={inv} showDirections />
          </main>
        ) : (
          <KanaOpening inv={inv} onOpen={() => setOpened(true)} />
        )}
      </PhonePreview>
    </div>
  );
}
