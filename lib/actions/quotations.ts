"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth/guards";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { isSupabase } from "@/lib/db/source";
import { contactInbox, sendEmail } from "@/lib/email/resend";
import { quotationEmail } from "@/lib/email/templates";
import { formatINR } from "@/lib/format";
import { recordActivity } from "@/lib/mock/activity";
import { db, latency, nextId, nowIso } from "@/lib/mock/store";
import * as quotationsPg from "@/lib/services/quotations.pg";
import type { ActionResult } from "@/lib/types/common";
import { QUOTATION_STATUSES, type QuotationStatus } from "@/lib/types/database";
import type { QuotationInput } from "@/lib/types/quotation";

// Validation + auth run here; data access dispatches to mock or Postgres
// (lib/services/quotations.pg.ts) based on DATA_SOURCE.

const quotationSchema = z.object({
  customerId: z.number().int().positive("Select a client"),
  validUntil: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  notes: z.string().trim().max(1000).nullable(),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().min(1, "Quantity must be at least 1").max(10000),
      }),
    )
    .min(1, "Add at least one item"),
});

export async function createQuotation(input: QuotationInput): Promise<ActionResult<{ id: number }>> {
  const session = await requireRole(ADMIN_ROLES);
  const parsed = quotationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  if (isSupabase) return quotationsPg.createQuotation(parsed.data, session);
  await latency();

  const store = db();
  if (!store.customers.some((c) => c.customerId === parsed.data.customerId)) {
    return { ok: false, error: "Client not found." };
  }

  const quantities = new Map<number, number>();
  for (const item of parsed.data.items) {
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }
  const lines: { productId: number; quantity: number; unitPrice: number }[] = [];
  for (const [productId, quantity] of quantities) {
    const product = store.products.find((p) => p.productId === productId);
    if (!product) return { ok: false, error: `Product #${productId} not found.` };
    lines.push({ productId, quantity, unitPrice: product.basePrice });
  }

  const quotationId = nextId(store.quotations, "quotationId");
  const totalAmount = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);
  store.quotations.push({
    quotationId,
    quotationNumber: `QT-${new Date().getFullYear()}-${String(quotationId).padStart(3, "0")}`,
    customerId: parsed.data.customerId,
    createdBy: session.userId,
    assignedStaffId: null,
    status: "Draft",
    totalAmount,
    validUntil: parsed.data.validUntil,
    notes: parsed.data.notes,
    createdAt: nowIso(),
  });
  for (const line of lines) {
    store.quotationItems.push({ itemId: nextId(store.quotationItems, "itemId"), quotationId, ...line });
  }

  recordActivity(session.userId, "CREATE", "QUOTATION", quotationId);
  revalidatePath("/dashboard/quotations");
  return { ok: true, data: { id: quotationId } };
}

export async function updateQuotationStatus(
  quotationId: number,
  status: QuotationStatus,
): Promise<ActionResult> {
  const session = await requireRole(ADMIN_ROLES);
  if (!QUOTATION_STATUSES.includes(status)) return { ok: false, error: "Invalid status." };
  if (isSupabase) return quotationsPg.updateQuotationStatus(quotationId, status, session);
  await latency();

  const quotation = db().quotations.find((q) => q.quotationId === quotationId);
  if (!quotation) return { ok: false, error: "Quotation not found." };
  quotation.status = status;
  recordActivity(session.userId, "UPDATE", "QUOTATION", quotationId);
  revalidatePath("/dashboard/quotations");
  revalidatePath(`/dashboard/quotations/${quotationId}`);
  return { ok: true, data: undefined };
}

export async function sendQuotationToStaff(
  quotationId: number,
  staffId: number,
): Promise<ActionResult> {
  const session = await requireRole(ADMIN_ROLES);
  if (!Number.isInteger(staffId) || staffId <= 0) {
    return { ok: false, error: "Select a staff member." };
  }
  if (isSupabase) return quotationsPg.sendQuotationToStaff(quotationId, staffId, session);
  await latency();

  const store = db();
  const quotation = store.quotations.find((q) => q.quotationId === quotationId);
  if (!quotation) return { ok: false, error: "Quotation not found." };
  const staff = store.users.find((u) => u.userId === staffId);
  if (!staff) return { ok: false, error: "Selected staff member not found." };

  quotation.assignedStaffId = staffId;
  quotation.status = "Sent";

  const inbox = contactInbox();
  if (inbox) {
    const customerName =
      store.customers.find((c) => c.customerId === quotation.customerId)?.fullName ?? "Unknown";
    await sendEmail({
      to: inbox,
      subject: `Quotation ${quotation.quotationNumber} assigned to ${staff.username}`,
      html: quotationEmail({
        quotationNumber: quotation.quotationNumber,
        customerName,
        total: formatINR(quotation.totalAmount),
        validUntil: quotation.validUntil,
        assignedBy: session.username,
        notes: quotation.notes,
      }),
    });
  }

  recordActivity(session.userId, "UPDATE", "QUOTATION", quotationId);
  revalidatePath("/dashboard/quotations");
  revalidatePath(`/dashboard/quotations/${quotationId}`);
  return { ok: true, data: undefined };
}
