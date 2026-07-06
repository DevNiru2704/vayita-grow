"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { recordActivity } from "@/lib/mock/activity";
import { db, latency, nextId, nowIso } from "@/lib/mock/store";
import type { ActionResult } from "@/lib/types/common";
import type { StockAdjustmentInput, SupplierInput } from "@/lib/types/inventory";

// MOCK IMPLEMENTATION - replace store mutations with Supabase queries.

const adjustmentSchema = z.object({
  inventoryId: z.number().int().positive(),
  changeAmount: z
    .number()
    .int()
    .refine((v) => v !== 0, "Change amount cannot be zero"),
  reason: z.string().trim().min(3, "Reason is required").max(150),
});

export async function adjustStock(input: StockAdjustmentInput): Promise<ActionResult> {
  const session = await requireSession();
  await latency();
  const parsed = adjustmentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const store = db();
  const record = store.inventory.find((i) => i.inventoryId === parsed.data.inventoryId);
  if (!record) return { ok: false, error: "Inventory record not found." };

  const newQuantity = record.quantity + parsed.data.changeAmount;
  if (newQuantity < 0) {
    return {
      ok: false,
      error: "Validation failed.",
      fieldErrors: {
        changeAmount: [`Only ${record.quantity} units in stock - cannot go negative`],
      },
    };
  }

  record.quantity = newQuantity;
  record.lastUpdated = nowIso();
  store.inventoryLogs.push({
    logId: nextId(store.inventoryLogs, "logId"),
    inventoryId: record.inventoryId,
    userId: session.userId,
    changeAmount: parsed.data.changeAmount,
    reason: parsed.data.reason,
    createdAt: nowIso(),
  });

  recordActivity(session.userId, "UPDATE", "INVENTORY", record.inventoryId);
  revalidatePath("/dashboard/inventory");
  revalidatePath("/dashboard");
  return { ok: true, data: undefined };
}

const supplierSchema = z.object({
  companyName: z.string().trim().min(3, "Company name is required").max(150),
  contactEmail: z.string().trim().email("Enter a valid email").or(z.literal("")),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{7,17}$/, "Enter a valid phone number")
    .or(z.literal("")),
});

export async function createSupplier(input: SupplierInput): Promise<ActionResult<{ id: number }>> {
  const session = await requireSession();
  await latency();
  const parsed = supplierSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const store = db();
  const supplierId = nextId(store.suppliers, "supplierId");
  store.suppliers.push({
    supplierId,
    companyName: parsed.data.companyName,
    contactEmail: parsed.data.contactEmail || null,
    phone: parsed.data.phone || null,
  });

  recordActivity(session.userId, "CREATE", "INVENTORY", supplierId);
  revalidatePath("/dashboard/suppliers");
  return { ok: true, data: { id: supplierId } };
}

export async function updateSupplier(id: number, input: SupplierInput): Promise<ActionResult> {
  const session = await requireSession();
  await latency();
  const parsed = supplierSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const supplier = db().suppliers.find((s) => s.supplierId === id);
  if (!supplier) return { ok: false, error: "Supplier not found." };

  Object.assign(supplier, {
    companyName: parsed.data.companyName,
    contactEmail: parsed.data.contactEmail || null,
    phone: parsed.data.phone || null,
  });

  recordActivity(session.userId, "UPDATE", "INVENTORY", id);
  revalidatePath("/dashboard/suppliers");
  return { ok: true, data: undefined };
}
