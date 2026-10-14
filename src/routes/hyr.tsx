import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { claimInvitation } from "@/lib/account.functions";
import { useSession } from "@/hooks/use-session";

const CLAIM_KEY = "ftesa-claim-token";
const uuid = /^[0-9a-f-]{36}$/i;

export const Route = createFileRoute("/hyr")({
  validateSearch: (s: Record<string, unknown>): { ruaj?: string } => {
    const r = s["ruaj"];
    return typeof r === "string" && uuid.test(r) ? { ruaj: r } : {};
  },
  head: () => ({
    meta: [
      { title: "Hyr në llogari — Ftesa Dasme" },
      { name: "description", content: "Hyni për të parë të gjitha ftesat tuaja dhe mysafirët." },
      { property: "og:title", content: "Hyr në llogari — Ftesa Dasme" },
      { property: "og:description", content: "Ftesat tuaja të ruajtura në një vend." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { ruaj } = Route.useSearch();
  const session = useSession();
  const navigate = useNavigate();
  const claim = useServerFn(claimInvitation);
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (ruaj) sessionStorage.setItem(CLAIM_KEY, ruaj);
  }, [ruaj]);

  useEffect(() => {
    if (!session) return;
    const token = sessionStorage.getItem(CLAIM_KEY);
    (async () => {
      if (token) {
        sessionStorage.removeItem(CLAIM_KEY);
        try {
          await claim({ data: { token } });
          toast.success("Ftesa u ruajt në llogarinë tuaj.");
        } catch (e) {
          toast.error(e instanceof Error ? e.message : "Ftesa nuk u ruajt.");
        }
      }
      navigate({ to: "/ngjarjet", replace: true });
    })();
  }, [session, claim, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error("Email ose fjalëkalim i gabuar.");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/hyr` },
        });
        if (error) throw new Error(error.message);
        if (!data.session) setSent(true);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Diçka shkoi keq.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/hyr`,
    });
    if (r.error) toast.error("Hyrja me Google dështoi.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="text-center">
          <Link to="/" className="font-display text-2xl text-primary">
            Ftesa Dasme
          </Link>
          <h1 className="mt-3 font-display text-3xl">
            {mode === "in" ? "Hyr në llogari" : "Krijo llogari"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {ruaj
              ? "Hyni dhe ftesa juaj ruhet përgjithmonë në llogari."
              : "Të gjitha ftesat tuaja në një vend."}
          </p>
        </div>
        {sent ? (
          <p className="rounded-md bg-muted p-4 text-center text-sm">
            Ju dërguam një email. Klikoni lidhjen në email për ta konfirmuar llogarinë, pastaj
            hyni këtu.
          </p>
        ) : (
          <>
            <Button variant="outline" className="w-full" onClick={google} type="button">
              Vazhdo me Google
            </Button>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> ose <span className="h-px flex-1 bg-border" />
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="em">Email</Label>
                <Input id="em" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pw">Fjalëkalimi</Label>
                <Input
                  id="pw"
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === "in" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Prisni…" : mode === "in" ? "Hyr" : "Krijo llogari"}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
              {mode === "in" ? "Nuk keni llogari?" : "Keni llogari?"}{" "}
              <button type="button" className="text-primary underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
                {mode === "in" ? "Regjistrohu" : "Hyr"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
