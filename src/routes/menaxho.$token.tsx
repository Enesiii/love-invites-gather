import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import {
  CalendarDays,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Heart,
  MapPin,
  RefreshCw,
  Search,
  Share2,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format-date";
import { getManageData } from "@/lib/invitations.functions";

export const Route = createFileRoute("/menaxho/$token")({
  loader: async ({ params }) => {
    const d = await getManageData({ data: { token: params.token } });
    if (!d) throw notFound();
    return d;
  },
  head: () => ({
    meta: [
      { title: "Paneli i ftesës — Ftesa Dasme" },
      {
        name: "description",
        content: "Shikoni përgjigjet RSVP dhe numrin e të ftuarve që marrin pjesë.",
      },
      { property: "og:title", content: "Menaxho RSVP" },
      { property: "og:description", content: "Përgjigjet dhe numri i të ftuarve në dasmën tuaj." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Manage,
});

type Filter = "all" | "yes" | "no";

function Manage() {
  const d = Route.useLoaderData();
  const router = useRouter();
  const { invitation: inv } = d;
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/ftesa/${inv.id}`
      : `/ftesa/${inv.id}`;
  const shown = d.rsvps.filter(
    (r) =>
      (filter === "all" || (filter === "yes") === r.attending) &&
      r.guest_name.toLowerCase().includes(q.trim().toLowerCase()),
  );
  const days = Math.ceil(
    (new Date(inv.event_date + "T00:00:00").getTime() - Date.now()) / 86400000,
  );

  const exportCsv = () => {
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows = [
      ["Emri", "Vjen", "Persona", "Mesazhi", "Data"],
      ...shown.map((r) => [
        r.guest_name,
        r.attending ? "Po" : "Jo",
        String(r.attending ? r.guest_count : 0),
        r.note ?? "",
        new Date(r.created_at).toLocaleString("sq"),
      ]),
    ];
    const blob = new Blob(["\uFEFF" + rows.map((r) => r.map(esc).join(",")).join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mysafiret.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const stats = [
    { label: "Mysafirë që vijnë", value: d.attendingGuests, icon: Users, accent: true },
    { label: "Përgjigje “Po”", value: d.attendingResponses, icon: UserCheck },
    { label: "Nuk vijnë", value: d.declined, icon: UserX },
    {
      label: days >= 0 ? "Ditë deri në dasmë" : "Ditë nga dasma",
      value: Math.abs(days),
      icon: CalendarDays,
    },
  ];
  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "Të gjitha", count: d.rsvps.length },
    { key: "yes", label: "Vijnë", count: d.attendingResponses },
    { key: "no", label: "Nuk vijnë", count: d.declined },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="font-display text-2xl text-primary">
            Ftesa Dasme
          </Link>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Paneli juaj
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 pb-24 sm:px-6">
        <div className="flex flex-col gap-4 rounded-md border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-3xl">
                {inv.partner_one} & {inv.partner_two}
              </h1>
              <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm capitalize text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(inv.event_date)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {inv.event_time}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {inv.venue}
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/ftesa/$id" params={{ id: inv.id }}>
                <ExternalLink className="mr-1.5 h-4 w-4" />
                Shiko ftesën
              </Link>
            </Button>
            <Button
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast.success("Lidhja u kopjua.");
              }}
            >
              <Copy className="mr-1.5 h-4 w-4" />
              Kopjo lidhjen
            </Button>
            <Button asChild size="sm" variant="outline">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Ju ftojmë në dasmën tonë 💍 ${link}`)}`}
                target="_blank"
                rel="noreferrer"
              >
                <Share2 className="mr-1.5 h-4 w-4" />
                WhatsApp
              </a>
            </Button>
          </div>
        </div>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`rounded-md border border-border p-5 ${s.accent ? "bg-primary text-primary-foreground" : "bg-card"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm ${s.accent ? "opacity-90" : "text-muted-foreground"}`}>
                  {s.label}
                </p>
                <s.icon className="h-5 w-5 opacity-70" />
              </div>
              <p className="font-display mt-2 text-5xl">{s.value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-md border border-border bg-card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-2xl">Lista e mysafirëve</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => router.invalidate()}>
                <RefreshCw className="mr-1.5 h-4 w-4" />
                Rifresko
              </Button>
              <Button size="sm" variant="outline" disabled={shown.length === 0} onClick={exportCsv}>
                <Download className="mr-1.5 h-4 w-4" />
                CSV
              </Button>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-2">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setFilter(t.key)}
                  className={`min-h-9 rounded-full border px-3 text-sm transition-colors ${filter === t.key ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}
                >
                  {t.label} <span className="ml-1 opacity-75">{t.count}</span>
                </button>
              ))}
            </div>
            <div className="relative sm:ml-auto sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Kërko emrin…"
                className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm"
              />
            </div>
          </div>
          {shown.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground">
              {d.rsvps.length === 0
                ? "Ende asnjë përgjigje. Ndani lidhjen për të nisur."
                : "Asnjë mysafir nuk përputhet."}
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {shown.map((r) => (
                <li key={r.id} className="rounded-md border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">{r.guest_name}</p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${r.attending ? "bg-primary/15 text-primary" : "bg-destructive/10 text-destructive"}`}
                    >
                      {r.attending
                        ? `Vjen · ${r.guest_count} ${r.guest_count === 1 ? "person" : "persona"}`
                        : "Nuk vjen"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString("sq")}
                  </p>
                  {r.note ? (
                    <p className="mt-2 rounded bg-muted px-3 py-2 text-sm italic">“{r.note}”</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
        <p className="text-center text-xs text-muted-foreground">
          Ruajeni këtë faqe te favoritët — vetëm kjo adresë hap panelin tuaj.
        </p>
      </main>
    </div>
  );
}
