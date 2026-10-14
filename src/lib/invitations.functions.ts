import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const createSchema = z.object({
  partner_one: z.string().trim().min(1, "Shkruani emrin").max(60),
  partner_two: z.string().trim().min(1, "Shkruani emrin").max(60),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Zgjidhni datën"),
  event_time: z.string().trim().min(1).max(10),
  venue: z.string().trim().min(1, "Shkruani vendin").max(120),
  address: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().max(500).optional().default(""),
  theme: z.enum(["rose", "sage", "night"]),
});

export const createInvitation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => createSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("invitations")
      .insert({
        ...data,
        address: data.address || null,
        message: data.message || null,
      })
      .select("id, manage_token")
      .single();
    if (error || !row) {
      console.error("createInvitation failed", error);
      throw new Error("Ftesa nuk u krijua. Provoni përsëri.");
    }
    return { id: row.id, token: row.manage_token };
  });

const idSchema = z.object({ id: z.string().uuid() });

export const getInvitation = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => idSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("invitations")
      .select(
        "id, partner_one, partner_two, event_date, event_time, venue, address, message, theme",
      )
      .eq("id", data.id)
      .maybeSingle();
    return row;
  });

const rsvpSchema = z.object({
  invitation_id: z.string().uuid(),
  guest_name: z.string().trim().min(1, "Shkruani emrin tuaj").max(80),
  attending: z.boolean(),
  guest_count: z.number().int().min(1).max(10),
  note: z.string().trim().max(300).optional().default(""),
});

export const submitRsvp = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => rsvpSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: inv } = await supabaseAdmin
      .from("invitations")
      .select("id")
      .eq("id", data.invitation_id)
      .maybeSingle();
    if (!inv) throw new Error("Ftesa nuk u gjet.");
    const { error } = await supabaseAdmin.from("rsvps").insert({
      invitation_id: data.invitation_id,
      guest_name: data.guest_name,
      attending: data.attending,
      guest_count: data.attending ? data.guest_count : 0,
      note: data.note || null,
    });
    if (error) {
      console.error("submitRsvp failed", error);
      throw new Error("Përgjigja nuk u ruajt. Provoni përsëri.");
    }
    return { ok: true };
  });

const tokenSchema = z.object({ token: z.string().uuid() });

export const getManageData = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => tokenSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: inv } = await supabaseAdmin
      .from("invitations")
      .select("id, partner_one, partner_two, event_date, event_time, venue")
      .eq("manage_token", data.token)
      .maybeSingle();
    if (!inv) return null;
    const { data: rsvps } = await supabaseAdmin
      .from("rsvps")
      .select("id, guest_name, attending, guest_count, note, created_at")
      .eq("invitation_id", inv.id)
      .order("created_at", { ascending: false });
    const list = rsvps ?? [];
    return {
      invitation: inv,
      rsvps: list,
      attendingGuests: list.filter((r) => r.attending).reduce((s, r) => s + r.guest_count, 0),
      attendingResponses: list.filter((r) => r.attending).length,
      declined: list.filter((r) => !r.attending).length,
    };
  });

const guestSchema = z.object({
  token: z.string().uuid(),
  id: z.string().uuid().optional(),
  guest_name: z.string().trim().min(1, "Shkruani emrin").max(80),
  attending: z.boolean(),
  guest_count: z.number().int().min(1).max(20),
  note: z.string().trim().max(300).optional().default(""),
});

async function invitationIdForToken(token: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("invitations")
    .select("id")
    .eq("manage_token", token)
    .maybeSingle();
  if (!data) throw new Error("Paneli nuk u gjet.");
  return { supabaseAdmin, invitationId: data.id };
}

export const saveGuest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => guestSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin, invitationId } = await invitationIdForToken(data.token);
    const row = {
      guest_name: data.guest_name,
      attending: data.attending,
      guest_count: data.attending ? data.guest_count : 0,
      note: data.note || null,
    };
    const { error } = data.id
      ? await supabaseAdmin
          .from("rsvps")
          .update(row)
          .eq("id", data.id)
          .eq("invitation_id", invitationId)
      : await supabaseAdmin.from("rsvps").insert({ ...row, invitation_id: invitationId });
    if (error) {
      console.error("saveGuest failed", error);
      throw new Error("Mysafiri nuk u ruajt.");
    }
    return { ok: true };
  });

export const deleteGuest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ token: z.string().uuid(), id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin, invitationId } = await invitationIdForToken(data.token);
    const { error } = await supabaseAdmin
      .from("rsvps")
      .delete()
      .eq("id", data.id)
      .eq("invitation_id", invitationId);
    if (error) throw new Error("Mysafiri nuk u hoq.");
    return { ok: true };
  });
