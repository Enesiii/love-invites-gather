import { z } from "zod";

export const ORDER_STATUSES = ["new", "contacted", "confirmed", "cancelled"] as const;
export const ORDER_STATUS_LABELS: Record<(typeof ORDER_STATUSES)[number], string> = {
  new: "E re",
  contacted: "U kontaktua",
  confirmed: "E konfirmuar",
  cancelled: "E anuluar",
};

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export const orderSchema = z.object({
  style: z.enum(["rose", "sage", "night"]),
  partner_one: z.string().trim().min(1, "Shkruani emrin e parë").max(60),
  partner_two: z.string().trim().min(1, "Shkruani emrin e dytë").max(60),
  wedding_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Zgjidhni datën e dasmës")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Data nuk është e vlefshme")
    .refine((v) => v >= todayIso(), "Data e dasmës nuk mund të jetë në të kaluarën")
    .refine((v) => {
      const max = new Date();
      max.setFullYear(max.getFullYear() + 3);
      return new Date(v) <= max;
    }, "Data duhet të jetë brenda 3 viteve"),
  contact_phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^\+?[0-9()\s-]+$/, "Numri i telefonit nuk është i vlefshëm")
    .refine((v) => {
      const n = v.replace(/\D/g, "").length;
      return n >= 8 && n <= 15;
    }, "Numri duhet të ketë 8–15 shifra"),
  contact_email: z.string().trim().email("Email i pavlefshëm").max(255).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().default(""),
});
