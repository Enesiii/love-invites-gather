import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvitationCard } from "@/components/InvitationCard";
import { getPaymentPage, getPaymentPreview, submitPaymentContact } from "@/lib/payments.functions";
import { formatDate } from "@/lib/format-date";
import { Check, Copy, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/pagesa/$token")({
  head: () => ({
    meta: [
      { title: "Përfundo pagesën — Ftesa Dasme" },
      { name: "description", content: "Përfundoni transfertën bankare për të aktivizuar ftesën tuaj." },
      { property: "og:title", content: "Përfundo pagesën — Ftesa Dasme" },
      { property: "og:description", content: "Përfundoni transfertën bankare për të aktivizuar ftesën tuaj." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PaymentPage,
});

type PageData = NonNullable<Awaited<ReturnType<typeof getPaymentPage>>>;
type PreviewData = NonNullable<Awaited<ReturnType<typeof getPaymentPreview>>>;

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Nuk u kopjua. Zgjidheni tekstin manualisht.");
    }
  }
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="truncate font-mono text-sm font-semibold">{value}</p>
      </div>
      <Button type="button" size="sm" variant="outline" onClick={copy} aria-label={`Kopjo ${label}`}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "U kopjua" : "Kopjo"}
      </Button>
    </div>
  );
}

function PaymentPage() {
  const { token } = Route.useParams();
  const fetchPage = useServerFn(getPaymentPage);
  const fetchPreview = useServerFn(getPaymentPreview);
  const sendContact = useServerFn(submitPaymentContact);
  const [data, setData] = useState<PageData | null | undefined>(undefined);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const [contactSaved, setContactSaved] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchPage({ data: { token } })
      .then((d) => {
        if (!alive) return;
        setData(d);
        if (d?.customer_email) setContactSaved(true);
      })
      .catch(() => alive && setData(null));
    return () => {
      alive = false;
    };
  }, [token, fetchPage]);

  async function togglePreview() {
    if (!showPreview && !preview) {
      try {
        setPreview(await fetchPreview({ data: { token } }));
      } catch {
        toast.error("Parapamja nuk u ngarkua.");
        return;
      }
    }
    setShowPreview((s) => !s);
  }

  async function onSubmitContact(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await sendContact({ data: { token, ...form } });
      setContactSaved(true);
      if (res.email === "sent") toast.success("U dërgua email-i me udhëzimet e pagesës.");
      else if (res.email === "not_configured") toast.success("Të dhënat u ruajtën.");
      else toast.success("Të dhënat u ruajtën.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gabim. Provoni përsëri.");
    } finally {
      setBusy(false);
    }
  }

  if (data === undefined) {
    return <main className="mx-auto max-w-2xl px-6 py-24 text-center text-muted-foreground">Duke ngarkuar…</main>;
  }
  if (data === null) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl">Porosia nuk u gjet</h1>
        <p className="mt-3 text-muted-foreground">Lidhja nuk është e vlefshme ose porosia është hequr.</p>
        <Button asChild className="mt-6"><Link to="/">Kthehu në faqen kryesore</Link></Button>
      </main>
    );
  }

  const { order, invitation, settings, links } = data;
  const amount = `${order.amount} ${order.currency === "EUR" ? "€" : order.currency}`;
  const whatsappMsg = encodeURIComponent(
    `Përshëndetje! Kam krijuar ftesën e dasmës për ${invitation.partner_one} & ${invitation.partner_two}.\n` +
      `Porosia: ${order.order_number}\nPaketa: ${order.package_label}\nShuma: ${amount}\n` +
      `Dëshiroj të përfundoj pagesën me transfertë bankare.`,
  );
  const whatsappHref = settings.whatsapp_number
    ? `https://wa.me/${settings.whatsapp_number}?text=${whatsappMsg}`
    : null;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-8 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl text-primary">Ftesa Dasme</Link>
        <span className="text-sm text-muted-foreground">{order.order_number}</span>
      </header>

      {order.status === "paid" && links ? (
        <section className="rounded-2xl border border-border bg-card p-8 text-center">
          <h1 className="font-display text-3xl">Pagesa u konfirmua — ftesa juaj është aktive!</h1>
          <p className="mt-3 text-muted-foreground">
            Faleminderit! Tani mund ta ndani ftesën me mysafirët dhe të menaxhoni përgjigjet nga paneli juaj.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg"><Link to="/ftesa/$id" params={{ id: links.invitationPath.split("/").pop()! }}>Shiko ftesën publike</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/menaxho/$token" params={{ token: links.dashboardPath.split("/").pop()! }}>Hap panelin e mysafirëve</Link></Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Ruajeni këtë faqe — lidhja e panelit është private. Nëse keni llogari, ftesa gjendet edhe te <Link to="/ngjarjet" className="underline">Ngjarjet e Mia</Link>.
          </p>
        </section>
      ) : order.status === "cancelled" || order.status === "expired" ? (
        <section className="rounded-2xl border border-border bg-card p-8 text-center">
          <h1 className="font-display text-3xl">
            {order.status === "expired" ? "Afati i pagesës ka përfunduar" : "Kjo porosi është anuluar"}
          </h1>
          <p className="mt-3 text-muted-foreground">
            Të dhënat e ftesës suaj janë të ruajtura. Na kontaktoni në WhatsApp për ta riaktivizuar porosinë.
          </p>
          {whatsappHref && (
            <Button asChild className="mt-6" size="lg">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" /> Na shkruani në WhatsApp
              </a>
            </Button>
          )}
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-border bg-card p-8">
            <h1 className="font-display text-3xl">Ftesa juaj u krijua me sukses!</h1>
            <p className="mt-3 text-muted-foreground">
              Për ta aktivizuar ftesën dhe për të marrë lidhjet e ndarjes, ju lutem përfundoni transfertën bankare.
              Ftesa juaj do të aktivizohet pas verifikimit të pagesës.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-background p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Porosia</p>
                <p className="mt-1 font-mono font-semibold">{order.order_number}</p>
              </div>
              <div className="rounded-lg bg-background p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Paketa</p>
                <p className="mt-1 font-semibold">{order.package_label}</p>
              </div>
              <div className="rounded-lg bg-background p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Shuma</p>
                <p className="mt-1 font-semibold">{amount}</p>
              </div>
            </div>
            {order.expires_at && (
              <p className="mt-4 text-sm text-muted-foreground">
                Afati i pagesës: deri më {formatDate(order.expires_at.slice(0, 10))}.
              </p>
            )}
          </section>

          {!contactSaved ? (
            <section className="mt-8 rounded-2xl border border-border bg-card p-8">
              <h2 className="font-display text-2xl">Të dhënat tuaja të kontaktit</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Ju dërgojmë udhëzimet e pagesës me email dhe ju njoftojmë kur pagesa të konfirmohet.
              </p>
              <form onSubmit={onSubmitContact} className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="pay-name">Emri i plotë</Label>
                  <Input id="pay-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} maxLength={100} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pay-email">Email</Label>
                  <Input id="pay-email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} maxLength={255} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pay-phone">Telefoni</Label>
                  <Input id="pay-phone" type="tel" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} maxLength={30} required />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" size="lg" disabled={busy}>{busy ? "Duke ruajtur…" : "Ruaj dhe merr udhëzimet"}</Button>
                </div>
              </form>
            </section>
          ) : (
            <section className="mt-8 rounded-2xl border border-border bg-card p-8">
              <h2 className="font-display text-2xl">Udhëzimet e pagesës</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Kryeni transfertën bankare me të dhënat më poshtë. Shënoni numrin e porosisë te përshkrimi i pagesës.
              </p>
              <div className="mt-5 space-y-3">
                {settings.bank_name && <CopyRow label="Banka" value={settings.bank_name} />}
                {settings.beneficiary && <CopyRow label="Përfituesi" value={settings.beneficiary} />}
                {settings.iban && <CopyRow label="IBAN" value={settings.iban} />}
                <CopyRow label="Përshkrimi i pagesës" value={order.order_number} />
              </div>
              {!settings.iban && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Të dhënat bankare po përditësohen. Na shkruani në WhatsApp dhe ju i dërgojmë menjëherë.
                </p>
              )}
              {settings.instructions && <p className="mt-4 text-sm text-muted-foreground">{settings.instructions}</p>}
              <div className="mt-6 flex flex-wrap gap-3">
                {whatsappHref && (
                  <Button asChild size="lg">
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4" /> Konfirmo pagesën në WhatsApp
                    </a>
                  </Button>
                )}
                <Button type="button" size="lg" variant="outline" onClick={togglePreview}>
                  {showPreview ? "Mbyll parapamjen" : "Shiko parapamjen private"}
                </Button>
              </div>
            </section>
          )}

          {showPreview && preview && (
            <section className="mt-8">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Parapamje private — e dukshme vetëm për ju deri në konfirmimin e pagesës
              </p>
              <InvitationCard inv={preview} />
            </section>
          )}
        </>
      )}
    </main>
  );
}
