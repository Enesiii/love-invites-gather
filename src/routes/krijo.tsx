import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InvitationCard } from "@/components/InvitationCard";
import { createInvitation } from "@/lib/invitations.functions";

export const Route = createFileRoute("/krijo")({
  validateSearch: (search: Record<string, unknown>): { theme?: string } => ({ theme: typeof search['theme'] === 'string' && ['rose', 'sage', 'night'].includes(search['theme']) ? search['theme'] : undefined }),
  head: () => ({
    meta: [
      { title: "Krijo ftesën e dasmës — Ftesa Dasme" },
      { name: "description", content: "Plotësoni emrat, datën dhe vendin dhe krijoni ftesën tuaj të dasmës." },
      { property: "og:title", content: "Krijo ftesën e dasmës" },
      { property: "og:description", content: "Krijoni ftesën tuaj online në pak minuta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Create,
});

const themes = [
  { id: "rose", label: "Trëndafil" },
  { id: "sage", label: "Sherbelë" },
  { id: "night", label: "Natë" },
];

function Create() {
  const { theme } = Route.useSearch();
  const navigate = useNavigate();
  const create = useServerFn(createInvitation);
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({
    partner_one: "",
    partner_two: "",
    event_date: "",
    event_time: "17:00",
    venue: "",
    address: "",
    message: "",
    theme: theme ?? "rose",
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.partner_one.trim() || !f.partner_two.trim() || !f.event_date || !f.venue.trim()) {
      toast.error("Plotësoni emrat, datën dhe vendin.");
      return;
    }
    setBusy(true);
    try {
      const res = await create({ data: f });
      navigate({ to: "/menaxho/$token", params: { token: res.token } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gabim gjatë ruajtjes.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="font-display text-2xl text-primary">
          Ftesa Dasme
        </Link>
      </header>
      <main className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-5">
          <h1 className="font-display text-4xl">Krijo ftesën</h1>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="p1">Emri i parë</Label>
              <Input id="p1" value={f.partner_one} onChange={set("partner_one")} maxLength={60} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p2">Emri i dytë</Label>
              <Input id="p2" value={f.partner_two} onChange={set("partner_two")} maxLength={60} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="d">Data</Label>
              <Input id="d" type="date" value={f.event_date} onChange={set("event_date")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="t">Ora</Label>
              <Input id="t" type="time" value={f.event_time} onChange={set("event_time")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="v">Vendi</Label>
            <Input id="v" value={f.venue} onChange={set("venue")} maxLength={120} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="a">Adresa (opsionale)</Label>
            <Input id="a" value={f.address} onChange={set("address")} maxLength={200} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="m">Mesazh (opsional)</Label>
            <Textarea id="m" value={f.message} onChange={set("message")} maxLength={500} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Stili</Label>
            <div className="flex gap-2">
              {themes.map((t) => (
                <Button
                  key={t.id}
                  type="button"
                  variant={f.theme === t.id ? "default" : "outline"}
                  onClick={() => setF((p) => ({ ...p, theme: t.id }))}
                >
                  {t.label}
                </Button>
              ))}
            </div>
          </div>
          <Button type="submit" size="lg" disabled={busy}>
            {busy ? "Duke krijuar…" : "Krijo ftesën"}
          </Button>
        </form>
        <div className="lg:sticky lg:top-8 lg:self-start">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Pamje paraprake</p>
          <InvitationCard inv={f} />
        </div>
      </main>
    </div>
  );
}
