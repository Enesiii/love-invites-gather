import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({ rpc: vi.fn(), from: vi.fn(), delete: vi.fn(), eq: vi.fn(), select: vi.fn(), maybeSingle: vi.fn() }));
vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => ({ inputValidator: (validate: (input: unknown) => unknown) => ({ handler: (handler: (args: { data: unknown }) => unknown) => (args: { data: unknown }) => handler({ data: validate(args.data) }) }) }),
}));
vi.mock("@/integrations/supabase/client.server", () => ({ supabaseAdmin: db }));

import { deleteAdminOrderRequest } from "@/lib/orders.functions";
import { deleteAdminPaymentOrder } from "@/lib/payments.functions";
import { deleteAdminReminder } from "@/lib/reminders.functions";

const id = "00000000-0000-4000-8000-000000000001";
describe("admin-only record deletion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("ADMIN_KEY", "test-admin-only-key");
    db.rpc.mockResolvedValue({ data: true, error: null });
    db.from.mockReturnValue(db);
    db.delete.mockReturnValue(db);
    db.eq.mockReturnValue(db);
    db.select.mockReturnValue(db);
    db.maybeSingle.mockResolvedValue({ data: { id }, error: null });
  });
  it.each([deleteAdminOrderRequest, deleteAdminPaymentOrder, deleteAdminReminder])("rejects non-admin deletion before accessing records", async (remove) => {
    await expect(remove({ data: { key: "incorrect-key", id } })).rejects.toThrow("Kodi i administrimit");
    expect(db.rpc).not.toHaveBeenCalled();
    expect(db.from).not.toHaveBeenCalled();
  });
  it("allows admin payment deletion without restricting paid orders", async () => {
    await expect(deleteAdminPaymentOrder({ data: { key: "test-admin-only-key", id } })).resolves.toEqual({ ok: true });
    expect(db.rpc).toHaveBeenCalledWith("delete_admin_payment_order", { p_id: id });
  });
  it("deletes only the selected request", async () => {
    await deleteAdminOrderRequest({ data: { key: "test-admin-only-key", id } });
    expect(db.from).toHaveBeenCalledWith("order_requests");
    expect(db.eq).toHaveBeenCalledWith("id", id);
  });
  it("removes reminder subscriptions to prevent recreated sends", async () => {
    await deleteAdminReminder({ data: { key: "test-admin-only-key", id } });
    expect(db.rpc).toHaveBeenCalledWith("delete_admin_reminder_subscription", { p_notification_id: id });
  });
  it("reports payment deletion failures instead of success", async () => {
    db.rpc.mockResolvedValue({ data: null, error: { message: "failed" } });
    await expect(deleteAdminPaymentOrder({ data: { key: "test-admin-only-key", id } })).rejects.toThrow("Porosia nuk u fshi");
  });
});