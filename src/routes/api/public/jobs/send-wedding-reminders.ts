import { createFileRoute } from "@tanstack/react-router";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";

// Dërgon kujtesat e dasmës 10 dhe 3 ditë para eventit (zona Europe/Belgrade).
// Idempotent: një rresht unik për abonim+kujtesë parandalon dërgimet e dyfishta.
export const Route = createFileRoute("/api/public/jobs/send-wedding-reminders")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authFailure = await authenticateCronRequest(request);
        if (authFailure) return authFailure;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: settings } = await supabaseAdmin
          .from("reminder_settings")
          .select("push_enabled")
          .eq("id", true)
          .maybeSingle();
        if (settings && settings.push_enabled === false) {
          return Response.json({ success: true, disabled: true });
        }

        const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Belgrade" }).format(new Date());
        const addDays = (date: string, days: number) => {
          const d = new Date(`${date}T12:00:00Z`);
          d.setUTCDate(d.getUTCDate() + days);
          return d.toISOString().slice(0, 10);
        };
        const targets = [
          { kind: "10d" as const, date: addDays(today, 10) },
          { kind: "3d" as const, date: addDays(today, 3) },
        ];

        const vapidPublic = process.env["VAPID_PUBLIC_KEY"]?.trim();
        const vapidPrivate = process.env["VAPID_PRIVATE_KEY"]?.trim();
        const results = { sent: 0, failed: 0, skipped: 0, gone: 0 };

        for (const target of targets) {
          const { data: invitations } = await supabaseAdmin
            .from("invitations")
            .select("id, partner_one, partner_two")
            .eq("event_date", target.date)
            .not("activated_at", "is", null)
            .is("closed_at", null);

          for (const inv of invitations ?? []) {
            const { data: subs } = await supabaseAdmin
              .from("push_subscriptions")
              .select("id, endpoint, p256dh, auth, rsvps!inner(attending, approval)")
              .eq("invitation_id", inv.id)
              .eq("rsvps.attending", true)
              .eq("rsvps.approval", "approved");

            for (const sub of subs ?? []) {
              // Rezervo rreshtin e parë: nëse ekziston, kjo kujtesë u dërgua/provua më parë.
              const { data: inserted, error: insertError } = await supabaseAdmin
                .from("reminder_notifications")
                .insert({
                  subscription_id: sub.id,
                  invitation_id: inv.id,
                  kind: target.kind,
                  status: "skipped",
                  error: "pending",
                })
                .select("id")
                .maybeSingle();
              if (insertError || !inserted) {
                results.skipped++;
                continue;
              }

              if (!vapidPublic || !vapidPrivate) {
                await supabaseAdmin
                  .from("reminder_notifications")
                  .update({ status: "skipped", error: "vapid_not_configured" })
                  .eq("id", inserted.id);
                results.skipped++;
                continue;
              }

              const title = target.kind === "10d" ? "Dasma po afrohet! 💍" : "Edhe 3 ditë deri te dasma! ❤️";
              const body =
                target.kind === "10d"
                  ? `Kanë mbetur edhe 10 ditë deri te dasma e ${inv.partner_one} & ${inv.partner_two}. Ju presim me kënaqësi!`
                  : `Dasma e ${inv.partner_one} & ${inv.partner_two} po afrohet. Përgatituni për një ditë të veçantë!`;

              const { sendWebPush } = await import("@/lib/web-push.server");
              const res = await sendWebPush(
                { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
                JSON.stringify({ title, body, url: `/ftesa/${inv.id}` }),
                { publicKey: vapidPublic, privateKey: vapidPrivate, subject: "mailto:info@ftesa-jone.com" },
              );

              if (res.ok) {
                await supabaseAdmin
                  .from("reminder_notifications")
                  .update({ status: "sent", error: null })
                  .eq("id", inserted.id);
                results.sent++;
              } else {
                await supabaseAdmin
                  .from("reminder_notifications")
                  .update({ status: "failed", error: `[${res.status}] ${res.error}`.slice(0, 400) })
                  .eq("id", inserted.id);
                results.failed++;
                if (res.gone) {
                  await supabaseAdmin.from("push_subscriptions").delete().eq("id", sub.id);
                  results.gone++;
                }
              }
            }
          }
        }

        return Response.json({ success: true, ...results });
      },
    },
  },
});
