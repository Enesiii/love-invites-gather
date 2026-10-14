import { createFileRoute, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InvitationCard } from "@/components/InvitationCard";
import { SupportButton } from "@/components/SupportButton";
import { InvitationMusic, InvitationOpening } from "@/components/InvitationOpening";
import { Heart } from "lucide-react";
import { getInvitation, submitRsvp } from "@/lib/invitations.functions";

export const Route = createFileRoute("/ftesa/$id")({
  loader: async ({ params }) => {
    const inv = await getInvitation({ data: { id: params.id } });
    if (!inv) throw notFound();
    return inv;
  },
  head: ({ loaderData }) => {
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
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<boolean | null>(null);
  const [opened, setOpened] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Shkruani emrin tuaj.");
      return;
    }
    if (attending === null) {
      toast.error("Zgjidhni nëse do të vini.");
      return;
    }
    setBusy(true);
    try {
      await submit({
        data: { invitation_id: inv.id, guest_name: name, attending, guest_count: count, note },
      });
      setDone(attending);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gabim gjatë ruajtjes.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`theme-${inv.theme} guest-invitation min-h-screen bg-background text-foreground`}>
      {!opened ? <InvitationOpening inv={inv} onOpen={() => setOpened(true)} /> : (
      <main className="invitation-reveal mx-auto max-w-xl space-y-8 px-4 pb-14 pt-6 sm:px-6">
        <div className="flex justify-center"><InvitationMusic /></div>
        <InvitationCard inv={inv} showDirections />
        <section className="rsvp-section px-3 py-8 text-card-foreground sm:px-6">
          <Heart className="mx-auto mb-3 h-5 w-5 text-accent" strokeWidth={1} />
          <h2 className="font-display text-center text-4xl">A do të jeni me ne?</h2>
          {done !== null ? (
            <p className="mt-4 text-muted-foreground">
              {done
                ? "Faleminderit! Përgjigjja juaj u ruajt — ju presim me shumë gëzim."
                : "Faleminderit që na njoftuat. Do të ndiejmë mungesën tuaj."}
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="n">Emri juaj</Label>
                <Input id="n" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant={attending === true ? "default" : "outline"} onClick={() => setAttending(true)}>
                  Do të vij
                </Button>
                <Button type="button" variant={attending === false ? "default" : "outline"} onClick={() => setAttending(false)}>
                  Nuk mund të vij
                </Button>
              </div>
              {attending ? (
                <div className="space-y-2">
                  <Label htmlFor="c">Sa persona (përfshirë ju)?</Label>
                  <Input
                    id="c"
                    type="number"
                    min={1}
                    max={10}
                    value={count}
                    onChange={(e) => setCount(Math.min(10, Math.max(1, Number(e.target.value) || 1)))}
                  />
                </div>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="note">Mesazh (opsional)</Label>
                <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} rows={2} />
              </div>
          <Button type="submit" disabled={busy} className="w-full">
                {busy ? "Duke dërguar…" : "Dërgo përgjigjen"}
              </Button>
            </form>
          )}
        </section>
        <div className="invitation-support">
          <p>Ftesa u krijua me dashuri nga Ftesa Dasme.</p>
          <SupportButton variant="ghost" className="support-control" />
        </div>
      </main>
      )}
    </div>
  );
}
