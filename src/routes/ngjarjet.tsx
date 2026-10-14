import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, LogOut, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { listMyInvitations } from "@/lib/account.functions";
import { useSession } from "@/hooks/use-session";
import { formatDate } from "@/lib/format-date";

export const Route = createFileRoute("/ngjarjet")({
  head: () => ({
    meta: [
      { title: "Ngjarjet e mia — Ftesa Dasme" },
      { name: "description", content: "Të gjitha ftesat tuaja dhe panelet e mysafirëve." },
      { property: "og:title", content: "Ngjarjet e mia — Ftesa Dasme" },
      { property: "og:description", content: "Ftesat tuaja të ruajtura në llogari." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MyEvents,
});

function MyEvents() {
  const session = useSession();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const list = useServerFn(listMyInvitations);
  const q = useQuery({
    queryKey: ["my-invitations", session?.user.id],
    queryFn: () => list(),
    enabled: !!session,
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/hyr", replace: true });
  }

  if (session === undefined) return <div className="min-h-screen" />;
  if (!session)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="font-display text-3xl">Ngjarjet e mia</h1>
        <p className="text-muted-foreground">Hyni për të parë ftesat tuaja.</p>
        <Button asChild>
          <Link to="/hyr">Hyr në llogari</Link>
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-4 sm:px-6">
        <Link to="/" className="font-display text-xl text-primary">
          Ftesa Dasme
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-muted-foreground sm:inline">{session.user.email}</span>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="mr-1.5 h-4 w-4" /> Dil
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-display text-3xl">Ngjarjet e mia</h1>
          <Button asChild>
            <Link to="/krijo">
              <Plus className="mr-1.5 h-4 w-4" /> Krijo ftesë
            </Link>
          </Button>
        </div>
        {q.isLoading ? (
          <p className="text-muted-foreground">Duke ngarkuar…</p>
        ) : !q.data?.length ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
            Nuk keni ende ftesa në llogari. Krijoni një të re, ose hapni panelin e një ftese
            ekzistuese dhe shtypni «Ruaje në llogari».
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {q.data.map((i) => (
              <li key={i.id}>
                <Link
                  to="/menaxho/$token"
                  params={{ token: i.manage_token }}
                  className="block rounded-xl border border-border bg-card p-5 transition hover:shadow-md"
                >
                  <p className="font-display text-2xl">
                    {i.partner_one} & {i.partner_two}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" /> {formatDate(i.event_date)}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {i.venue}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
