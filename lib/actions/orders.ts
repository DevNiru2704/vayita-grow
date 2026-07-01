"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { recordActivity } from "@/lib/mock/activity";
import { db, latency, nextId, nowIso } from "@/lib/mock/store";
import type { ActionResult } from "@/lib/types/common";
import { ORDER_STATUSES, PAYMENT_METHODS, type OrderStatus } from "@/lib/types/database";
import type { OrderInput, PaymentInput } from "@/lib/types/order";

// MOCK IMPLEMENTATION - replace store mutations with Supabase queries.

const orderSchema = z.object({
  customerId: z.number().int().positive("Select a client"),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().min(1, "Quantity must be at least 1").max(10000),
      }),
    )
    .min(1, "Add at least one item"),
});

function revalidateOrderRoutes(): void {
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");
}

export async function createOrder(input: OrderInput): Promise<ActionResult<{ id: number }>> {
  const session = await requireSession();
  await latency();
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const store = db();
  if (!store.customers.some((c) => c.customerId === parsed.data.customerId)) {
    return { ok: false, error: "Client not found." };
  }

  // De-duplicate product lines by summing quantities.
  const quantities = new Map<number, number>();
  for (const item of parsed.data.items) {
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }

  const lines: { productId: number; quantity: number; unitPrice: number }[] = [];
  for (const [productId, quantity] of quantities) {
    const product = store.products.find((p) => p.productId === productId);
    if (!product) return { ok: false, error: `Product #${productId} not found.` };
    // Lock the unit price at creation time, per DB semantics.
    lines.push({ productId, quantity, unitPrice: product.basePrice });
  }

  const orderId = nextId(store.orders, "orderId");
  const totalAmount = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);

  store.orders.push({
    orderId,
    customerId: parsed.data.customerId,
    status: "Pending",
    totalAmount,
    createdBy: session.userId,
    updatedBy: null,
    createdAt: nowIso(),
  });
  for (const line of lines) {
    store.orderItems.push({ itemId: nextId(store.orderItems, "itemId"), orderId, ...line });
  }

  recordActivity(session.userId, "CREATE", "ORDER", orderId);
  revalidateOrderRoutes();
  return { ok: true, data: { id: orderId } };
}

export async function updateOrderStatus(
  orderId: number,
  status: OrderStatus,
): Promise<ActionResult> {
  const session = await requireSession();
  await latency();
  if (!ORDER_STATUSES.includes(status)) {
    return { ok: false, error: "Invalid order status." };
  }

  const order = db().orders.find((o) => o.orderId === orderId);
  if (!order) return { ok: false, error: "Order not found." };

  order.status = status;
  order.updatedBy = session.userId;

  recordActivity(session.userId, "UPDATE", "ORDER", orderId);
  revalidateOrderRoutes();
  revalidatePath(`/dashboard/orders/${orderId}`);
  return { ok: true, data: undefined };
}

const paymentSchema = z.object({
  orderId: z.number().int().positive(),
  amount: z.number().positive("Amount must be positive"),
  paymentMethod: z.enum(PAYMENT_METHODS),
});

export async function recordPayment(input: PaymentInput): Promise<ActionResult> {
  const session = await requireSession();
  await latency();
  const parsed = paymentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const store = db();
  const order = store.orders.find((o) => o.orderId === parsed.data.orderId);
  if (!order) return { ok: false, error: "Order not found." };

  const paid = store.payments
    .filter((p) => p.orderId === order.orderId && p.paymentStatus === "Completed")
    .reduce((sum, p) => sum + p.amount, 0);
  if (paid + parsed.data.amount > order.totalAmount) {
    return {
      ok: false,
      error: "Validation failed.",
      fieldErrors: { amount: ["Payment would exceed the order total"] },
    };
  }

  store.payments.push({
    paymentId: nextId(store.payments, "paymentId"),
    orderId: order.orderId,
    amount: parsed.data.amount,
    paymentMethod: parsed.data.paymentMethod,
    paymentStatus: "Completed",
    processedAt: nowIso(),
  });

  recordActivity(session.userId, "UPDATE", "ORDER", order.orderId);
  revalidatePath(`/dashboard/orders/${order.orderId}`);
  return { ok: true, data: undefined };
}
