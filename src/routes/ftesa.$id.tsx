import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InvitationCard } from "@/components/InvitationCard";
import { ClosedInvitation } from "@/components/ClosedInvitation";
import { RsvpConfirmation } from "@/components/RsvpConfirmation";
import { InvitationMusic, InvitationOpening } from "@/components/InvitationOpening";
import { Camera, Heart } from "lucide-react";
import { getInvitation, submitRsvp } from "@/lib/invitations.functions";
import { KanaMusic, KanaOpening } from "@/components/KanaOpening";
import { SynetiMusic, SynetiOpening } from "@/components/SynetiOpening";
import { useKanaText } from "@/lib/kanagjegji-i18n";
import { useSynetiText } from "@/lib/syneti-i18n";

export const Route = createFileRoute("/ftesa/$id")({
  loader: async ({ params }) => {
    const inv = await getInvitation({ data: { id: params.id } });
    if (!inv) throw notFound();
    return inv;
  },
  head: ({ loaderData }) => {
    if (loaderData?.category === "syneti") {
      const title = `${loaderData.partner_one} — Ftesë Syneti`;
      const desc = `Jeni të ftuar në festën e synetit të ${loaderData.partner_one}. Konfirmoni pjesëmarrjen tuaj.`;
      return {
        meta: [
          { title },
          { name: "description", content: desc },
          { property: "og:title", content: title },
          { property: "og:description", content: desc },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary" },
        ],
      };
    }
    if (loaderData?.category === "kanagjegji") {
      const title = `${loaderData.partner_one} — Ftesë Kanagjegji`;
      const desc = `Jeni të ftuar në kanagjegjin e ${loaderData.partner_one}. Konfirmoni pjesëmarrjen tuaj.`;
      return {
        meta: [
          { title },
          { name: "description", content: desc },
          { property: "og:title", content: title },
          { property: "og:description", content: desc },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary" },
        ],
      };
    }
    const title = loaderData
      ? `${loaderData.partner_one} & ${loaderData.partner_two} — Ftesë dasme`
      : "Ftesë dasme";
    const desc = loaderData
      ? `Jeni të ftuar në dasmën e ${loaderData.partner_one} dhe ${loaderData.partner_two}. Konfirmoni pjesëmarrjen tuaj.`
      : "Konfirmoni pjesëmarrjen tuaj në dasmë.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: InvitePage,
});

function InvitePage() {
  const inv = Route.useLoaderData();
  const submit = useServerFn(submitRsvp);
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [count, setCount] = useState(1);
  const [countText, setCountText] = useState("1");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<boolean | null>(null);
  const [rsvpId, setRsvpId] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);
  const { k } = useKanaText();
  const { s } = useSynetiText();
  const kana = inv.category === "kanagjegji";
  const syneti = inv.category === "syneti";
  // Dasma ruan tekstet ekzistuese; Kanagjegji dhe Syneti përdorin përkthimet e veta.
  const tx = syneti
    ? s.invite
    : kana
    ? k.invite
    : { rsvpTitle: "A do të jeni me ne?", name: "Emri juaj", yes: "Do të vij", no: "Nuk mund të vij", count: "Sa persona (përfshirë ju)?", note: "Mesazh (opsional)", send: "Dërgo përgjigjen", sending: "Duke dërguar…", thanks: "Faleminderit! Përgjigjja juaj u ruajt — ju presim me shumë gëzim.", sorry: "Faleminderit që na njoftuat. Do të ndiejmë mungesën tuaj.", enterName: "Shkruani emrin tuaj.", chooseAttend: "Zgjidhni nëse do të vini.", memories: "Ndani kujtimet", memoriesDesc: "Bëtë një foto ose video të bukur? Dërgojani çiftit.", upload: "Ngarko foto ose video", footer: "Ftesa u krijua me dashuri nga Ftesa Jonë." };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(tx.enterName);
      return;
    }
    if (attending === null) {
      toast.error(tx.chooseAttend);
      return;
    }
    setBusy(true);
    try {
      const res = await submit({
        data: { invitation_id: inv.id, guest_name: name, attending, guest_count: count, note },
      });
      setDone(attending);
      if (attending && res.rsvpId) setRsvpId(res.rsvpId);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gabim gjatë ruajtjes.");
    } finally {
      setBusy(false);
    }
  }

  if (inv.closed_at) {
    return <ClosedInvitation partnerOne={inv.partner_one} partnerTwo={inv.partner_two} theme={inv.theme} />;
  }

  return (
    <div className={syneti ? "syneti syneti-page syneti-guest guest-invitation" : kana ? "kana kana-page kana-guest guest-invitation" : `theme-${inv.theme} guest-invitation min-h-screen bg-background text-foreground`}>
      {!opened ? (syneti ? <SynetiOpening inv={inv} onOpen={() => setOpened(true)} /> : kana ? <KanaOpening inv={inv} onOpen={() => setOpened(true)} /> : <InvitationOpening inv={inv} onOpen={() => setOpened(true)} />) : (
      <main className="invitation-reveal mx-auto max-w-xl space-y-8 px-4 pb-14 pt-6 sm:px-6">
        <div className="flex justify-center">{syneti ? <SynetiMusic music={inv.music} /> : kana ? <KanaMusic music={inv.music} /> : <InvitationMusic />}</div>
        <InvitationCard inv={inv} showDirections />
        <section className="rsvp-section px-3 py-8 text-card-foreground sm:px-6">
          <Heart className="mx-auto mb-3 h-5 w-5 text-accent" strokeWidth={1} />
          <h2 className="font-display text-center text-4xl">{tx.rsvpTitle}</h2>
          {done !== null ? (
            done && rsvpId ? (
              <RsvpConfirmation inv={inv} rsvpId={rsvpId} onClose={() => setRsvpId(null)} />
            ) : (
              <p className="mt-4 text-muted-foreground">
                {done ? tx.thanks : tx.sorry}
              </p>
            )
          ) : (
            <form onSubmit={onSubmit} className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="n">{tx.name}</Label>
                <Input id="n" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant="outline" aria-pressed={attending === true} className="rsvp-choice min-h-11" onClick={() => setAttending(true)}>
                  {tx.yes}
                </Button>
                <Button type="button" variant="outline" aria-pressed={attending === false} className="rsvp-choice min-h-11" onClick={() => setAttending(false)}>
                  {tx.no}
                </Button>
              </div>
              {attending ? (
                <div className="space-y-2">
                  <Label htmlFor="c">{tx.count}</Label>
                  <Input
                    id="c"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Shkruani numrin"
                    value={countText}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 2);
                      setCountText(v);
                      if (v) setCount(Math.min(20, Math.max(1, Number(v))));
                    }}
                    onBlur={() => { if (!countText) setCountText(String(count)); else setCountText(String(Math.min(20, Math.max(1, Number(countText))))); }}
                  />
                </div>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="note">{tx.note}</Label>
                <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} rows={2} />
              </div>
          <Button type="submit" disabled={busy} className="w-full">
                {busy ? tx.sending : tx.send}
              </Button>
            </form>
          )}
        </section>
        <section className="rsvp-section px-3 py-8 text-center text-card-foreground sm:px-6">
          <Camera className="mx-auto mb-3 h-5 w-5 text-accent" strokeWidth={1} />
          <h2 className="font-display text-3xl">{tx.memories}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {tx.memoriesDesc}
          </p>
          <Button asChild className="mt-4 min-h-11">
            <Link to="/ftesa/$id/foto" params={{ id: inv.id }}>{tx.upload}</Link>
          </Button>
        </section>
        <div className="invitation-support">
          <p>{tx.footer}</p>
        </div>
      </main>
      )}
    </div>
  );
}
