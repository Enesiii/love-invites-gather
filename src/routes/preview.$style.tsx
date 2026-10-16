import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvitationCard } from "@/components/InvitationCard";
import { OrderDialog } from "@/components/OrderDialog";
import { InvitationOpening, InvitationMusic } from "@/components/InvitationOpening";
import { WhatsAppContact } from "@/components/WhatsAppContact";
import { findInvitationStyle, previewInvitation } from "@/lib/invitation-collection";

export const Route = createFileRoute("/preview/$style")({
  loader: ({ params }) => {
    const style = findInvitationStyle(params.style);
    if (!style) throw notFound();
    return style;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Pamja e ftesës"} — Ftesa Dasme` },
      {
        name: "description",
        content: loaderData?.description ?? "Shikoni një ftesë dasme elegante.",
      },
      { property: "og:title", content: `${loaderData?.name ?? "Pamja e ftesës"} — Ftesa Dasme` },
      {
        property: "og:description",
        content: loaderData?.description ?? "Shikoni një ftesë dasme elegante.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StylePreview,
});

function StylePreview() {
  const style = Route.useLoaderData();
  const [opened, setOpened] = useState(false);
  const inv = previewInvitation(style.id);
  return (
    <div className={`theme-${style.id} bg-background text-foreground min-h-screen`}>
      <header className="preview-nav">
        <Button asChild variant="ghost">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" /> Koleksioni
          </Link>
        </Button>
        <span className="text-xs text-muted-foreground">Shembull ftese</span>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link to="/krijo" search={{ theme: style.id }}>
              Përdor këtë stil <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
          <OrderDialog style={style.id} styleName={style.name} />
        </div>
      </header>
      {opened ? (
        <main className="invitation-reveal mx-auto max-w-xl px-4 py-8">
          <div className="mb-6 flex justify-end">
            <InvitationMusic />
          </div>
          <InvitationCard inv={inv} showDirections />
        </main>
      ) : (
        <InvitationOpening inv={inv} onOpen={() => setOpened(true)} />
      )}
    </div>
  );
}
