import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Heart,
  ImagePlus,
  LayoutGrid,
  Camera,
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Share2,
  Sparkles,
  Trash2,
  UserCheck,
  UserMinus,
  UserX,
  Users,
  X,
  PanelLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, formatDateTime } from "@/lib/format-date";
import {
  deleteGuest,
  deletePhoto,
  getManageData,
  setApproval,
  setExpectedGuests,
  uploadPhoto,
} from "@/lib/invitations.functions";
import { GuestDialog } from "@/components/GuestDialog";
import { EditEventDialog } from "@/components/EditEventDialog";
import { SaveToAccount } from "@/components/SaveToAccount";

export const Route = createFileRoute("/menaxho/$token")({
  loader: async ({ params }) => {
    const d = await getManageData({ data: { token: params.token } });
    if (!d) throw notFound();
    return d;
  },
  head: () => ({
    meta: [
      { title: "Paneli i ftesës — Ftesa Dasme" },
      { name: "description", content: "Menaxhoni RSVP-të, mysafirët dhe fotot e dasmës." },
      { property: "og:title", content: "Paneli i ftesës" },
      { property: "og:description", content: "RSVP-të, mysafirët dhe fotot në një vend." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Manage,
});

type Filter = "all" | "pending" | "approved" | "rejected";
type Row = ReturnType<typeof Route.useLoaderData>["rsvps"][number];

const statusOf = (r: Row): Exclude<Filter, "all"> =>
  !r.attending || r.approval === "rejected"
    ? "rejected"
    : r.approval === "approved"
      ? "approved"
      : "pending";

function Badge({ r }: { r: Row }) {
  const s = statusOf(r);
  const cls =
    s === "pending"
      ? "border-warning/30 bg-warning-soft text-warning"
      : s === "approved"
        ? "border-success/30 bg-success/10 text-success"
        : "border-destructive/30 bg-destructive/10 text-destructive";
  const label =
    s === "pending"
      ? "Në pritje të konfirmimit"
      : s === "approved"
        ? "E aprovuar"
        : r.attending
          ? "E refuzuar"
          : "Nuk mund të vijë";
  const Icon = s === "pending" ? Clock : s === "approved" ? Check : X;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${cls}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function toBase64(file: File) {
  return new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(",")[1] ?? "");
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function Manage() {
  const d = Route.useLoaderData();
  const router = useRouter();
  const { token } = Route.useParams();
  const inv = d.invitation;
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [uploading, setUploading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const remove = useServerFn(deleteGuest);
  const approve = useServerFn(setApproval);
  const upload = useServerFn(uploadPhoto);
  const removePhoto = useServerFn(deletePhoto);
  const saveExpected = useServerFn(setExpectedGuests);
  const refresh = () => router.invalidate();

  // Origin-i lexohet vetëm në shfletues (useEffect) që SSR dhe klienti të
  // japin të njëjtin HTML fillestar — pa gabim hidratimi.
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  const link = `${origin}/ftesa/${inv.id}`;

  const sum = (rows: Row[]) => rows.reduce((s, r) => s + Math.max(r.guest_count, 1), 0);
  const by = (f: Exclude<Filter, "all">) => d.rsvps.filter((r) => statusOf(r) === f);
  const approved = by("approved");
  const pending = by("pending");
  const rejectedByCouple = d.rsvps.filter((r) => r.attending && r.approval === "rejected");
  const declined = d.rsvps.filter((r) => !r.attending);

  // Mysafirë total vs të mbetur: totali i vendosur nga çifti minus personat
  // që vijnë (aprovuar + në pritje; refuzuar dhe "nuk vjen" nuk numërohen).
  const expected = inv.expected_guests;
  const comingPersons = d.rsvps
    .filter((r) => r.attending && r.approval !== "rejected")
    .reduce((s, r) => s + Math.max(r.guest_count, 1), 0);
  const remaining = expected != null ? Math.max(expected - comingPersons, 0) : null;
  const [expectedInput, setExpectedInput] = useState(
    expected != null ? String(expected) : "",
  );
  const saveExpectedCount = async () => {
    const n = Number(expectedInput);
    if (!Number.isInteger(n) || n < 0 || n > 2000) {
      toast.error("Shkruani një numër nga 0 deri 2000.");
      return;
    }
    try {
      await saveExpected({ data: { token, expected_guests: n } });
      toast.success("Numri u ruajt.");
      refresh();
    } catch {
      toast.error("Nuk u ruajt. Provoni përsëri.");
    }
  };

  const shown = d.rsvps.filter(
    (r) =>
      (filter === "all" || statusOf(r) === filter) &&
      r.guest_name.toLowerCase().includes(q.trim().toLowerCase()),
  );

  const act = async (id: string, approval: "pending" | "approved" | "rejected") => {
    try {
      await approve({ data: { token, id, approval } });
      refresh();
    } catch {
      toast.error("Nuk u ndryshua. Provoni përsëri.");
    }
  };
  const onDelete = async (id: string, name: string) => {
    if (!window.confirm(`Ta heqim ${name} nga lista?`)) return;
    try {
      await remove({ data: { token, id } });
      toast.success("Mysafiri u hoq.");
      refresh();
    } catch {
      toast.error("Nuk u hoq. Provoni përsëri.");
    }
  };
  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    let ok = 0;
    for (const f of Array.from(files)) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
        toast.error(`${f.name}: lejohen vetëm JPG, PNG ose WEBP.`);
        continue;
      }
      if (f.size > 6 * 1024 * 1024) {
        toast.error(`${f.name}: fotoja duhet të jetë nën 6 MB.`);
        continue;
      }
      try {
        await upload({
          data: { token, type: f.type as "image/jpeg", base64: await toBase64(f) },
        });
        ok++;
      } catch {
        toast.error(`${f.name} nuk u ngarkua.`);
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    if (ok) {
      toast.success(ok === 1 ? "Fotoja u ngarkua." : `${ok} foto u ngarkuan.`);
      refresh();
    }
  };
  const onDeletePhoto = async (id: string) => {
    if (!window.confirm("Ta fshijmë këtë foto?")) return;
    try {
      await removePhoto({ data: { token, id } });
      refresh();
    } catch {
      toast.error("Fotoja nuk u fshi.");
    }
  };
  const share = async () => {
    const text = `Ju ftojmë në dasmën tonë 💍 ${link}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${inv.partner_one} & ${inv.partner_two}`, url: link });
        return;
      } catch {
        /* cancelled */
      }
    }
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    try {
      if (window.self !== window.top) {
        window.location.href = waUrl;
      } else {
        window.open(waUrl, "_blank", "noreferrer");
      }
    } catch {
      window.open(waUrl, "_blank", "noreferrer");
    }
  };
  const exportCsv = () => {
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const label = { pending: "Në pritje", approved: "E aprovuar", rejected: "Refuzuar" };
    const rows = [
      ["Emri", "Statusi", "Persona", "Mesazhi", "Data"],
      ...shown.map((r) => [
        r.guest_name,
        label[statusOf(r)],
        String(r.attending ? r.guest_count : 0),
        r.note ?? "",
        formatDateTime(r.created_at),
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
    { label: "Mysafirë të Aprovuar", value: sum(approved), icon: UserCheck, cls: "text-success" },
    { label: "Në pritje të konfirmimit", value: sum(pending), icon: Clock, cls: "text-warning" },
    { label: "E refuzuar", value: rejectedByCouple.length, icon: UserX, cls: "text-destructive" },
    {
      label: "Nuk mund të marrin pjesë",
      value: declined.length,
      icon: UserMinus,
      cls: "text-muted-foreground",
    },
  ];
  const tabs: { key: Filter; label: string; count: number; icon: typeof Users }[] = [
    { key: "all", label: "Të gjitha", count: d.rsvps.length, icon: Users },
    { key: "pending", label: "Në Pritje", count: pending.length, icon: Clock },
    { key: "approved", label: "E aprovuar", count: approved.length, icon: UserCheck },
    { key: "rejected", label: "Refuzuar", count: by("rejected").length, icon: UserMinus },
  ];
  const title = `${inv.partner_one} & ${inv.partner_two}`;

  const nav = (
    <nav className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-2 px-4 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Heart className="h-4 w-4 fill-current" />
        </span>
        <span className="font-display text-lg">Ftesa Dasme</span>
      </Link>
      <p className="px-4 pb-2 text-xs text-muted-foreground">Platformi</p>
      <ul className="space-y-0.5 px-2 text-sm">
        <li>
          <a
            href="#paneli"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 rounded-md bg-muted px-2 py-2 font-medium"
          >
            <LayoutGrid className="h-4 w-4" /> Paneli
          </a>
        </li>
        <li>
          <Link
            to="/ngjarjet"
            className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-muted"
          >
            <CalendarDays className="h-4 w-4" /> Ngjarjet e Mia
          </Link>
        </li>
        <li>
          <Link
            to="/krijo"
            className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-muted"
          >
            <Plus className="h-4 w-4" /> Krijo Ngjarje
          </Link>
        </li>
      </ul>
      <div className="mt-auto flex items-center gap-2 border-t border-border p-4 text-sm">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs uppercase">
          {inv.partner_one.charAt(0)}
        </span>
        <span className="truncate">{inv.partner_one}</span>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 border-r border-border bg-card md:block">
        {nav}
      </aside>
      {menuOpen ? (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-foreground/30" />
          <aside
            className="absolute inset-y-0 left-0 w-60 bg-card shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {nav}
          </aside>
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <header className="flex items-center gap-2 border-b border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          <button
            aria-label="Hap menunë"
            className="rounded p-1 hover:bg-muted"
            onClick={() => setMenuOpen(true)}
          >
            <PanelLeft className="h-4 w-4" />
          </button>
          <span className="hidden sm:inline">Paneli</span>
          <ChevronRight className="hidden h-3.5 w-3.5 sm:inline" />
          <span className="hidden sm:inline">Ngjarjet e Mia</span>
          <ChevronRight className="hidden h-3.5 w-3.5 sm:inline" />
          <span className="truncate text-foreground">Dasma jonë</span>
        </header>

        <main id="paneli" className="space-y-5 p-4 pb-20 sm:p-6">
          <SaveToAccount token={token} />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground sm:h-14 sm:w-14">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-xl font-semibold sm:text-2xl">Dasma jonë</h1>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[11px]">
                    Wedding
                  </span>
                  <span className="rounded-full bg-success px-2 py-0.5 text-[11px] text-success-foreground">
                    active
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{title}</p>
                <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs capitalize text-muted-foreground">
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
              <EditEventDialog
                token={token}
                inv={inv}
                onSaved={refresh}
                trigger={
                  <Button size="sm" variant="outline">
                    <Pencil className="mr-1.5 h-4 w-4" /> Ndrysho Ngjarjen
                  </Button>
                }
              />
              <Button asChild size="sm" variant="outline">
                <Link to="/ftesa/$id" params={{ id: inv.id }} target="_blank">
                  <ExternalLink className="mr-1.5 h-4 w-4" /> Preview
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm">
                    <Share2 className="mr-1.5 h-4 w-4" /> Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={share}>
                    <Share2 className="mr-2 h-4 w-4" /> Ndaj ftesën
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(link);
                      toast.success("Lidhja u kopjua.");
                    }}
                  >
                    <Copy className="mr-2 h-4 w-4" /> Kopjo lidhjen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground sm:text-sm">{s.label}</p>
                    <p className={`mt-1 text-3xl font-semibold ${s.cls}`}>{s.value}</p>
                  </div>
                  <s.icon className={`h-6 w-6 shrink-0 opacity-50 ${s.cls}`} />
                </div>
              </div>
            ))}
          </section>

          <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  <Users className="h-4 w-4" /> Musafirë total
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Sa mysafirë pritni gjithsej. Numri i mbetur zvogëlohet me secilin që shtohet.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={2000}
                  value={expectedInput}
                  onChange={(e) => setExpectedInput(e.target.value)}
                  placeholder="p.sh. 250"
                  aria-label="Numri total i mysafirëve"
                  className="w-28 rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <Button size="sm" onClick={saveExpectedCount}>
                  Ruaj
                </Button>
                {remaining != null ? (
                  <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs text-success">
                    Të mbetur: <strong>{remaining}</strong>
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">Vendosni totalin</span>
                )}
              </div>
            </div>
          </section>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
            <section id="mysafiret" className="rounded-xl border border-border bg-card p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-semibold">Lista e musafirëve</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{d.rsvps.length} RSVP</span>
                  <GuestDialog
                    token={token}
                    onSaved={refresh}
                    trigger={
                      <Button size="sm" variant="outline">
                        <Plus className="mr-1 h-4 w-4" /> Shto
                      </Button>
                    }
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={shown.length === 0}
                    onClick={exportCsv}
                    aria-label="Shkarko CSV"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setFilter(t.key)}
                    className={`inline-flex min-h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs transition-colors ${filter === t.key ? "border-foreground bg-foreground text-background" : "border-border hover:bg-muted"}`}
                  >
                    <t.icon className="h-3.5 w-3.5" />
                    {t.label}
                    <span
                      className={`rounded px-1.5 text-[10px] ${filter === t.key ? "bg-background/20" : "bg-muted"}`}
                    >
                      {t.count}
                    </span>
                  </button>
                ))}
              </div>
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Kërko emrin…"
                  className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm"
                />
              </div>

              {shown.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  {d.rsvps.length === 0
                    ? "Ende asnjë përgjigje. Ndani lidhjen për të nisur."
                    : "Asnjë mysafir nuk përputhet."}
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {shown.map((r) => {
                    const s = statusOf(r);
                    return (
                      <li key={r.id} className="rounded-lg border border-border p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium">{r.guest_name}</span>
                              <Badge r={r} />
                            </div>
                            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="h-3.5 w-3.5" />
                              {r.attending ? `${r.guest_count} mysafirë` : "Nuk vjen"} ·{" "}
                              {formatDateTime(r.created_at)}
                            </p>
                          </div>
                          <div className="flex shrink-0 flex-wrap items-center gap-1">
                            {s === "pending" ? (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-success text-success-foreground hover:bg-success/90"
                                  onClick={() => act(r.id, "approved")}
                                >
                                  <Check className="mr-1 h-4 w-4" /> Approve
                                </Button>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  aria-label={`Refuzo ${r.guest_name}`}
                                  onClick={() => act(r.id, "rejected")}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : r.attending ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => act(r.id, "pending")}
                              >
                                <RotateCcw className="mr-1 h-3.5 w-3.5" /> Rikthe
                              </Button>
                            ) : null}
                            <GuestDialog
                              token={token}
                              guest={r}
                              onSaved={refresh}
                              trigger={
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  aria-label={`Modifiko ${r.guest_name}`}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              aria-label={`Hiq ${r.guest_name}`}
                              onClick={() => onDelete(r.id, r.guest_name)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        {r.note ? (
                          <p className="mt-3 rounded-md bg-muted px-3 py-2 text-sm italic">
                            “{r.note}”
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            <aside className="space-y-5">
              <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  <Camera className="h-4 w-4" /> Foto & Video
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Kujtimet e ngarkuara nga ngjarja, të ruajtura privatisht në panelin tuaj.
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={(e) => onFiles(e.target.files)}
                />
                <button
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                  className="mt-4 flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-border py-6 text-xs text-muted-foreground hover:bg-muted disabled:opacity-60"
                >
                  <ImagePlus className="h-6 w-6" />
                  {uploading ? "Duke ngarkuar…" : "Klikoni për të ngarkuar"}
                </button>
                {d.photos.length ? (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {d.photos.map((p) => (
                      <div key={p.id} className="group relative aspect-square">
                        <a href={p.url} target="_blank" rel="noreferrer">
                          {p.kind === "video" ? (
                            <video src={p.url} muted playsInline preload="metadata" className="h-full w-full rounded-md object-cover" />
                          ) : (
                            <img
                              src={p.url}
                              alt="Foto nga dasma"
                              loading="lazy"
                              className="h-full w-full rounded-md object-cover"
                            />
                          )}
                        </a>
                        <button
                          aria-label="Fshi foton"
                          onClick={() => onDeletePhoto(p.id)}
                          className="absolute right-1 top-1 rounded bg-background/90 p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
              <section className="rounded-xl border border-border bg-card p-4 text-sm sm:p-5">
                <h2 className="flex items-center gap-2 font-semibold">
                  <Share2 className="h-4 w-4" /> Linku i ftesës
                </h2>
                <p className="mt-2 break-all rounded-md bg-muted px-3 py-2 text-xs">{link}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(link);
                    toast.success("Lidhja u kopjua.");
                  }}
                >
                  <Copy className="mr-1.5 h-4 w-4" /> Kopjo lidhjen
                </Button>
              </section>
            </aside>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Ruajeni këtë faqe te favoritët — vetëm kjo adresë hap panelin tuaj.
          </p>
        </main>
      </div>
    </div>
  );
}
