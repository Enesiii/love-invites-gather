import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const createSchema = z.object({
  partner_one: z.string().trim().min(1, "Shkruani emrin").max(60),
  partner_two: z.string().trim().min(1, "Shkruani emrin").max(60),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Zgjidhni datën").refine((d) => d >= new Date(Date.now() - 864e5).toISOString().slice(0, 10) && d.slice(0, 4) <= "2100", "Data e dasmës duhet të jetë në të ardhmen."),
  event_time: z.string().trim().min(1).max(10),
  venue: z.string().trim().min(1, "Shkruani vendin").max(120),
  address: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().max(500).optional().default(""),
  theme: z.enum(["rose", "sage", "night", "gold", "ivory", "blush"]),
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
        "id, partner_one, partner_two, event_date, event_time, venue, address, message, theme, closed_at",
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
      .select("id, closed_at")
      .eq("id", data.invitation_id)
      .maybeSingle();
    if (!inv) throw new Error("Ftesa nuk u gjet.");
    if (inv.closed_at) throw new Error("Kjo ftesë ka përfunduar.");
    const { error } = await supabaseAdmin.from("rsvps").insert({
      invitation_id: data.invitation_id,
      guest_name: data.guest_name,
      attending: data.attending,
      guest_count: data.attending ? data.guest_count : 0,
      note: data.note || null,
      // Përgjigjet nga ftesa presin gjithmonë aprovimin e menaxherit.
      approval: "pending",
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
      .select("id, partner_one, partner_two, event_date, event_time, venue, address, message, theme, expected_guests, closed_at")
      .eq("manage_token", data.token)
      .maybeSingle();
    if (!inv) return null;
    const { data: rsvps } = await supabaseAdmin
      .from("rsvps")
      .select("id, guest_name, attending, guest_count, note, created_at, approval")
      .eq("invitation_id", inv.id)
      .order("created_at", { ascending: false });
    const list = rsvps ?? [];
    const { data: photoRows } = await supabaseAdmin
      .from("event_photos")
      .select("id, path, created_at")
      .eq("invitation_id", inv.id)
      .order("created_at", { ascending: false });
    const photos: { id: string; url: string; kind: "image" | "video" }[] = [];
    for (const p of photoRows ?? []) {
      const { data: s } = await supabaseAdmin.storage
        .from("event-photos")
        .createSignedUrl(p.path, 3600);
      const kind = /\.(mp4|webm|mov)$/i.test(p.path) ? "video" : "image";
      if (s?.signedUrl) photos.push({ id: p.id, url: s.signedUrl, kind });
    }
    return {
      invitation: inv,
      rsvps: list,
      photos,
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
      : await supabaseAdmin
          .from("rsvps")
          .insert({ ...row, approval: "approved", invitation_id: invitationId });
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

export const setApproval = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        token: z.string().uuid(),
        id: z.string().uuid(),
        approval: z.enum(["pending", "approved", "rejected"]),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin, invitationId } = await invitationIdForToken(data.token);
    const { error } = await supabaseAdmin
      .from("rsvps")
      .update({ approval: data.approval })
      .eq("id", data.id)
      .eq("invitation_id", invitationId);
    if (error) throw new Error("Statusi nuk u ndryshua.");
    return { ok: true };
  });

export const setExpectedGuests = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        token: z.string().uuid(),
        expected_guests: z.number().int().min(0).max(2000),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin, invitationId } = await invitationIdForToken(data.token);
    const { error } = await supabaseAdmin
      .from("invitations")
      .update({ expected_guests: data.expected_guests })
      .eq("id", invitationId);
    if (error) {
      console.error("setExpectedGuests failed", error);
      throw new Error("Numri nuk u ruajt.");
    }
    return { ok: true };
  });

export const setInvitationClosed = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ token: z.string().uuid(), closed: z.boolean() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin, invitationId } = await invitationIdForToken(data.token);
    const { error } = await supabaseAdmin
      .from("invitations")
      .update({ closed_at: data.closed ? new Date().toISOString() : null })
      .eq("id", invitationId);
    if (error) {
      console.error("setInvitationClosed failed", error);
      throw new Error("Statusi i ftesës nuk u ndryshua.");
    }
    return { ok: true };
  });

export const updateInvitation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    createSchema.extend({ token: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin, invitationId } = await invitationIdForToken(data.token);
    const { token: _t, ...rest } = data;
    const { error } = await supabaseAdmin
      .from("invitations")
      .update({ ...rest, address: rest.address || null, message: rest.message || null })
      .eq("id", invitationId);
    if (error) throw new Error("Ngjarja nuk u përditësua.");
    return { ok: true };
  });

const MAX_PHOTO = 6 * 1024 * 1024;
export const uploadPhoto = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        token: z.string().uuid(),
        type: z.enum(["image/jpeg", "image/png", "image/webp"]),
        base64: z.string().min(10).max(Math.ceil((MAX_PHOTO * 4) / 3) + 8),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin, invitationId } = await invitationIdForToken(data.token);
    const bin = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const ext = data.type.split("/")[1];
    const path = `${invitationId}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabaseAdmin.storage
      .from("event-photos")
      .upload(path, bin, { contentType: data.type });
    if (error) throw new Error("Fotoja nuk u ngarkua.");
    await supabaseAdmin.from("event_photos").insert({ invitation_id: invitationId, path });
    return { ok: true };
  });

const MAX_GUEST_FILE = 6 * 1024 * 1024;
const GUEST_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
} as const;
export const uploadGuestMedia = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        invitation_id: z.string().uuid(),
        type: z.enum(Object.keys(GUEST_TYPES) as [keyof typeof GUEST_TYPES, ...(keyof typeof GUEST_TYPES)[]]),
        base64: z.string().min(10).max(Math.ceil((MAX_GUEST_FILE * 4) / 3) + 8),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: inv } = await supabaseAdmin
      .from("invitations")
      .select("id, closed_at")
      .eq("id", data.invitation_id)
      .maybeSingle();
    if (!inv) throw new Error("Ftesa nuk u gjet.");
    if (inv.closed_at) throw new Error("Kjo ftesë ka përfunduar.");
    const { count } = await supabaseAdmin
      .from("event_photos")
      .select("id", { count: "exact", head: true })
      .eq("invitation_id", inv.id);
    if ((count ?? 0) >= 500) throw new Error("Albumi është plot.");
    const bin = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const path = `${inv.id}/${crypto.randomUUID()}.${GUEST_TYPES[data.type]}`;
    const { error } = await supabaseAdmin.storage
      .from("event-photos")
      .upload(path, bin, { contentType: data.type });
    if (error) throw new Error("Skedari nuk u ngarkua.");
    await supabaseAdmin.from("event_photos").insert({ invitation_id: inv.id, path });
    return { ok: true };
  });

export const deletePhoto = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ token: z.string().uuid(), id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin, invitationId } = await invitationIdForToken(data.token);
    const { data: row } = await supabaseAdmin
      .from("event_photos")
      .select("path")
      .eq("id", data.id)
      .eq("invitation_id", invitationId)
      .maybeSingle();
    if (!row) throw new Error("Fotoja nuk u gjet.");
    await supabaseAdmin.storage.from("event-photos").remove([row.path]);
    await supabaseAdmin.from("event_photos").delete().eq("id", data.id);
    return { ok: true };
  });
