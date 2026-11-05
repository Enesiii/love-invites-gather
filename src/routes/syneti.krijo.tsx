import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LanguageSelector } from "@/components/LanguageSelector";
import { SynetiInvitation } from "@/components/SynetiInvitation";
import { CoverPhotoEditor, checkCoverFile, fileToBase64, type CoverPosition } from "@/components/CoverPhotoEditor";
import { createSynetiInvitation, getSynetiPackages } from "@/lib/syneti.functions";
import { uploadCover } from "@/lib/invitations.functions";
import { createPaymentOrder } from "@/lib/payments.functions";
import { claimInvitation } from "@/lib/account.functions";
import { useSession } from "@/hooks/use-session";
import { SYNETI_DEFAULT_PRICE, SYNETI_MUSIC, isSynetiTemplateSlug, type SynetiMusic } from "@/lib/syneti";
import { useSynetiText } from "@/lib/syneti-i18n";
import { savedMapsHref } from "@/lib/invitation-location";
import { SYNETI_THEMES, type SynetiThemeId } from "@/lib/themes";

type Search = { template?: SynetiThemeId };

export const Route = createFileRoute("/syneti/krijo")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const out: Search = {};
    if (isSynetiTemplateSlug(s["template"])) out.template = s["template"];
    return out;
  },
  loader: async () => {
    try {
      return await getSynetiPackages();
    } catch {
      return null;
    }
  },
  head: () => ({
    meta: [
      { title: "Krijo ftesën e Synetit — Ftesa Jone" },
      { name: "description", content: "Zgjidhni dizajnin, plotësoni detajet dhe krijoni ftesën tuaj të Synetit në pak minuta." },
      { property: "og:title", content: "Krijo ftesën e Synetit" },
      { property: "og:description", content: "Ftesë dixhitale në blu mbretërore për festën e synetit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SynetiCreate,
});

function SynetiCreate() {
  const search = Route.useSearch();
  const pkgs = Route.useLoaderData();
  const { s } = useSynetiText();
  const navigate = useNavigate();
  const create = useServerFn(createSynetiInvitation);
  const createOrder = useServerFn(createPaymentOrder);
  const sendCover = useServerFn(uploadCover);
  const claim = useServerFn(claimInvitation);
  const session = useSession();

  const row = pkgs?.find((r) => r.package === "classic");
  const activeThemes = row?.templates.length ? SYNETI_THEMES.filter((t) => row.templates.includes(t)) : SYNETI_THEMES;
  const [theme, setTheme] = useState<SynetiThemeId>(search.template ?? activeThemes[0] ?? SYNETI_THEMES[0]);
  const price = row?.price ?? SYNETI_DEFAULT_PRICE;
  const [f, setF] = useState({ boy: "", parents: "", event_date: "", event_time: "17:00", venue: "", address: "", maps_url: "", message: "", music: "celebration" as SynetiMusic });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [pos, setPos] = useState<CoverPosition>({ pos_x: 50, pos_y: 50, zoom: 100 });
  const [busy, setBusy] = useState(false);
  const set = (key: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF((p) => ({ ...p, [key]: e.target.value }));

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
    if (!f.boy.trim() || !f.event_date || !f.event_time || !f.venue.trim() || !f.address.trim() || !f.maps_url.trim()) {
      toast.error(s.creator.required);
      return;
    }
    if (!savedMapsHref(f.maps_url)) {
      toast.error(s.creator.mapsInvalid);
      return;
    }
    setBusy(true);
    try {
      const res = await create({ data: { ...f, theme } });
      if (coverFile) {
        try {
          await sendCover({ data: { token: res.token, base64: await fileToBase64(coverFile), ...pos } });
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Foto");
        }
      }
      if (session) {
        try { await claim({ data: { token: res.token } }); } catch { /* paneli e ofron sërish */ }
      }
      const order = await createOrder({ data: { token: res.token } });
      navigate({ to: "/pagesa/$token", params: { token: order.orderToken } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gabim");
    } finally {
      setBusy(false);
    }
  }

  const previewInv = {
    category: "syneti",
    partner_one: f.boy,
    partner_two: "",
    parents: f.parents,
    event_date: f.event_date,
    event_time: f.event_time,
    venue: f.venue,
    address: f.address,
    maps_url: f.maps_url,
    message: f.message,
    music: f.music,
    theme,
    cover_url: coverUrl,
    cover_pos_x: pos.pos_x,
    cover_pos_y: pos.pos_y,
    cover_zoom: pos.zoom,
  };

  return (
    <div className="syneti syneti-page">
      <header className="syneti-nav">
        <Link to="/syneti" className="syneti-brand inline-flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> SYNETI</Link>
        <LanguageSelector />
      </header>
      <main className="mx-auto grid max-w-6xl gap-10 px-5 pb-24 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="syneti-form space-y-8">
          <div>
            <h1 className="syneti-h">{s.creator.title}</h1>
            <p className="syneti-lead mt-2">{s.creator.desc}</p>
          </div>

          <fieldset className="space-y-3">
            <legend className="syneti-eyebrow mb-3">{s.creator.step1}</legend>
            <div className="flex flex-wrap gap-2">
              {activeThemes.map((id) => (
                <Button key={id} type="button" variant="outline" aria-pressed={theme === id} onClick={() => setTheme(id)} className={`syneti-choice bg-transparent ${theme === id ? "text-primary" : ""}`}>
                  {s.templates[id].name}
                </Button>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="syneti-eyebrow mb-3">{s.creator.step2}</legend>
            <div className="space-y-2">
              <Label htmlFor="sb">{s.creator.boy} *</Label>
              <Input id="sb" required value={f.boy} onChange={set("boy")} maxLength={60} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sp">{s.creator.parents}</Label>
              <Input id="sp" value={f.parents} onChange={set("parents")} maxLength={120} placeholder={s.creator.parentsHint} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sd">{s.creator.date} *</Label>
                <Input id="sd" required type="date" min={new Date().toISOString().slice(0, 10)} max="2100-12-31" value={f.event_date} onChange={set("event_date")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="st">{s.creator.time} *</Label>
                <Input id="st" required type="time" value={f.event_time} onChange={set("event_time")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sv">{s.creator.venue} *</Label>
              <Input id="sv" required value={f.venue} onChange={set("venue")} maxLength={120} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sa">{s.creator.address} *</Label>
              <Input id="sa" required value={f.address} onChange={set("address")} maxLength={200} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sm">{s.creator.maps} *</Label>
              <Input id="sm" required type="url" inputMode="url" value={f.maps_url} onChange={set("maps_url")} maxLength={500} placeholder="https://maps.app.goo.gl/…" />
              <p className="text-xs text-muted-foreground">{s.creator.mapsHint}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="smsg">{s.creator.message}</Label>
              <Textarea id="smsg" placeholder={f.boy.trim() ? s.invite.title(f.boy.trim()) : undefined} value={f.message} onChange={set("message")} maxLength={500} rows={3} />
              <p className="text-xs text-muted-foreground">{s.creator.messageHint}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="smu">{s.creator.music}</Label>
              <select id="smu" value={f.music} onChange={set("music")} className="h-10 w-full rounded-md border px-3 text-sm">
                {SYNETI_MUSIC.map((m) => <option key={m} value={m}>{s.creator.musicOptions[m]}</option>)}
              </select>
            </div>
            <div className="syneti-panel space-y-2 p-4">
              <Label>{s.creator.photo}</Label>
              <CoverPhotoEditor
                url={coverUrl}
                pos={pos}
                onPos={setPos}
                onFile={onCoverFile}
                error={coverError}
                onRemove={() => { if (coverUrl) URL.revokeObjectURL(coverUrl); setCoverUrl(null); setCoverFile(null); }}
              />
              <p className="text-xs text-muted-foreground">{s.creator.photoHint}</p>
            </div>
          </fieldset>

          <section className="syneti-panel space-y-3 p-5" aria-labelledby="ssum">
            <h2 id="ssum" className="syneti-eyebrow">{s.creator.step3}</h2>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
              <dt className="text-muted-foreground">{s.creator.template}</dt>
              <dd>{s.templates[theme].name}</dd>
              <dt className="text-muted-foreground">{s.creator.total}</dt>
              <dd className="font-display text-2xl text-primary" data-testid="syneti-total">€{price}</dd>
            </dl>
            <p className="text-xs text-muted-foreground">{s.creator.payNote}</p>
            <Button type="submit" size="lg" disabled={busy} className="syneti-gold-btn min-h-12 w-full">{busy ? s.creator.busy : s.creator.submit}</Button>
          </section>
        </form>
        <div className="lg:sticky lg:top-8 lg:self-start">
          <p className="syneti-eyebrow mb-3">{s.creator.preview}</p>
          <SynetiInvitation inv={previewInv} showDirections={false} />
        </div>
      </main>
    </div>
  );
}
