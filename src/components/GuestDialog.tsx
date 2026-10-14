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
import { saveGuest } from "@/lib/invitations.functions";

type Guest = {
  id: string;
  guest_name: string;
  attending: boolean;
  guest_count: number;
  note: string | null;
};

export function GuestDialog({
  token,
  guest,
  onSaved,
  trigger,
}: {
  token: string;
  guest?: Guest;
  onSaved: () => void;
  trigger: ReactNode;
}) {
  const save = useServerFn(saveGuest);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(guest?.guest_name ?? "");
  const [attending, setAttending] = useState(guest?.attending ?? true);
  const [count, setCount] = useState(guest && guest.guest_count > 0 ? guest.guest_count : 1);
  const [note, setNote] = useState(guest?.note ?? "");
  const [busy, setBusy] = useState(false);
  const field = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Shkruani emrin.");
      return;
    }
    setBusy(true);
    try {
      await save({
        data: {
          token,
          ...(guest ? { id: guest.id } : {}),
          guest_name: name,
          attending,
          guest_count: count,
          note,
        },
      });
      toast.success(guest ? "Mysafiri u përditësua." : "Mysafiri u shtua.");
      setOpen(false);
      if (!guest) {
        setName("");
        setNote("");
        setCount(1);
        setAttending(true);
      }
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{guest ? "Modifiko mysafirin" : "Shto mysafir"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm">
            Emri
            <input
              className={`${field} mt-1`}
              value={name}
              maxLength={80}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <div className="flex gap-2">
            {[true, false].map((v) => (
              <button
                type="button"
                key={String(v)}
                onClick={() => setAttending(v)}
                className={`min-h-10 flex-1 rounded-md border text-sm ${attending === v ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
              >
                {v ? "Vjen" : "Nuk vjen"}
              </button>
            ))}
          </div>
          {attending && (
            <label className="block text-sm">
              Numri i personave
              <input
                type="number"
                min={1}
                max={20}
                className={`${field} mt-1`}
                value={count}
                onChange={(e) => setCount(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
              />
            </label>
          )}
          <label className="block text-sm">
            Shënim (opsional)
            <textarea
              className={`${field} mt-1`}
              rows={2}
              maxLength={300}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Duke ruajtur…" : "Ruaj"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
