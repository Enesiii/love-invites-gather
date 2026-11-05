// Logjika e përbashkët e porosive me pagesë bankare — e sigurt për shfletues dhe server.
import { PRICING } from "@/lib/site-config";
import { isPremiumTheme } from "@/lib/themes";

export type PaymentPackage = "classic" | "premium";

export const PAYMENT_ORDER_STATUSES = ["pending_payment", "paid", "cancelled", "expired"] as const;
export type PaymentOrderStatus = (typeof PAYMENT_ORDER_STATUSES)[number];

export const PAYMENT_STATUS_LABELS: Record<PaymentOrderStatus, string> = {
  pending_payment: "Në pritje të pagesës",
  paid: "E paguar",
  cancelled: "E anuluar",
  expired: "E skaduar",
};

export const PACKAGE_LABELS: Record<PaymentPackage, string> = {
  classic: "Paketa Klasike",
  premium: "Paketa Premium",
};

export function packageForTheme(theme: string): PaymentPackage {
  return isPremiumTheme(theme) ? "premium" : "classic";
}

export function amountForPackage(pkg: PaymentPackage): number {
  const found = PRICING.packages.find((p) => p.id === pkg);
  if (!found) throw new Error(`Paketa e panjohur: ${pkg}`);
  return found.price;
}

export type InvitationCategory = "wedding" | "kanagjegji" | "syneti";
export const CATEGORY_LABELS: Record<InvitationCategory, string> = {
  wedding: "Ftesa Jonë",
  kanagjegji: "Ftesa Kanagjegji",
  syneti: "Ftesa Syneti",
};
export function categoryOf(v: unknown): InvitationCategory {
  return v === "kanagjegji" ? "kanagjegji" : v === "syneti" ? "syneti" : "wedding";
}
export function packageLabel(category: unknown, pkg: string) {
  const base = PACKAGE_LABELS[pkg as PaymentPackage] ?? pkg;
  const c = categoryOf(category);
  return c === "kanagjegji" ? `${base} · Kanagjegji` : c === "syneti" ? `Ftesa Syneti` : base;
}

export const ORDER_NUMBER_PATTERN = /^FD-\d{4}-\d{6}$/;
