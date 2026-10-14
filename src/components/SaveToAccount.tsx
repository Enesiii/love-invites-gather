import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { claimInvitation, getOwnership } from "@/lib/account.functions";
import { useSession } from "@/hooks/use-session";

export function SaveToAccount({ token }: { token: string }) {
  const session = useSession();
  const qc = useQueryClient();
  const own = useServerFn(getOwnership);
  const claim = useServerFn(claimInvitation);
  const [busy, setBusy] = useState(false);
  const q = useQuery({
    queryKey: ["ownership", token, session?.user.id],
    queryFn: () => own({ data: { token } }),
    enabled: !!session,
  });

  if (session === undefined || (session && !q.data)) return null;
  if (q.data?.mine) return null;

  async function save() {
    setBusy(true);
    try {
      await claim({ data: { token } });
      toast.success("Ftesa u ruajt në llogarinë tuaj.");
      qc.invalidateQueries({ queryKey: ["ownership", token] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ftesa nuk u ruajt.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-start gap-2 text-sm">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        Ruajeni këtë ftesë në llogari që të mos e humbni panelin — hyni kurdo me email ose Google.
      </p>
      {session ? (
        <Button size="sm" onClick={save} disabled={busy}>
          Ruaje në llogari
        </Button>
      ) : (
        <Button size="sm" asChild>
          <Link to="/hyr" search={{ ruaj: token }}>
            Ruaje në llogari
          </Link>
        </Button>
      )}
    </div>
  );
}
