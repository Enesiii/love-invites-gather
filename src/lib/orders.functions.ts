import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ORDER_STATUSES, orderSchema } from "./order-validation";

export const submitOrderRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => orderSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("order_requests")
      .insert({
        style: data.style,
        category: data.style.startsWith("k-") ? "kanagjegji" : data.style.startsWith("s-") ? "syneti" : "wedding",
        partner_one: data.partner_one,
        partner_two: data.partner_two,
        wedding_date: data.wedding_date,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email || null,
        notes: data.notes || null,
      })
      .select("id")
      .single();
    if (error || !row) {
      console.error("submitOrderRequest failed", error);
      throw new Error("Porosia nuk u dërgua. Provoni përsëri.");
    }
    return { ok: true, id: row.id };
  });

function checkKey(key: string) {
  const expected = process.env["ADMIN_KEY"]?.trim();
  if (!expected || expected.length < 8 || key.trim() !== expected) {
    throw new Error("Kodi i administrimit nuk është i saktë.");
  }
}

const keySchema = z.object({ key: z.string().min(1).max(200) });

export const listAdminInvitations = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => keySchema.parse(input))
  .handler(async ({ data }) => {
    checkKey(data.key);
    const { setResponseHeader } = await import("@tanstack/react-start/server");
    setResponseHeader("Cache-Control", "no-store");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const fetchPage = (start: number) => supabaseAdmin
      .from("invitations")
      .select("id, manage_token, category, partner_one, partner_two, event_date, event_time, venue, theme, closed_at, created_at")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .range(start, start + 499);
    const first = await fetchPage(0);
    if (first.error) throw new Error("Ftesat nuk u ngarkuan. Provoni përsëri.");
    const rows = first.data ?? [];
    let pageSize = rows.length;
    while (pageSize === 500) {
      const next = await fetchPage(rows.length);
      if (next.error) throw new Error("Ftesat nuk u ngarkuan. Provoni përsëri.");
      pageSize = next.data?.length ?? 0;
      rows.push(...(next.data ?? []));
    }
    return rows;
  });

// Admin-only, permanent deletion. Children cascade (rsvps, event_photos,
// payment_orders, payment_audit_log); storage objects are removed first.
export const deleteAdminInvitation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => keySchema.extend({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    checkKey(data.key);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error: fetchError } = await supabaseAdmin
      .from("invitations")
      .select("id, cover_path")
      .eq("id", data.id)
      .single();
    if (fetchError || !row) throw new Error("Ftesa nuk u gjet.");
    const { data: photos } = await supabaseAdmin
      .from("event_photos")
      .select("path")
      .eq("invitation_id", data.id);
    const paths = [...(row.cover_path ? [row.cover_path] : []), ...(photos ?? []).map((p) => p.path)];
    if (paths.length) {
      const { error: storageError } = await supabaseAdmin.storage.from("event-photos").remove(paths);
      if (storageError) console.error("deleteAdminInvitation storage cleanup failed", storageError);
    }
    const { error } = await supabaseAdmin.from("invitations").delete().eq("id", data.id);
    if (error) {
      console.error("deleteAdminInvitation failed", error);
      throw new Error("Ftesa nuk u fshi. Provoni përsëri.");
    }
    return { ok: true };
  });

export const listOrderRequests = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => keySchema.parse(input))
  .handler(async ({ data }) => {
    checkKey(data.key);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("order_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error("Kërkesat nuk u ngarkuan.");
    return rows ?? [];
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    keySchema.extend({ id: z.string().uuid(), status: z.enum(ORDER_STATUSES) }).parse(input),
  )
  .handler(async ({ data }) => {
    checkKey(data.key);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("order_requests")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error("Statusi nuk u përditësua.");
    return { ok: true };
  });

export const deleteAdminOrderRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => keySchema.extend({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    checkKey(data.key);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: removed, error } = await supabaseAdmin.from("order_requests")
      .delete().eq("id", data.id).select("id").maybeSingle();
    if (error) throw new Error("Kërkesa nuk u fshi. Provoni përsëri.");
    if (!removed) throw new Error("Kërkesa nuk u gjet.");
    return { ok: true };
  });
