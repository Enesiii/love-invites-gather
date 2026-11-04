import { PREMIUM_THEMES, THEME_LABELS, KANAGJEGJI_THEMES, type ThemeId } from "@/lib/themes";
import { KANAGJEGJI_MUSIC, kanaPackageOf, kanaThemesFor } from "@/lib/kanagjegji";
import { useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateInvitation } from "@/lib/invitations.functions";

type Inv = {
  partner_one: string;
  partner_two: string;
  event_date: string;
  event_time: string;
  venue: string;
  address: string | null;
  message: string | null;
  theme: string;
  category?: string;
  parents?: string | null;
  music?: string | null;
};

const KANA_MUSIC_LABELS: Record<(typeof KANAGJEGJI_MUSIC)[number], string> = {
  henna: "Melodi e kanagjegjit",
  romantic: "Romantike",
  waltz: "Vals i qetë",
  none: "Pa muzikë",
};

export function EditEventDialog({
  token,
  inv,
  onSaved,
  trigger,
}: {
  token: string;
  inv: Inv;
  onSaved: () => void;
  trigger: ReactNode;
}) {
  const save = useServerFn(updateInvitation);
  const isKana = inv.category === "kanagjegji";
  const kanaOptions = isKana ? kanaThemesFor(kanaPackageOf(inv.theme)) : [];
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({
    ...inv,
    address: inv.address ?? "",
    message: inv.message ?? "",
    parents: inv.parents ?? "",
    music: inv.music ?? "henna",
  });
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) =>
    setF((p) => ({ ...p, [k]: e.target.value }));
  const field = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.partner_one.trim() || (!isKana && !f.partner_two.trim()) || !f.venue.trim() || !f.event_date) {
      toast.error("Plotësoni emrat, datën dhe vendin.");
      return;
    }
    setBusy(true);
    try {
      await save({
        data: {
          ...f,
          token,
          theme: f.theme as ThemeId,
          ...(isKana ? { parents: f.parents, music: f.music } : {}),
        },
      });
      toast.success("Ngjarja u përditësua.");
      setOpen(false);
      onSaved();
    } catch {
      toast.error("Nuk u ruajt. Provoni përsëri.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ndrysho ngjarjen</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">
              {isKana ? "Nusja" : "Emri 1"}
              <input className={field} value={f.partner_one} onChange={set("partner_one")} />
            </label>
            {!isKana && (
              <label className="text-sm">
                Emri 2
                <input className={field} value={f.partner_two} onChange={set("partner_two")} />
              </label>
            )}
            <label className="text-sm">
              Data
              <input type="date" min={new Date().toISOString().slice(0, 10)} max="2100-12-31" className={field} value={f.event_date} onChange={set("event_date")} />
            </label>
            <label className="text-sm">
              Ora
              <input type="time" className={field} value={f.event_time} onChange={set("event_time")} />
            </label>
            {isKana && (
              <label className="text-sm">
                Familja (opsionale)
                <input className={field} value={f.parents} onChange={set("parents")} maxLength={120} />
              </label>
            )}
          </div>
          <label className="block text-sm">
            Salla
            <input className={field} value={f.venue} onChange={set("venue")} />
          </label>
          <label className="block text-sm">
            Adresa
            <input className={field} value={f.address} onChange={set("address")} />
          </label>
          <label className="block text-sm">
            Mesazhi
            <textarea rows={3} className={field} value={f.message} onChange={set("message")} />
          </label>
          {isKana && (
            <label className="block text-sm">
              Muzika në sfond
              <select className={field} value={f.music} onChange={set("music")}>
                {KANAGJEGJI_MUSIC.map((m) => (
                  <option key={m} value={m}>{KANA_MUSIC_LABELS[m]}</option>
                ))}
              </select>
            </label>
          )}
          <label className="block text-sm">
            Stili
            <select className={field} value={f.theme} onChange={set("theme")}>
              {isKana
                ? kanaOptions.map((id) => (
                    <option key={id} value={id}>{THEME_LABELS[id]}</option>
                  ))
                : (
                  <>
                    <option value="rose">Rose</option>
                    <option value="sage">Sage</option>
                    <option value="night">Night</option>
                    <option value="gold">Ar</option>
                    <option value="ivory">Fildiş</option>
                    <option value="blush">Rozë</option>
                    <option value="arch">Harku i luleve</option>
                    {PREMIUM_THEMES.map((id) => (
                      <option key={id} value={id}>{THEME_LABELS[id]} (Premium)</option>
                    ))}
                  </>
                )}
            </select>
          </label>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Duke ruajtur…" : "Ruaj ndryshimet"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Referencë që KANAGJEGJI_THEMES të mbetet e eksportuar përmes modulit të temave.
void KANAGJEGJI_THEMES;
