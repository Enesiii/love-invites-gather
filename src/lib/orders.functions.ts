import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const orderSchema = z.object({
  style: z.enum(["rose", "sage", "night"]),
  partner_one: z.string().trim().min(1, "Shkruani emrin").max(60),
  partner_two: z.string().trim().min(1, "Shkruani emrin").max(60),
  wedding_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Zgjidhni datën e dasmës"),
  contact_phone: z
    .string()
    .trim()
    .min(6, "Shkruani numrin e telefonit")
    .max(30)
    .regex(/^[0-9+()\s-]+$/, "Numri i telefonit nuk është i vlefshëm"),
  contact_email: z.string().trim().email("Email i pavlefshëm").max(255).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().default(""),
});

export const submitOrderRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => orderSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("order_requests")
      .insert({
        style: data.style,
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
