import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Copy, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/components/InvitationCard";
import { getManageData } from "@/lib/invitations.functions";

export const Route = createFileRoute("/menaxho/$token")({
  loader: async ({ params }) => {
    const d = await getManageData({ data: { token: params.token } });
    if (!d) throw notFound();
    return d;
  },
  head: () => ({
    meta: [
      { title: "Menaxho RSVP — Ftesa Dasme" },
      { name: "description", content: "Shikoni përgjigjet RSVP dhe numrin e të ftuarve që marrin pjesë." },
      { property: "og:title", content: "Menaxho RSVP" },
      { property: "og:description", content: "Përgjigjet dhe numri i të ftuarve në dasmën tuaj." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Manage,
});

function Manage() {
  const d = Route.useLoaderData();
  const { invitation: inv } = d;
  const link = typeof window !== "undefined" ? `${window.location.origin}/ftesa/${inv.id}` : `/ftesa/${inv.id}`;

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <Link to="/" className="font-display text-2xl text-primary">
          Ftesa Dasme
        </Link>
      </header>
      <main className="mx-auto max-w-4xl space-y-8 px-6 pb-24">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl">
            {inv.partner_one} & {inv.partner_two}
          </h1>
          <p className="mt-2 capitalize text-muted-foreground">
            {formatDate(inv.event_date)} · {inv.event_time} · {inv.venue}
          </p>
        </div>

        <section className="rounded-sm border border-border bg-card p-6">
          <h2 className="font-display text-2xl">Lidhja e ftesës</h2>
          <p className="mt-1 text-sm text-muted-foreground">Dërgojani këtë lidhje të ftuarve.</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              readOnly
              value={link}
              onFocus={(e) => e.currentTarget.select()}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast.success("Lidhja u kopjua.");
              }}
            >
              <Copy className="mr-2 h-4 w-4" /> Kopjo
            </Button>
            <Button asChild variant="outline">
              <Link to="/ftesa/$id" params={{ id: inv.id }}>
                Hap ftesën
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Ruajeni këtë faqe (shtojeni te favoritët): vetëm kjo adresë tregon përgjigjet.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-sm border border-border bg-primary p-6 text-primary-foreground">
            <Users className="h-5 w-5" />
            <p className="font-display mt-3 text-6xl">{d.attendingGuests}</p>
            <p className="text-sm opacity-90">të ftuar marrin pjesë</p>
          </div>
          <div className="rounded-sm border border-border bg-card p-6">
            <p className="font-display text-5xl">{d.attendingResponses}</p>
            <p className="text-sm text-muted-foreground">përgjigje “do të vijmë”</p>
          </div>
          <div className="rounded-sm border border-border bg-card p-6">
            <p className="font-display text-5xl">{d.declined}</p>
            <p className="text-sm text-muted-foreground">nuk mund të vijnë</p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl">Përgjigjet</h2>
          {d.rsvps.length === 0 ? (
            <p className="mt-3 text-muted-foreground">Ende asnjë përgjigje. Ndani lidhjen për të nisur.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border rounded-sm border border-border bg-card">
              {d.rsvps.map((r) => (
                <li key={r.id} className="flex items-start justify-between gap-4 p-4">
                  <div>
                    <p className="font-medium">{r.guest_name}</p>
                    {r.note ? <p className="text-sm text-muted-foreground">{r.note}</p> : null}
                  </div>
                  <span className="whitespace-nowrap text-sm text-muted-foreground">
                    {r.attending ? `${r.guest_count} ${r.guest_count === 1 ? "person" : "persona"}` : "Nuk vjen"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
