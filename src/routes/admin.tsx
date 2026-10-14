import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { listOrderRequests, updateOrderStatus } from "@/lib/orders.functions";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/order-validation";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administrimi i porosive — Ftesa Dasme" },
      { name: "description", content: "Shikoni dhe përditësoni kërkesat e porosive." },
      { property: "og:title", content: "Administrimi i porosive — Ftesa Dasme" },
      { property: "og:description", content: "Paneli privat i kërkesave të porosive." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Order = Awaited<ReturnType<typeof listOrderRequests>>[number];
type Status = (typeof ORDER_STATUSES)[number];

function AdminPage() {
  const list = useServerFn(listOrderRequests);
  const update = useServerFn(updateOrderStatus);
  const [key, setKey] = useState("");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<Status | "all">("all");

  async function load(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true);
    try {
      setOrders(await list({ data: { key } }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gabim.");
    } finally {
      setBusy(false);
    }
  }

  async function change(id: string, status: Status) {
    try {
      await update({ data: { key, id, status } });
      setOrders((o) => o?.map((r) => (r.id === id ? { ...r, status } : r)) ?? null);
      toast.success("Statusi u përditësua.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gabim.");
    }
  }

  const shown = orders?.filter((o) => filter === "all" || o.status === filter) ?? [];

  function exportCsv() {
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const header = ["E dërguar", "Partneri 1", "Partneri 2", "Dasma", "Stili", "Telefoni", "Emaili", "Shënime", "Statusi"];
    const rows = shown.map((o) =>
      [
        new Date(o.created_at).toLocaleString("sq"),
        o.partner_one,
        o.partner_two,
        o.wedding_date,
        o.style,
        o.contact_phone,
        o.contact_email ?? "",
        o.notes ?? "",
        ORDER_STATUS_LABELS[o.status],
      ]
        .map((v) => esc(String(v)))
        .join(","),
    );
    const csv = "\uFEFF" + [header.map(esc).join(","), ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `porosite-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
    toast.success(`${shown.length} kërkesa u eksportuan.`);
  }


  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10">
      <Link to="/" className="text-sm text-muted-foreground">← Kthehu</Link>
      <h1 className="mt-4 font-display text-4xl">Kërkesat e porosive</h1>
      {!orders ? (
        <form onSubmit={load} className="mt-8 max-w-sm space-y-3">
          <Label htmlFor="admin-key">Kodi i administrimit</Label>
          <Input id="admin-key" type="password" value={key} onChange={(e) => setKey(e.target.value)} />
          <Button type="submit" disabled={busy || !key}>{busy ? "Duke hyrë…" : "Hyr"}</Button>
        </form>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap gap-2">
            {(["all", ...ORDER_STATUSES] as const).map((s) => (
              <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)}>
                {s === "all" ? "Të gjitha" : ORDER_STATUS_LABELS[s]} (
                {s === "all" ? orders.length : orders.filter((o) => o.status === s).length})
              </Button>
            ))}
            <Button size="sm" variant="ghost" onClick={() => load()}>Rifresko</Button>
            <Button size="sm" variant="ghost" onClick={exportCsv} disabled={shown.length === 0}>Eksporto CSV</Button>

          </div>
          <div className="mt-6 space-y-3">
            {shown.length === 0 && <p className="text-muted-foreground">Nuk ka kërkesa.</p>}
            {shown.map((o) => (
              <article key={o.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl">{o.partner_one} & {o.partner_two}</h2>
                    <p className="text-sm text-muted-foreground">
                      Dasma: {o.wedding_date} · Stili: {o.style} · Dërguar: {new Date(o.created_at).toLocaleString("sq")}
                    </p>
                    <p className="mt-2 text-sm">
                      <a className="underline" href={`tel:${o.contact_phone.replace(/\s/g, "")}`}>{o.contact_phone}</a>
                      {o.contact_email && <> · <a className="underline" href={`mailto:${o.contact_email}`}>{o.contact_email}</a></>}
                    </p>
                    {o.notes && <p className="mt-2 text-sm text-muted-foreground">{o.notes}</p>}
                  </div>
                  <select
                    aria-label="Statusi"
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={o.status}
                    onChange={(e) => change(o.id, e.target.value as Status)}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
