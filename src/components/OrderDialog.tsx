import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitOrderRequest } from "@/lib/orders.functions";

type Style = "rose" | "sage" | "night";

const empty = {
  partner_one: "",
  partner_two: "",
  wedding_date: "",
  contact_phone: "",
  contact_email: "",
  notes: "",
};

export function OrderDialog({ style, styleName }: { style: Style; styleName: string }) {
  const submit = useServerFn(submitOrderRequest);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [f, setF] = useState(empty);
  const set =
    (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setF((p) => ({ ...p, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.partner_one.trim() || !f.partner_two.trim() || !f.wedding_date || !f.contact_phone.trim()) {
      toast.error("Plotësoni emrat, datën e dasmës dhe numrin e telefonit.");
      return;
    }
    setBusy(true);
    try {
      await submit({ data: { ...f, style } });
      setDone(true);
      setF(empty);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Porosia nuk u dërgua.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setDone(false);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          Porosit <ShoppingBag className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {done ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-primary" strokeWidth={1.2} />
            <DialogTitle className="font-display text-3xl">Faleminderit!</DialogTitle>
            <DialogDescription className="mt-3">
              E morëm kërkesën tuaj për stilin “{styleName}”. Do t’ju kontaktojmë në numrin e
              dhënë për ta përfunduar ftesën.
            </DialogDescription>
            <Button className="mt-6" onClick={() => setOpen(false)}>
              Mbyll
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-3xl">Porosit këtë stil</DialogTitle>
              <DialogDescription>
                Stili: {styleName}. Na lini detajet dhe do t’ju kontaktojmë.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="o-p1">Emri i parë</Label>
                  <Input id="o-p1" value={f.partner_one} onChange={set("partner_one")} maxLength={60} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="o-p2">Emri i dytë</Label>
                  <Input id="o-p2" value={f.partner_two} onChange={set("partner_two")} maxLength={60} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="o-date">Data e dasmës</Label>
                <Input id="o-date" type="date" value={f.wedding_date} onChange={set("wedding_date")} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="o-phone">Telefoni / WhatsApp</Label>
                  <Input
                    id="o-phone"
                    type="tel"
                    inputMode="tel"
                    placeholder="+383 4X XXX XXX"
                    value={f.contact_phone}
                    onChange={set("contact_phone")}
                    maxLength={30}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="o-email">Email (opsional)</Label>
                  <Input
                    id="o-email"
                    type="email"
                    value={f.contact_email}
                    onChange={set("contact_email")}
                    maxLength={255}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="o-notes">Kërkesa të veçanta (opsionale)</Label>
                <Textarea id="o-notes" rows={3} value={f.notes} onChange={set("notes")} maxLength={500} />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={busy}>
                {busy ? "Duke dërguar…" : "Dërgo porosinë"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
