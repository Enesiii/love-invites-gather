import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, ExternalLink, LogOut, RefreshCw } from "lucide-react";
import { listAdminInvitations, listOrderRequests, updateOrderStatus } from "@/lib/orders.functions";
import { formatDate, formatDateTime } from "@/lib/format-date";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/order-validation";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administrimi i ftesave dhe porosive — Ftesa Dasme" },
      { name: "description", content: "Paneli privat për ftesat e klientëve dhe kërkesat e porosive." },
      { property: "og:title", content: "Administrimi i ftesave dhe porosive — Ftesa Dasme" },
      { property: "og:description", content: "Administroni ftesat dhe rikuperoni lidhjet e klientëve." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Order = Awaited<ReturnType<typeof listOrderRequests>>[number];
type Invitation = Awaited<ReturnType<typeof listAdminInvitations>>[number];
type Status = (typeof ORDER_STATUSES)[number];

function AdminPage() {
  const list = useServerFn(listOrderRequests);
  const listInvitations = useServerFn(listAdminInvitations);
  const update = useServerFn(updateOrderStatus);
  const [key, setKey] = useState("");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [view, setView] = useState<"invitations" | "orders">("invitations");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [loginError, setLoginError] = useState<string | null>(null);

  async function load(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true);
    setLoginError(null);
    try {
      const [orderRows, invitationRows] = await Promise.all([
        list({ data: { key: key.trim() } }),
        listInvitations({ data: { key: key.trim() } }),
      ]);
      setOrders(orderRows);
      setInvitations(invitationRows);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gabim.";
      setLoginError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  async function change(id: string, status: Status) {
    try {
      await update({ data: { key: key.trim(), id, status } });
      setOrders((o) => o?.map((r) => (r.id === id ? { ...r, status } : r)) ?? null);
      toast.success("Statusi u përditësua.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gabim.");
    }
  }

  const shown = orders?.filter((o) => filter === "all" || o.status === filter) ?? [];
  const matchingInvitations = invitations.filter((inv) =>
    `${inv.partner_one} ${inv.partner_two} ${inv.venue} ${inv.event_date}`
      .toLocaleLowerCase("sq").includes(search.trim().toLocaleLowerCase("sq")),
  );

  async function copyInvitation(inv: Invitation, privateLink: boolean) {
    const path = privateLink ? `/menaxho/${inv.manage_token}` : `/ftesa/${inv.id}`;
    try {
      await navigator.clipboard.writeText(new URL(path, window.location.origin).href);
      toast.success(privateLink ? "Linku privat i panelit u kopjua." : "Linku i ftesës u kopjua.");
    } catch {
      toast.error("Linku nuk u kopjua. Hapeni ftesën dhe kopjoni adresën.");
    }
  }

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
        ORDER_STATUS_LABELS[o.status as Status],
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
      <h1 className="mt-4 font-display text-4xl">Paneli i administratorit</h1>
      {!orders ? (
        <form onSubmit={load} className="mt-8 max-w-sm space-y-3">
          <Label htmlFor="admin-key">Kodi i administrimit</Label>
          <Input id="admin-key" type="password" autoComplete="current-password" value={key} onChange={(e) => { setKey(e.target.value); setLoginError(null); }} />
          {loginError && <p role="alert" className="text-sm text-destructive">{loginError}</p>}
          <Button type="submit" disabled={busy || !key.trim()}>{busy ? "Duke hyrë…" : "Hyr"}</Button>
        </form>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button variant={view === "invitations" ? "default" : "outline"} onClick={() => setView("invitations")}>Ftesat ({invitations.length})</Button>
            <Button variant={view === "orders" ? "default" : "outline"} onClick={() => setView("orders")}>Porositë ({orders.length})</Button>
            <Button variant="ghost" disabled={busy} onClick={() => load()}><RefreshCw className="h-4 w-4" />{busy ? "Duke ngarkuar…" : "Rifresko"}</Button>
            <Button variant="ghost" onClick={() => { setOrders(null); setInvitations([]); setKey(""); setSearch(""); setLoginError(null); }}><LogOut className="h-4 w-4" />Dil</Button>
          </div>
          {loginError && <p role="alert" className="mt-3 text-sm text-destructive">{loginError}</p>}
          {view === "invitations" ? (
            <section className="mt-6">
              <h2 className="font-display text-2xl">Ftesat e klientëve</h2>
              <Label htmlFor="invitation-search" className="mt-4 mb-2 block">Kërko çiftin, sallën ose datën</Label>
              <Input id="invitation-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Emrat e çiftit…" className="max-w-md" />
              <div className="mt-5 space-y-3">
                {matchingInvitations.length === 0 && <p className="text-muted-foreground">{search ? "Nuk u gjet asnjë ftesë." : "Nuk ka ftesa të krijuara."}</p>}
                {matchingInvitations.map((inv) => (
                  <article key={inv.id} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link to="/ftesa/$id" params={{ id: inv.id }} target="_blank" rel="noopener noreferrer" className="font-display text-2xl break-words underline-offset-4 hover:underline">{inv.partner_one} & {inv.partner_two}</Link>
                        <p className="mt-1 text-sm text-muted-foreground">{formatDate(inv.event_date)} · {inv.event_time} · {inv.venue}</p>
                        <p className="mt-1 text-xs text-muted-foreground">Krijuar: {formatDateTime(inv.created_at)} · {inv.closed_at ? "Ndërprerë" : "Aktive"}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" asChild><Link to="/ftesa/$id" params={{ id: inv.id }} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" />Hap ftesën</Link></Button>
                        <Button size="sm" variant="outline" onClick={() => copyInvitation(inv, false)}><Copy className="h-4 w-4" />Kopjo linkun e ftesës</Button>
                        <Button size="sm" variant="outline" asChild><Link to="/menaxho/$token" params={{ token: inv.manage_token }} target="_blank" rel="noopener noreferrer">Hap panelin</Link></Button>
                        <Button size="sm" onClick={() => copyInvitation(inv, true)}><Copy className="h-4 w-4" />Kopjo linkun privat të panelit</Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : (
          <>
          <h2 className="mt-6 font-display text-2xl">Kërkesat e porosive</h2>
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
        </>
      )}
    </main>
  );
}
