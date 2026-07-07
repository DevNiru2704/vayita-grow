"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { company } from "@/lib/config/company";
import { requireSession } from "@/lib/auth/guards";
import { isSupabase } from "@/lib/db/source";
import { recordActivity } from "@/lib/mock/activity";
import { db, latency, nextId, nowIso } from "@/lib/mock/store";
import * as customersPg from "@/lib/services/customers.pg";
import type { ActionResult } from "@/lib/types/common";
import { CUSTOMER_STATUSES } from "@/lib/types/database";
import type { CustomerInput } from "@/lib/types/customer";

// Validation + auth run here; data access dispatches to the mock store or
// Postgres (lib/services/customers.pg.ts) based on DATA_SOURCE.

const customerSchema = z.object({
  fullName: z.string().trim().min(3, "Business name must be at least 3 characters").max(150),
  email: z.string().trim().email("Enter a valid email").or(z.literal("")),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{7,17}$/, "Enter a valid phone number"),
  address: z.string().trim().min(5, "Address is required"),
  state: z.enum(company.operatingStates, "Select an operating state"),
  status: z.enum(CUSTOMER_STATUSES),
});

function revalidateCustomerRoutes(): void {
  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard");
}

export async function createCustomer(input: CustomerInput): Promise<ActionResult<{ id: number }>> {
  const session = await requireSession();
  const parsed = customerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  if (isSupabase) return customersPg.createCustomer(parsed.data, session);
  await latency();

  const store = db();
  if (store.customers.some((c) => c.phone === parsed.data.phone)) {
    return {
      ok: false,
      error: "Validation failed.",
      fieldErrors: { phone: ["A client with this phone number already exists"] },
    };
  }

  const customerId = nextId(store.customers, "customerId");
  store.customers.push({
    customerId,
    ...parsed.data,
    email: parsed.data.email || null,
    createdAt: nowIso(),
  });

  recordActivity(session.userId, "CREATE", "SYSTEM", customerId);
  revalidateCustomerRoutes();
  return { ok: true, data: { id: customerId } };
}

export async function updateCustomer(id: number, input: CustomerInput): Promise<ActionResult> {
  const session = await requireSession();
  const parsed = customerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  if (isSupabase) return customersPg.updateCustomer(id, parsed.data, session);
  await latency();

  const store = db();
  const customer = store.customers.find((c) => c.customerId === id);
  if (!customer) return { ok: false, error: "Client not found." };

  if (store.customers.some((c) => c.customerId !== id && c.phone === parsed.data.phone)) {
    return {
      ok: false,
      error: "Validation failed.",
      fieldErrors: { phone: ["A client with this phone number already exists"] },
    };
  }

  Object.assign(customer, parsed.data, { email: parsed.data.email || null });
  recordActivity(session.userId, "UPDATE", "SYSTEM", id);
  revalidateCustomerRoutes();
  revalidatePath(`/dashboard/clients/${id}`);
  return { ok: true, data: undefined };
}

export async function addCustomerNote(
  customerId: number,
  noteText: string,
): Promise<ActionResult> {
  const session = await requireSession();

  const trimmed = noteText.trim();
  if (trimmed.length < 5) {
    return {
      ok: false,
      error: "Validation failed.",
      fieldErrors: { noteText: ["Note must be at least 5 characters"] },
    };
  }
  if (isSupabase) return customersPg.addCustomerNote(customerId, trimmed, session);
  await latency();

  const store = db();
  if (!store.customers.some((c) => c.customerId === customerId)) {
    return { ok: false, error: "Client not found." };
  }

  store.customerNotes.push({
    noteId: nextId(store.customerNotes, "noteId"),
    customerId,
    createdBy: session.userId,
    createdByUsername: session.username,
    noteText: trimmed,
    createdAt: nowIso(),
  });

  recordActivity(session.userId, "CREATE", "SYSTEM", customerId);
  revalidatePath(`/dashboard/clients/${customerId}`);
  return { ok: true, data: undefined };
}
