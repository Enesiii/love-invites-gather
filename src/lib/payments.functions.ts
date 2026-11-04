import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  PACKAGE_LABELS,
  amountForPackage,
  packageForTheme,
  type PaymentOrderStatus,
} from "@/lib/payment-shared";
import { WHATSAPP_NUMBER } from "@/lib/site-config";
import { isThemeId } from "@/lib/themes";

type AdminClient = Awaited<ReturnType<typeof getAdmin>>;
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

const keySchema = z.object({ key: z.string().min(1).max(200) });

const DEFAULT_SETTINGS = {
  bank_name: "",
  beneficiary: "",
  iban: "",
  whatsapp_number: WHATSAPP_NUMBER,
  support_email: "",
  instructions: "",
  order_expiration_days: 7,
};

async function getSettings(supabase: AdminClient) {
  const { data } = await supabase.from("payment_settings").select("*").eq("id", true).maybeSingle();
  if (!data) return { ...DEFAULT_SETTINGS };
  return {
    bank_name: data.bank_name,
    beneficiary: data.beneficiary,
    iban: data.iban,
    whatsapp_number: data.whatsapp_number || WHATSAPP_NUMBER,
    support_email: data.support_email,
    instructions: data.instructions,
    order_expiration_days: data.order_expiration_days,
  };
}

// Skadim "i dembel": porositë e papaguara pas afatit shënohen të skaduara kur lexohen.
async function expireOverdue(supabase: AdminClient) {
  const { data: due } = await supabase
    .from("payment_orders")
    .select("id")
    .eq("status", "pending_payment")
    .not("expires_at", "is", null)
    .lt("expires_at", new Date().toISOString())
    .limit(50);
  for (const row of due ?? []) {
    const { data: updated } = await supabase
      .from("payment_orders")
      .update({ status: "expired" })
      .eq("id", row.id)
      .eq("status", "pending_payment")
      .select("id");
    if (updated?.length) {
      await supabase.from("payment_audit_log").insert({
        order_id: row.id,
        old_status: "pending_payment",
        new_status: "expired",
        actor: "system",
        note: "Afati i pagesës përfundoi",
      });
    }
  }
}

async function audit(supabase: AdminClient, orderId: string, oldStatus: string | null, newStatus: string, actor: string, note?: string) {
  await supabase.from("payment_audit_log").insert({
    order_id: orderId,
    old_status: oldStatus,
    new_status: newStatus,
    actor,
    note: note ?? null,
  });
}

function originOf(requestUrl: string) {
  try {
    return new URL(requestUrl).origin;
  } catch {
    return "";
  }
}

// --- Krijimi i porosisë (thirret menjëherë pas krijimit të ftesës) ---

export const createPaymentOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ token: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const supabase = await getAdmin();
    const { data: inv } = await supabase
      .from("invitations")
      .select("id, theme")
      .eq("manage_token", data.token)
      .maybeSingle();
    if (!inv) throw new Error("Ftesa nuk u gjet.");
    // Idempotent: një porosi për çdo ftesë.
    const { data: existing } = await supabase
      .from("payment_orders")
      .select("access_token")
      .eq("invitation_id", inv.id)
      .maybeSingle();
    if (existing) return { orderToken: existing.access_token };
    const settings = await getSettings(supabase);
    const pkg = packageForTheme(isThemeId(inv.theme) ? inv.theme : "rose");
    const days = Math.min(Math.max(settings.order_expiration_days, 1), 90);
    const { data: numRow, error: numErr } = await supabase.rpc("next_order_number");
    if (numErr || !numRow) {
      console.error("next_order_number failed", numErr);
      throw new Error("Numri i porosisë nuk u gjenerua. Provoni përsëri.");
    }
    const { data: order, error } = await supabase
      .from("payment_orders")
      .insert({
        order_number: numRow,
        invitation_id: inv.id,
        package: pkg,
        amount: amountForPackage(pkg),
        expires_at: new Date(Date.now() + days * 864e5).toISOString(),
      })
      .select("id, access_token")
      .single();
    if (error || !order) {
      console.error("createPaymentOrder failed", error);
      throw new Error("Porosia nuk u krijua. Provoni përsëri.");
    }
    await audit(supabase, order.id, null, "pending_payment", "system", "Porosia u krijua");
    return { orderToken: order.access_token };
  });

// --- Faqja e pagesës së klientit (autorizuar me access_token) ---

const pageTokenSchema = z.object({ token: z.string().uuid() });

export const getPaymentPage = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => pageTokenSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = await getAdmin();
    await expireOverdue(supabase);
    const { data: order } = await supabase
      .from("payment_orders")
      .select("id, order_number, package, amount, currency, status, customer_name, customer_email, customer_phone, expires_at, created_at, invitation_id")
      .eq("access_token", data.token)
      .maybeSingle();
    if (!order) return null;
    const { data: inv } = await supabase
      .from("invitations")
      .select("id, partner_one, partner_two, event_date, manage_token")
      .eq("id", order.invitation_id)
      .maybeSingle();
    if (!inv) return null;
    const settings = await getSettings(supabase);
    const paid = order.status === "paid";
    return {
      order: {
        order_number: order.order_number,
        package: order.package as "classic" | "premium",
        package_label: PACKAGE_LABELS[order.package as "classic" | "premium"],
        amount: Number(order.amount),
        currency: order.currency,
        status: order.status as PaymentOrderStatus,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        expires_at: order.expires_at,
      },
      invitation: {
        partner_one: inv.partner_one,
        partner_two: inv.partner_two,
        event_date: inv.event_date,
      },
      settings,
      // Lidhjet publikohen vetëm pasi pagesa të konfirmohet.
      links: paid
        ? { invitationPath: `/ftesa/${inv.id}`, dashboardPath: `/menaxho/${inv.manage_token}` }
        : null,
    };
  });

const contactSchema = z.object({
  token: z.string().uuid(),
  name: z.string().trim().min(1, "Shkruani emrin e plotë").max(100),
  email: z.string().trim().email("Email i pavlefshëm").max(255),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^\+?[0-9()\s-]+$/, "Numri i telefonit nuk është i vlefshëm")
    .refine((v) => {
      const n = v.replace(/\D/g, "").length;
      return n >= 8 && n <= 15;
    }, "Numri duhet të ketë 8–15 shifra"),
});

export const submitPaymentContact = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = await getAdmin();
    const { data: order } = await supabase
      .from("payment_orders")
      .select("id, order_number, package, amount, currency, status, payment_email_sent_at")
      .eq("access_token", data.token)
      .maybeSingle();
    if (!order) throw new Error("Porosia nuk u gjet.");
    if (order.status !== "pending_payment") throw new Error("Kjo porosi nuk pranon më të dhëna kontakti.");
    const { error } = await supabase
      .from("payment_orders")
      .update({ customer_name: data.name, customer_email: data.email, customer_phone: data.phone })
      .eq("id", order.id);
    if (error) throw new Error("Të dhënat nuk u ruajtën. Provoni përsëri.");
    // Email-i dërgohet vetëm një herë — rifreskimi i faqes nuk dërgon dublikata.
    if (!order.payment_email_sent_at) {
      const settings = await getSettings(supabase);
      const { sendEmail, paymentInstructionsEmail } = await import("@/lib/email.server");
      const msg = paymentInstructionsEmail({
        customerName: data.name,
        orderNumber: order.order_number,
        packageLabel: PACKAGE_LABELS[order.package as "classic" | "premium"],
        amount: `${order.amount} ${order.currency}`,
        settings,
      });
      const result = await sendEmail({ to: data.email, subject: msg.subject, html: msg.html });
      await supabase
        .from("payment_orders")
        .update({
          payment_email_sent_at: result.ok ? new Date().toISOString() : null,
          payment_email_status: result.status,
        })
        .eq("id", order.id);
      return { ok: true, email: result.status };
    }
    return { ok: true, email: "already_sent" as const };
  });

// Parapamje private e ftesës para pagesës — vetëm përmes tokenit të porosisë.
export const getPaymentPreview = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => pageTokenSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = await getAdmin();
    const { data: order } = await supabase
      .from("payment_orders")
      .select("invitation_id")
      .eq("access_token", data.token)
      .maybeSingle();
    if (!order) return null;
    const { data: row } = await supabase
      .from("invitations")
      .select("id, partner_one, partner_two, event_date, event_time, venue, address, message, theme, cover_path, cover_pos_x, cover_pos_y, cover_zoom")
      .eq("id", order.invitation_id)
      .maybeSingle();
    if (!row) return null;
    const { cover_path, ...rest } = row;
    const cover_url = cover_path
      ? (await supabase.storage.from("event-photos").createSignedUrl(cover_path, 3600)).data?.signedUrl ?? null
      : null;
    return { ...rest, cover_url, gallery: [] as string[] };
  });

// --- Administrimi ---

export const listPaymentOrders = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => keySchema.parse(input))
  .handler(async ({ data }) => {
    checkKey(data.key);
    const { setResponseHeader } = await import("@tanstack/react-start/server");
    setResponseHeader("Cache-Control", "no-store");
    const supabase = await getAdmin();
    await expireOverdue(supabase);
    const { data: rows, error } = await supabase
      .from("payment_orders")
      .select("id, order_number, package, amount, currency, status, customer_name, customer_email, customer_phone, created_at, paid_at, expires_at, payment_email_status, confirmation_email_status, invitation_id, invitations(partner_one, partner_two, event_date)")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      console.error("listPaymentOrders failed", error);
      throw new Error("Porositë nuk u ngarkuan.");
    }
    const list = rows ?? [];
    const stats = {
      total: list.length,
      pending: list.filter((o) => o.status === "pending_payment").length,
      paid: list.filter((o) => o.status === "paid").length,
      cancelled: list.filter((o) => o.status === "cancelled").length,
      expired: list.filter((o) => o.status === "expired").length,
      revenue: list.filter((o) => o.status === "paid").reduce((s, o) => s + Number(o.amount), 0),
    };
    return { orders: list, stats };
  });

export const confirmPayment = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => keySchema.extend({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    checkKey(data.key);
    const supabase = await getAdmin();
    // Idempotent: vetëm një porosi "pending_payment" mund të shënohet e paguar.
    const { data: updated } = await supabase
      .from("payment_orders")
      .update({ status: "paid", paid_at: new Date().toISOString(), confirmed_by: "admin" })
      .eq("id", data.id)
      .eq("status", "pending_payment")
      .select("id, order_number, package, amount, currency, customer_name, customer_email, invitation_id, confirmation_email_sent_at")
      .maybeSingle();
    if (!updated) {
      const { data: current } = await supabase.from("payment_orders").select("status").eq("id", data.id).maybeSingle();
      if (current?.status === "paid") return { ok: true, already: true };
      throw new Error("Porosia nuk është në pritje të pagesës.");
    }
    // Aktivizo ftesën: linku publik dhe paneli i mysafirëve çkyçen.
    await supabase
      .from("invitations")
      .update({ activated_at: new Date().toISOString() })
      .eq("id", updated.invitation_id)
      .is("activated_at", null);
    await audit(supabase, updated.id, "pending_payment", "paid", "admin", "Pagesa u konfirmua manualisht");
    // Email-i i konfirmimit dërgohet vetëm një herë.
    if (updated.customer_email && !updated.confirmation_email_sent_at) {
      const { getRequest } = await import("@tanstack/react-start/server");
      const origin = originOf(getRequest().url);
      const { data: inv } = await supabase
        .from("invitations")
        .select("id, manage_token")
        .eq("id", updated.invitation_id)
        .maybeSingle();
      if (inv) {
        const settings = await getSettings(supabase);
        const { sendEmail, paymentConfirmedEmail } = await import("@/lib/email.server");
        const msg = paymentConfirmedEmail({
          customerName: updated.customer_name ?? "",
          orderNumber: updated.order_number,
          packageLabel: PACKAGE_LABELS[updated.package as "classic" | "premium"],
          amount: `${updated.amount} ${updated.currency}`,
          invitationUrl: `${origin}/ftesa/${inv.id}`,
          dashboardUrl: `${origin}/menaxho/${inv.manage_token}`,
          whatsapp: settings.whatsapp_number,
        });
        const result = await sendEmail({ to: updated.customer_email, subject: msg.subject, html: msg.html });
        await supabase
          .from("payment_orders")
          .update({
            confirmation_email_sent_at: result.ok ? new Date().toISOString() : null,
            confirmation_email_status: result.status,
          })
          .eq("id", updated.id);
      }
    }
    return { ok: true, already: false };
  });

export const setPaymentOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    keySchema.extend({ id: z.string().uuid(), action: z.enum(["cancel", "reactivate"]) }).parse(input),
  )
  .handler(async ({ data }) => {
    checkKey(data.key);
    const supabase = await getAdmin();
    const { data: order } = await supabase
      .from("payment_orders")
      .select("id, status")
      .eq("id", data.id)
      .maybeSingle();
    if (!order) throw new Error("Porosia nuk u gjet.");
    if (data.action === "cancel") {
      if (order.status === "paid") throw new Error("Porosia e paguar nuk mund të anulohet.");
      if (order.status === "cancelled") return { ok: true };
      await supabase.from("payment_orders").update({ status: "cancelled" }).eq("id", order.id);
      await audit(supabase, order.id, order.status, "cancelled", "admin", "Porosia u anulua");
      return { ok: true };
    }
    // Riaktivizimi: kthehet në pritje të pagesës me afat të ri.
    if (order.status === "pending_payment") return { ok: true };
    if (order.status === "paid") throw new Error("Porosia e paguar nuk ka nevojë për riaktivizim.");
    const settings = await getSettings(supabase);
    const days = Math.min(Math.max(settings.order_expiration_days, 1), 90);
    await supabase
      .from("payment_orders")
      .update({ status: "pending_payment", expires_at: new Date(Date.now() + days * 864e5).toISOString() })
      .eq("id", order.id);
    await audit(supabase, order.id, order.status, "pending_payment", "admin", "Porosia u riaktivizua");
    return { ok: true };
  });

export const resendPaymentEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => keySchema.extend({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    checkKey(data.key);
    const supabase = await getAdmin();
    const { data: order } = await supabase
      .from("payment_orders")
      .select("id, order_number, package, amount, currency, customer_name, customer_email, status")
      .eq("id", data.id)
      .maybeSingle();
    if (!order) throw new Error("Porosia nuk u gjet.");
    if (!order.customer_email) throw new Error("Porosia nuk ka email të klientit.");
    const settings = await getSettings(supabase);
    const { sendEmail, paymentInstructionsEmail } = await import("@/lib/email.server");
    const msg = paymentInstructionsEmail({
      customerName: order.customer_name ?? "",
      orderNumber: order.order_number,
      packageLabel: PACKAGE_LABELS[order.package as "classic" | "premium"],
      amount: `${order.amount} ${order.currency}`,
      settings,
    });
    const result = await sendEmail({ to: order.customer_email, subject: msg.subject, html: msg.html });
    await supabase
      .from("payment_orders")
      .update({
        payment_email_sent_at: result.ok ? new Date().toISOString() : null,
        payment_email_status: result.status,
      })
      .eq("id", order.id);
    if (!result.ok && result.status === "failed") throw new Error("Email-i nuk u dërgua. Provoni përsëri.");
    return { ok: true, email: result.status };
  });

export const getPaymentSettingsAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => keySchema.parse(input))
  .handler(async ({ data }) => {
    checkKey(data.key);
    const supabase = await getAdmin();
    return getSettings(supabase);
  });

const settingsSchema = keySchema.extend({
  bank_name: z.string().trim().max(120),
  beneficiary: z.string().trim().max(120),
  iban: z.string().trim().max(64),
  whatsapp_number: z.string().trim().max(20).regex(/^[0-9]*$/, "Vetëm shifra, me prefiksin e shtetit"),
  support_email: z.string().trim().email("Email i pavlefshëm").max(255).or(z.literal("")),
  instructions: z.string().trim().max(1000),
  order_expiration_days: z.number().int().min(1).max(90),
});

export const savePaymentSettings = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => settingsSchema.parse(input))
  .handler(async ({ data }) => {
    checkKey(data.key);
    const supabase = await getAdmin();
    const { key: _k, ...fields } = data;
    const { error } = await supabase
      .from("payment_settings")
      .upsert({ id: true, ...fields, updated_at: new Date().toISOString() });
    if (error) {
      console.error("savePaymentSettings failed", error);
      throw new Error("Cilësimet nuk u ruajtën.");
    }
    return { ok: true };
  });
