import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BellRing, Copy, ExternalLink, LogOut, RefreshCw, Trash2 } from "lucide-react";
import { deleteAdminInvitation, listAdminInvitations, listOrderRequests, updateOrderStatus } from "@/lib/orders.functions";
import { getReminderStats, setPushEnabled } from "@/lib/reminders.functions";
import {
  confirmPayment,
  getPaymentSettingsAdmin,
  listPaymentOrders,
  resendPaymentEmail,
  savePaymentSettings,
  setPaymentOrderStatus,
} from "@/lib/payments.functions";
import { PACKAGE_LABELS, PAYMENT_STATUS_LABELS, type PaymentOrderStatus } from "@/lib/payment-shared";
import { formatDate, formatDateTime } from "@/lib/format-date";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/order-validation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
type PaymentOrder = Awaited<ReturnType<typeof listPaymentOrders>>["orders"][number];
type PaymentStats = Awaited<ReturnType<typeof listPaymentOrders>>["stats"];
type PaymentSettings = Awaited<ReturnType<typeof getPaymentSettingsAdmin>>;
type ReminderStats = Awaited<ReturnType<typeof getReminderStats>>;

function invitationOf(o: PaymentOrder) {
  const inv = o.invitations as { partner_one: string; partner_two: string; event_date: string } | null;
  return inv ? `${inv.partner_one} & ${inv.partner_two}` : "—";
}

function AdminPage() {
  const list = useServerFn(listOrderRequests);
  const listInvitations = useServerFn(listAdminInvitations);
  const removeInvitation = useServerFn(deleteAdminInvitation);
  const update = useServerFn(updateOrderStatus);
  const listPayments = useServerFn(listPaymentOrders);
  const confirm = useServerFn(confirmPayment);
  const setOrderStatus = useServerFn(setPaymentOrderStatus);
  const resendEmail = useServerFn(resendPaymentEmail);
  const loadSettings = useServerFn(getPaymentSettingsAdmin);
  const saveSettings = useServerFn(savePaymentSettings);
  const [key, setKey] = useState("");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [view, setView] = useState<"invitations" | "orders" | "payments" | "settings">("invitations");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [payFilter, setPayFilter] = useState<PaymentOrderStatus | "all">("all");
  const [paySearch, setPaySearch] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  async function load(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true);
    setLoginError(null);
    try {
      const [orderRows, invitationRows, paymentData, settingsData] = await Promise.all([
        list({ data: { key: key.trim() } }),
        listInvitations({ data: { key: key.trim() } }),
        listPayments({ data: { key: key.trim() } }),
        loadSettings({ data: { key: key.trim() } }),
      ]);
      setOrders(orderRows);
      setInvitations(invitationRows);
      setPaymentOrders(paymentData.orders);
      setPaymentStats(paymentData.stats);
      setSettings(settingsData);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gabim.";
      setLoginError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  async function onConfirmPayment(id: string) {
    try {
      const res = await confirm({ data: { key: key.trim(), id } });
      setPaymentOrders((rows) => rows.map((r) => (r.id === id ? { ...r, status: "paid" } : r)));
      toast.success(res.already ? "Pagesa ishte konfirmuar më parë." : "Pagesa u konfirmua — ftesa u aktivizua.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gabim.");
    }
  }

  async function onOrderAction(id: string, action: "cancel" | "reactivate") {
    try {
      await setOrderStatus({ data: { key: key.trim(), id, action } });
      setPaymentOrders((rows) =>
        rows.map((r) => (r.id === id ? { ...r, status: action === "cancel" ? "cancelled" : "pending_payment" } : r)),
      );
      toast.success(action === "cancel" ? "Porosia u anulua." : "Porosia u riaktivizua.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gabim.");
    }
  }

  async function onResendEmail(id: string) {
    try {
      const res = await resendEmail({ data: { key: key.trim(), id } });
      toast.success(res.email === "sent" ? "Email-i u ridërgua." : "Email-i nuk u dërgua: shërbimi i email-it nuk është konfiguruar ende.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gabim.");
    }
  }

  async function onSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    try {
      await saveSettings({ data: { key: key.trim(), ...settings } });
      toast.success("Cilësimet e pagesës u ruajtën.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gabim.");
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

  async function deleteInvitation(id: string) {
    try {
      await removeInvitation({ data: { key: key.trim(), id } });
      setInvitations((list) => list.filter((i) => i.id !== id));
      toast.success("Ftesa u fshi përgjithmonë.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gabim.");
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
            <Button variant={view === "payments" ? "default" : "outline"} onClick={() => setView("payments")}>Porositë e pagesave ({paymentOrders.length})</Button>
            <Button variant={view === "orders" ? "default" : "outline"} onClick={() => setView("orders")}>Kërkesat ({orders.length})</Button>
            <Button variant={view === "settings" ? "default" : "outline"} onClick={() => setView("settings")}>Cilësimet e pagesës</Button>
            <Button variant="ghost" disabled={busy} onClick={() => load()}><RefreshCw className="h-4 w-4" />{busy ? "Duke ngarkuar…" : "Rifresko"}</Button>
            <Button variant="ghost" onClick={() => { setOrders(null); setInvitations([]); setKey(""); setSearch(""); setLoginError(null); }}><LogOut className="h-4 w-4" />Dil</Button>
          </div>
          {loginError && <p role="alert" className="mt-3 text-sm text-destructive">{loginError}</p>}
          {view === "invitations" && (
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" />Fshij</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Të fshihet ftesa përgjithmonë?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Ftesa "{inv.partner_one} & {inv.partner_two}" do të fshihet përfundimisht së bashku me RSVP-të, fotot e mysafirëve dhe porosinë e pagesës. Kjo nuk mund të zhbëhet.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Anulo</AlertDialogCancel>
                              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { void deleteInvitation(inv.id); }}>
                                Fshij përgjithmonë
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
          {view === "orders" && (
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
          {view === "payments" && (
            <section className="mt-6">
              <h2 className="font-display text-2xl">Porositë e pagesave</h2>
              {paymentStats && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {[
                    ["Gjithsej", paymentStats.total],
                    ["Në pritje", paymentStats.pending],
                    ["Të paguara", paymentStats.paid],
                    ["Të anuluara", paymentStats.cancelled],
                    ["Të ardhurat", `€${paymentStats.revenue}`],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-border bg-card p-4 text-center">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
                      <p className="mt-1 font-display text-2xl">{value}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 flex flex-wrap gap-2">
                {(["all", "pending_payment", "paid", "cancelled", "expired"] as const).map((s) => (
                  <Button key={s} size="sm" variant={payFilter === s ? "default" : "outline"} onClick={() => setPayFilter(s)}>
                    {s === "all" ? "Të gjitha" : PAYMENT_STATUS_LABELS[s]} (
                    {s === "all" ? paymentOrders.length : paymentOrders.filter((o) => o.status === s).length})
                  </Button>
                ))}
              </div>
              <Label htmlFor="payment-search" className="mt-4 mb-2 block">Kërko numrin e porosisë, klientin ose çiftin</Label>
              <Input id="payment-search" value={paySearch} onChange={(e) => setPaySearch(e.target.value)} placeholder="FD-2026-…" className="max-w-md" />
              <div className="mt-5 space-y-3">
                {paymentOrders
                  .filter((o) => payFilter === "all" || o.status === payFilter)
                  .filter((o) => {
                    const q = paySearch.trim().toLocaleLowerCase("sq");
                    if (!q) return true;
                    return `${o.order_number} ${o.customer_name ?? ""} ${o.customer_email ?? ""} ${o.customer_phone ?? ""} ${invitationOf(o)}`
                      .toLocaleLowerCase("sq")
                      .includes(q);
                  })
                  .map((o) => (
                    <article key={o.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-mono font-semibold">{o.order_number}</p>
                          <p className="mt-1 text-sm">
                            {invitationOf(o)} · {PACKAGE_LABELS[o.package as keyof typeof PACKAGE_LABELS]} · €{Number(o.amount)}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {o.customer_name ?? "Pa të dhëna kontakti"}
                            {o.customer_email && <> · <a className="underline" href={`mailto:${o.customer_email}`}>{o.customer_email}</a></>}
                            {o.customer_phone && <> · <a className="underline" href={`tel:${o.customer_phone.replace(/\s/g, "")}`}>{o.customer_phone}</a></>}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Krijuar: {formatDateTime(o.created_at)}
                            {o.paid_at && <> · Paguar: {formatDateTime(o.paid_at)}</>}
                            {" · "}{PAYMENT_STATUS_LABELS[o.status as PaymentOrderStatus]}
                            {o.payment_email_status && <> · Email: {o.payment_email_status === "sent" ? "dërguar" : o.payment_email_status === "not_configured" ? "i pakonfiguruar" : "dështoi"}</>}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link to="/ftesa/$id" params={{ id: o.invitation_id }} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" />Ftesa</Link>
                          </Button>
                          {o.status === "pending_payment" && (
                            <Button size="sm" onClick={() => onConfirmPayment(o.id)}>Konfirmo pagesën</Button>
                          )}
                          {(o.status === "pending_payment" || o.status === "expired") && (
                            <Button size="sm" variant="outline" onClick={() => onResendEmail(o.id)}>Ridërgo email</Button>
                          )}
                          {(o.status === "pending_payment" || o.status === "expired") && (
                            <Button size="sm" variant="outline" onClick={() => onOrderAction(o.id, "cancel")}>Anulo</Button>
                          )}
                          {(o.status === "cancelled" || o.status === "expired") && (
                            <Button size="sm" variant="outline" onClick={() => onOrderAction(o.id, "reactivate")}>Riaktivizo</Button>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                {paymentOrders.length === 0 && <p className="text-muted-foreground">Nuk ka ende porosi me pagesë.</p>}
              </div>
            </section>
          )}
          {view === "settings" && settings && (
            <section className="mt-6 max-w-xl">
              <h2 className="font-display text-2xl">Cilësimet e pagesës bankare</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Këto të dhëna u shfaqen vetëm klientit te faqja private e pagesës së porosisë së tij.
              </p>
              <form onSubmit={onSaveSettings} className="mt-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="set-bank">Emri i bankës</Label>
                  <Input id="set-bank" value={settings.bank_name} maxLength={120} onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="set-beneficiary">Përfituesi (mbajtësi i llogarisë)</Label>
                  <Input id="set-beneficiary" value={settings.beneficiary} maxLength={120} onChange={(e) => setSettings({ ...settings, beneficiary: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="set-iban">IBAN / Numri i llogarisë</Label>
                  <Input id="set-iban" value={settings.iban} maxLength={64} onChange={(e) => setSettings({ ...settings, iban: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="set-whatsapp">Numri i WhatsApp-it të biznesit (vetëm shifra, me prefiks)</Label>
                  <Input id="set-whatsapp" value={settings.whatsapp_number} maxLength={20} onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value.replace(/\D/g, "") })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="set-email">Email-i i mbështetjes</Label>
                  <Input id="set-email" type="email" value={settings.support_email} maxLength={255} onChange={(e) => setSettings({ ...settings, support_email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="set-instructions">Udhëzime shtesë për pagesën</Label>
                  <Input id="set-instructions" value={settings.instructions} maxLength={1000} onChange={(e) => setSettings({ ...settings, instructions: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="set-expiry">Afati i pagesës (ditë)</Label>
                  <Input id="set-expiry" type="number" min={1} max={90} value={settings.order_expiration_days} onChange={(e) => setSettings({ ...settings, order_expiration_days: Math.max(1, Math.min(90, Number(e.target.value) || 7)) })} />
                </div>
                <Button type="submit">Ruaj cilësimet</Button>
              </form>
            </section>
          )}
        </>
      )}
    </main>
  );
}
