import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LanguageSelector } from "@/components/LanguageSelector";
import { KanagjegjiInvitation } from "@/components/KanagjegjiInvitation";
import { CoverPhotoEditor, checkCoverFile, fileToBase64, type CoverPosition } from "@/components/CoverPhotoEditor";
import { createKanagjegjiInvitation, getKanaPackages } from "@/lib/kanagjegji.functions";
import { uploadCover } from "@/lib/invitations.functions";
import { createPaymentOrder } from "@/lib/payments.functions";
import { claimInvitation } from "@/lib/account.functions";
import { useSession } from "@/hooks/use-session";
import { KANAGJEGJI_DEFAULT_PRICES, KANAGJEGJI_MUSIC, isKanaTemplateSlug, kanaPackageOf, kanaThemesFor, type KanagjegjiMusic } from "@/lib/kanagjegji";
import { useKanaText } from "@/lib/kanagjegji-i18n";
import { savedMapsHref } from "@/lib/invitation-location";
import type { KanagjegjiThemeId } from "@/lib/themes";

type Search = { template?: KanagjegjiThemeId; package?: "classic" | "premium" };

export const Route = createFileRoute("/kanagjegji/krijo")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const out: Search = {};
    if (isKanaTemplateSlug(s["template"])) out.template = s["template"];
    if (s["package"] === "classic" || s["package"] === "premium") out.package = s["package"];
    return out;
  },
  loader: async () => {
    try {
      return await getKanaPackages();
    } catch {
      return null;
    }
  },
  head: () => ({
    meta: [
      { title: "Krijo ftesën e Kanagjegjit — Ftesa Jone" },
      { name: "description", content: "Zgjidhni paketën dhe dizajnin, plotësoni detajet dhe krijoni ftesën tuaj të Kanagjegjit në pak minuta." },
      { property: "og:title", content: "Krijo ftesën e Kanagjegjit" },
      { property: "og:description", content: "Ftesë dixhitale në të kuqe dhe ar për natën e kanagjegjit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: KanaCreate,
});

function KanaCreate() {
  const search = Route.useSearch();
  const pkgs = Route.useLoaderData();
  const { k } = useKanaText();
  const navigate = useNavigate();
  const create = useServerFn(createKanagjegjiInvitation);
  const createOrder = useServerFn(createPaymentOrder);
  const sendCover = useServerFn(uploadCover);
  const claim = useServerFn(claimInvitation);
  const session = useSession();

  const initialPkg = search.template ? kanaPackageOf(search.template) : search.package ?? "classic";
  const [pkg, setPkg] = useState<"classic" | "premium">(initialPkg);
  const activeThemes = (p: "classic" | "premium") => {
    const row = pkgs?.find((r) => r.package === p);
    const list = kanaThemesFor(p);
    return row?.templates.length ? list.filter((t) => row.templates.includes(t)) : list;
  };
  const [theme, setTheme] = useState<KanagjegjiThemeId>(search.template ?? activeThemes(initialPkg)[0] ?? kanaThemesFor(initialPkg)[0]!);
  const price = pkgs?.find((r) => r.package === pkg)?.price ?? KANAGJEGJI_DEFAULT_PRICES[pkg];
  const [f, setF] = useState({ bride: "", parents: "", event_date: "", event_time: "19:00", venue: "", address: "", maps_url: "", message: k.invite.title, music: "henna" as KanagjegjiMusic });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [pos, setPos] = useState<CoverPosition>({ pos_x: 50, pos_y: 50, zoom: 100 });
  const [busy, setBusy] = useState(false);
  const set = (key: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF((p) => ({ ...p, [key]: e.target.value }));

  function choosePkg(p: "classic" | "premium") {
    setPkg(p);
    setTheme(activeThemes(p)[0] ?? kanaThemesFor(p)[0]!);
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
    if (!f.bride.trim() || !f.event_date || !f.event_time || !f.venue.trim() || !f.address.trim() || !f.maps_url.trim()) {
      toast.error(k.creator.required);
      return;
    }
    if (!savedMapsHref(f.maps_url)) {
      toast.error(k.creator.mapsInvalid);
      return;
    }
    setBusy(true);
    try {
      const res = await create({ data: { ...f, theme } });
      if (pkg === "premium" && coverFile) {
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
    category: "kanagjegji",
    partner_one: f.bride,
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
    cover_url: pkg === "premium" ? coverUrl : null,
    cover_pos_x: pos.pos_x,
    cover_pos_y: pos.pos_y,
    cover_zoom: pos.zoom,
    photoPlaceholder: pkg === "premium",
  };

  return (
    <div className="kana kana-page">
      <header className="kana-nav">
        <Link to="/kanagjegji" className="kana-brand inline-flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> KANAGJEGJI</Link>
        <LanguageSelector />
      </header>
      <main className="mx-auto grid max-w-6xl gap-10 px-5 pb-24 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="kana-form space-y-8">
          <div>
            <h1 className="kana-h">{k.creator.title}</h1>
            <p className="kana-lead mt-2">{k.creator.desc}</p>
          </div>

          <fieldset className="space-y-3">
            <legend className="kana-eyebrow mb-3">{k.creator.step1}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["classic", "premium"] as const).map((p) => (
                <button key={p} type="button" onClick={() => choosePkg(p)} aria-pressed={pkg === p} className="kana-panel kana-choice p-4 text-left">
                  <span className="font-display flex items-center gap-2 text-lg">{p === "premium" ? <Crown className="h-4 w-4 text-primary" /> : null}{p === "premium" ? k.packages.premium : k.packages.classic}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{p === "premium" ? k.packages.withPhoto : k.packages.noPhoto}</span>
                  <span className="kana-bride mt-1 block text-4xl">€{pkgs?.find((r) => r.package === p)?.price ?? KANAGJEGJI_DEFAULT_PRICES[p]}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="kana-eyebrow mb-3">{k.creator.step2}</legend>
            <div className="flex flex-wrap gap-2">
              {activeThemes(pkg).map((id) => (
                <Button key={id} type="button" variant="outline" aria-pressed={theme === id} onClick={() => setTheme(id)} className={`kana-choice bg-transparent ${theme === id ? "text-primary" : ""}`}>
                  {k.templates[id].name}
                </Button>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="kana-eyebrow mb-3">{k.creator.step3}</legend>
            <div className="space-y-2">
              <Label htmlFor="kb">{k.creator.bride} *</Label>
              <Input id="kb" required value={f.bride} onChange={set("bride")} maxLength={60} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kp">{k.creator.parents}</Label>
              <Input id="kp" value={f.parents} onChange={set("parents")} maxLength={120} placeholder={k.creator.parentsHint} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="kd">{k.creator.date} *</Label>
                <Input id="kd" required type="date" min={new Date().toISOString().slice(0, 10)} max="2100-12-31" value={f.event_date} onChange={set("event_date")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kt">{k.creator.time} *</Label>
                <Input id="kt" required type="time" value={f.event_time} onChange={set("event_time")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="kv">{k.creator.venue} *</Label>
              <Input id="kv" required value={f.venue} onChange={set("venue")} maxLength={120} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ka">{k.creator.address} *</Label>
              <Input id="ka" required value={f.address} onChange={set("address")} maxLength={200} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="km">{k.creator.maps} *</Label>
              <Input id="km" required type="url" inputMode="url" value={f.maps_url} onChange={set("maps_url")} maxLength={500} placeholder="https://maps.app.goo.gl/…" />
              <p className="text-xs text-muted-foreground">{k.creator.mapsHint}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="kmsg">{k.creator.message}</Label>
              <Textarea id="kmsg" value={f.message} onChange={set("message")} maxLength={500} rows={3} />
              <p className="text-xs text-muted-foreground">{k.creator.messageHint}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="kmu">{k.creator.music}</Label>
              <select id="kmu" value={f.music} onChange={set("music")} className="h-10 w-full rounded-md border px-3 text-sm">
                {KANAGJEGJI_MUSIC.map((m) => <option key={m} value={m}>{k.creator.musicOptions[m]}</option>)}
              </select>
            </div>
            {pkg === "premium" ? (
              <div className="kana-panel space-y-2 p-4">
                <Label>{k.creator.photo}</Label>
                <CoverPhotoEditor
                  url={coverUrl}
                  pos={pos}
                  onPos={setPos}
                  onFile={onCoverFile}
                  error={coverError}
                  onRemove={() => { if (coverUrl) URL.revokeObjectURL(coverUrl); setCoverUrl(null); setCoverFile(null); }}
                />
                <p className="text-xs text-muted-foreground">{k.creator.photoHint}</p>
              </div>
            ) : null}
          </fieldset>

          <section className="kana-panel space-y-3 p-5" aria-labelledby="ksum">
            <h2 id="ksum" className="kana-eyebrow">{k.creator.step4}</h2>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
              <dt className="text-muted-foreground">{k.creator.package}</dt>
              <dd>{pkg === "premium" ? k.packages.premium : k.packages.classic}</dd>
              <dt className="text-muted-foreground">{k.creator.template}</dt>
              <dd>{k.templates[theme].name}</dd>
              <dt className="text-muted-foreground">{k.creator.total}</dt>
              <dd className="font-display text-2xl text-primary" data-testid="kana-total">€{price}</dd>
            </dl>
            <p className="text-xs text-muted-foreground">{k.creator.payNote}</p>
            <Button type="submit" size="lg" disabled={busy} className="kana-gold-btn min-h-12 w-full">{busy ? k.creator.busy : k.creator.submit}</Button>
          </section>
        </form>
        <div className="lg:sticky lg:top-8 lg:self-start">
          <p className="kana-eyebrow mb-3">{k.creator.preview}</p>
          <KanagjegjiInvitation inv={previewInv} showDirections={false} />
        </div>
      </main>
    </div>
  );
}
