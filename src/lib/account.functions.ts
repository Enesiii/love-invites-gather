import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Lists invitations owned by the signed-in user, including their private panel token.
export const listMyInvitations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("invitations")
      .select("id, partner_one, partner_two, event_date, venue, theme, manage_token")
      .eq("owner_id", context.userId)
      .order("event_date", { ascending: true });
    return data ?? [];
  });

// Links an invitation to the signed-in user. Requires the secret panel token (proof of ownership).
export const claimInvitation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ token: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: inv } = await supabaseAdmin
      .from("invitations")
      .select("id, owner_id")
      .eq("manage_token", data.token)
      .maybeSingle();
    if (!inv) throw new Error("Ftesa nuk u gjet.");
    if (inv.owner_id && inv.owner_id !== context.userId) {
      throw new Error("Kjo ftesë është ruajtur tashmë në një llogari tjetër.");
    }
    if (!inv.owner_id) {
      await supabaseAdmin
        .from("invitations")
        .update({ owner_id: context.userId })
        .eq("id", inv.id);
    }
    return { ok: true };
  });

export const getOwnership = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ token: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: inv } = await supabaseAdmin
      .from("invitations")
      .select("owner_id")
      .eq("manage_token", data.token)
      .maybeSingle();
    return { mine: !!inv && inv.owner_id === context.userId, owned: !!inv?.owner_id };
  });
