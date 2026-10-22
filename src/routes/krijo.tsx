import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AiWriter } from "@/components/AiWriter";
import { Textarea } from "@/components/ui/textarea";
import { InvitationCard } from "@/components/InvitationCard";
import { createInvitation } from "@/lib/invitations.functions";
import { claimInvitation } from "@/lib/account.functions";
import { useSession } from "@/hooks/use-session";
import { uploadCover } from "@/lib/invitations.functions";
import { CLASSIC_THEMES, PREMIUM_THEMES, THEME_LABELS, isPremiumTheme, isThemeId, type ThemeId } from "@/lib/themes";
import { CoverPhotoEditor, checkCoverFile, fileToBase64, type CoverPosition } from "@/components/CoverPhotoEditor";
import { PRICING } from "@/lib/site-config";
import { Crown } from "lucide-react";

export const Route = createFileRoute("/krijo")({
  validateSearch: (search: Record<string, unknown>): { theme?: string } => {
    const theme = search["theme"];
    return isThemeId(theme) ? { theme } : {};
  },
  head: () => ({
    meta: [
      { title: "Krijo ftesën e dasmës — Ftesa Dasme" },
      {
        name: "description",
        content: "Plotësoni emrat, datën dhe vendin dhe krijoni ftesën tuaj të dasmës.",
      },
      { property: "og:title", content: "Krijo ftesën e dasmës" },
      { property: "og:description", content: "Krijoni ftesën tuaj online në pak minuta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Create,
});

const classicThemes = CLASSIC_THEMES.map((id) => ({ id, label: THEME_LABELS[id] }));
const premiumThemes = PREMIUM_THEMES.map((id) => ({ id, label: THEME_LABELS[id] }));

function Create() {
  const { theme } = Route.useSearch();
  const navigate = useNavigate();
  const create = useServerFn(createInvitation);
  const claim = useServerFn(claimInvitation);
  const session = useSession();
  const sendCover = useServerFn(uploadCover);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [pos, setPos] = useState<CoverPosition>({ pos_x: 50, pos_y: 50, zoom: 100 });
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({
    partner_one: "",
    partner_two: "",
    event_date: "",
    event_time: "17:00",
    venue: "",
    address: "",
    message: "",
    theme: (theme ?? "rose") as ThemeId,
  });
  const set =
    (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setF((p) => ({ ...p, [k]: e.target.value }));

  const isPremium = isPremiumTheme(f.theme);
  const premiumPrice = PRICING.packages.find((p) => p.id === "premium")?.price;
  function pickTheme(id: ThemeId) {
    setF((p) => ({ ...p, theme: id }));
  }
  function onCoverFile(file: File) {
    const err = checkCoverFile(file);
    if (err) return setCoverError(err);
    setCoverError(null);
    if (coverUrl) URL.revokeObjectURL(coverUrl);
    setCoverFile(file);
    setCoverUrl(URL.createObjectURL(file));
    setPos({ pos_x: 50, pos_y: 50, zoom: 100 });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.partner_one.trim() || !f.partner_two.trim() || !f.event_date || !f.venue.trim()) {
      toast.error("Plotësoni emrat, datën dhe vendin.");
      return;
    }
    setBusy(true);
    try {
      const res = await create({ data: f });
      if (isPremium && coverFile) {
        try {
          await sendCover({ data: { token: res.token, base64: await fileToBase64(coverFile), ...pos } });
        } catch (err) {
          toast.error(
            `Ftesa u ruajt, por fotoja jo: ${err instanceof Error ? err.message : "gabim"}. Mund ta ngarkoni nga paneli.`,
          );
        }
      }
      if (session) {
        try {
          await claim({ data: { token: res.token } });
        } catch {
          /* the panel offers saving again */
        }
      }
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
              <Input id="d" type="date" min={new Date().toISOString().slice(0, 10)} max="2100-12-31" value={f.event_date} onChange={set("event_date")} />
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
            <Textarea id="m" value={f.message} onChange={set("message")} maxLength={500} rows={4} />
            <AiWriter
              details={{ partner_one: f.partner_one, partner_two: f.partner_two, event_date: f.event_date, event_time: f.event_time, venue: f.venue }}
              onText={(text) => setF((p) => ({ ...p, message: text }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Stili klasik</Label>
            <div className="flex flex-wrap gap-2">
              {classicThemes.map((t) => (
                <Button key={t.id} type="button" variant={f.theme === t.id ? "default" : "outline"} onClick={() => pickTheme(t.id)} aria-pressed={f.theme === t.id}>
                  {t.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-primary" /> Koleksioni Premium · me foton tuaj · {PRICING.currency}{premiumPrice} për ftesë
            </Label>
            <div className="flex flex-wrap gap-2">
              {premiumThemes.map((t) => (
                <Button key={t.id} type="button" variant={f.theme === t.id ? "default" : "outline"} onClick={() => pickTheme(t.id)} aria-pressed={f.theme === t.id}>
                  {t.label}
                </Button>
              ))}
            </div>
          </div>
          {isPremium ? (
            <div className="space-y-2 rounded-xl border border-border bg-card p-4">
              <Label>Fotoja e çiftit</Label>
              <CoverPhotoEditor
                url={coverUrl}
                pos={pos}
                onPos={setPos}
                onFile={onCoverFile}
                error={coverError}
                onRemove={() => {
                  if (coverUrl) URL.revokeObjectURL(coverUrl);
                  setCoverUrl(null);
                  setCoverFile(null);
                }}
              />
              <p className="text-xs text-muted-foreground">
                Fotoja ruhet kur krijoni ftesën. Pas ruajtjes, nga paneli mund ta ndërroni dhe të vazhdoni me porosinë ({PRICING.currency}{premiumPrice}). Pagesa online nuk është ende aktive.
              </p>
            </div>
          ) : null}
          <Button type="submit" size="lg" disabled={busy}>
            {busy ? (isPremium && coverFile ? "Duke ruajtur ftesën dhe foton…" : "Duke krijuar…") : isPremium ? "Ruaj ftesën dhe vazhdo" : "Krijo ftesën"}
          </Button>
        </form>
        <div className="lg:sticky lg:top-8 lg:self-start">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Pamje paraprake
          </p>
          <InvitationCard inv={{ ...f, cover_url: coverUrl, cover_pos_x: pos.pos_x, cover_pos_y: pos.pos_y, cover_zoom: pos.zoom, photoPlaceholder: true }} />
        </div>
      </main>
    </div>
  );
}
