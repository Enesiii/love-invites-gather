import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

async function getAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

function checkKey(key: string) {
  const expected = process.env["ADMIN_KEY"]?.trim();
  if (!expected || expected.length < 8 || key.trim() !== expected) {
    throw new Error("Kodi i administrimit nuk është i saktë.");
  }
}

const rsvpIdSchema = z.object({ rsvpId: z.string().uuid() });

// Mysafiri zgjodhi një opsion kalendari pas konfirmimit — ruajet për statistikat e adminit.
export const recordCalendarChoice = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    rsvpIdSchema.extend({ choice: z.enum(["google", "ics"]) }).parse(input),
  )
  .handler(async ({ data }) => {
    const supabaseAdmin = await getAdmin();
    const { error } = await supabaseAdmin
      .from("rsvps")
      .update({ calendar_added: data.choice })
      .eq("id", data.rsvpId)
      .eq("attending", true)
      .is("calendar_added", null);
    if (error) console.error("recordCalendarChoice failed", error);
    return { ok: true };
  });

const pushSchema = rsvpIdSchema.extend({
  endpoint: z.string().url().max(1000),
  p256dh: z.string().min(10).max(300),
  auth: z.string().min(5).max(300),
  userAgent: z.string().max(300).optional().default(""),
});

// Ruaj abonimin push të mysafirit — vetëm për RSVP që konfirmuan pjesëmarrjen.
export const savePushSubscription = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => pushSchema.parse(input))
  .handler(async ({ data }) => {
    const supabaseAdmin = await getAdmin();
    const { data: rsvp } = await supabaseAdmin
      .from("rsvps")
      .select("id, invitation_id, attending, invitations(activated_at, closed_at, event_date)")
      .eq("id", data.rsvpId)
      .maybeSingle();
    const inv = rsvp?.invitations as { activated_at: string | null; closed_at: string | null; event_date: string } | null;
    if (!rsvp || !rsvp.attending || !inv?.activated_at || inv.closed_at) {
      throw new Error("Abonimi nuk u ruajt.");
    }
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Belgrade" }).format(new Date());
    if (inv.event_date <= today) throw new Error("Dasma ka përfunduar.");
    const { data: settings } = await supabaseAdmin
      .from("reminder_settings")
      .select("push_enabled")
      .eq("id", true)
      .maybeSingle();
    if (settings && settings.push_enabled === false) throw new Error("Njoftimet janë çaktivizuar.");
    const { error } = await supabaseAdmin.from("push_subscriptions").upsert(
      {
        endpoint: data.endpoint,
        invitation_id: rsvp.invitation_id,
        rsvp_id: rsvp.id,
        p256dh: data.p256dh,
        auth: data.auth,
        user_agent: data.userAgent || null,
      },
      { onConflict: "endpoint" },
    );
    if (error) {
      console.error("savePushSubscription failed", error);
      throw new Error("Abonimi nuk u ruajt. Provoni përsëri.");
    }
    await supabaseAdmin.from("rsvps").update({ push_status: "subscribed" }).eq("id", rsvp.id);
    return { ok: true };
  });

// Mysafiri refuzoi njoftimet — ruajet që të mos i kërkohet përsëri.
export const declinePush = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => rsvpIdSchema.parse(input))
  .handler(async ({ data }) => {
    const supabaseAdmin = await getAdmin();
    await supabaseAdmin
      .from("rsvps")
      .update({ push_status: "declined" })
      .eq("id", data.rsvpId)
      .is("push_status", null);
    return { ok: true };
  });

const keySchema = z.object({ key: z.string().min(1).max(200) });

// Statistikat e "Wedding Reminders" për panelin e administratorit.
export const getReminderStats = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => keySchema.parse(input))
  .handler(async ({ data }) => {
    checkKey(data.key);
    const supabaseAdmin = await getAdmin();
    const count = async (table: "rsvps" | "push_subscriptions" | "reminder_notifications", build: (q: any) => any) => {
      const { count: c } = await build(supabaseAdmin.from(table).select("id", { count: "exact", head: true }));
      return c ?? 0;
    };
    const [confirmedGuests, calendarAdds, pushSubscriptions, pushDeclined, sent, failed, skipped] =
      await Promise.all([
        count("rsvps", (q) => q.eq("attending", true).eq("approval", "approved")),
        count("rsvps", (q) => q.not("calendar_added", "is", null)),
        count("push_subscriptions", (q) => q),
        count("rsvps", (q) => q.eq("push_status", "declined")),
        count("reminder_notifications", (q) => q.eq("status", "sent")),
        count("reminder_notifications", (q) => q.eq("status", "failed")),
        count("reminder_notifications", (q) => q.eq("status", "skipped")),
      ]);
    const { data: recent } = await supabaseAdmin
      .from("reminder_notifications")
      .select("id, kind, status, error, created_at, invitations(partner_one, partner_two)")
      .order("created_at", { ascending: false })
      .limit(20);
    const { data: settings } = await supabaseAdmin
      .from("reminder_settings")
      .select("push_enabled")
      .eq("id", true)
      .maybeSingle();
    return {
      confirmedGuests,
      calendarAdds,
      pushSubscriptions,
      pushDeclined,
      sent,
      failed,
      skipped,
      pushEnabled: settings ? settings.push_enabled : true,
      recent: (recent ?? []).map((r) => ({
        id: r.id as string,
        kind: r.kind as string,
        status: r.status as string,
        error: (r.error as string | null) ?? null,
        created_at: r.created_at as string,
        couple: r.invitations
          ? `${(r.invitations as { partner_one: string }).partner_one} & ${(r.invitations as { partner_two: string }).partner_two}`
          : "—",
      })),
    };
  });

// Aktivizo/çaktivizo njoftimet push (kalendarët mbeten gjithmonë aktivë).
export const setPushEnabled = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => keySchema.extend({ enabled: z.boolean() }).parse(input))
  .handler(async ({ data }) => {
    checkKey(data.key);
    const supabaseAdmin = await getAdmin();
    const { error } = await supabaseAdmin
      .from("reminder_settings")
      .upsert({ id: true, push_enabled: data.enabled });
    if (error) throw new Error("Cilësimi nuk u ruajt.");
    return { ok: true };
  });
