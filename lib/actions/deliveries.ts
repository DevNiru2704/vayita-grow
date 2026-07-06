"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { recordActivity } from "@/lib/mock/activity";
import { db, latency, nextId, nowIso } from "@/lib/mock/store";
import type { ActionResult } from "@/lib/types/common";
import { DELIVERY_STATUSES } from "@/lib/types/database";
import type { DeliveryInput, DeliveryUpdateInput } from "@/lib/types/delivery";

// MOCK IMPLEMENTATION - replace store mutations with Supabase queries.

const deliverySchema = z.object({
  orderId: z.number().int().positive(),
  courierName: z.string().trim().min(2, "Courier name is required").max(150),
  trackingNum: z.string().trim().min(2, "Tracking number is required").max(100),
});

function revalidateDeliveryRoutes(orderId?: number): void {
  revalidatePath("/dashboard/deliveries");
  revalidatePath("/dashboard/orders");
  if (orderId) revalidatePath(`/dashboard/orders/${orderId}`);
}

export async function createDelivery(input: DeliveryInput): Promise<ActionResult<{ id: number }>> {
  const session = await requireSession();
  await latency();
  const parsed = deliverySchema.safeParse(input);
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
  if (order.status === "Cancelled") {
    return { ok: false, error: "Cannot create a delivery for a cancelled order." };
  }
  if (store.deliveries.some((d) => d.orderId === order.orderId)) {
    return { ok: false, error: "This order already has a delivery." };
  }

  const deliveryId = nextId(store.deliveries, "deliveryId");
  store.deliveries.push({
    deliveryId,
    orderId: order.orderId,
    courierName: parsed.data.courierName,
    trackingNum: parsed.data.trackingNum,
    status: "Dispatching",
    deliveredAt: null,
  });
  store.deliveryUpdates.push({
    updateId: nextId(store.deliveryUpdates, "updateId"),
    deliveryId,
    status: "Dispatching",
    location: "Warehouse, Ranchi",
    updatedAt: nowIso(),
  });

  // Dispatching a delivery moves the order forward.
  if (order.status === "Pending" || order.status === "Processing") {
    order.status = "Shipped";
    order.updatedBy = session.userId;
  }

  recordActivity(session.userId, "CREATE", "DELIVERY", deliveryId);
  revalidateDeliveryRoutes(order.orderId);
  return { ok: true, data: { id: deliveryId } };
}

const updateSchema = z.object({
  deliveryId: z.number().int().positive(),
  status: z.enum(DELIVERY_STATUSES),
  location: z.string().trim().min(2, "Location is required").max(255),
});

export async function addDeliveryUpdate(input: DeliveryUpdateInput): Promise<ActionResult> {
  const session = await requireSession();
  await latency();
  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const store = db();
  const delivery = store.deliveries.find((d) => d.deliveryId === parsed.data.deliveryId);
  if (!delivery) return { ok: false, error: "Delivery not found." };

  store.deliveryUpdates.push({
    updateId: nextId(store.deliveryUpdates, "updateId"),
    deliveryId: delivery.deliveryId,
    status: parsed.data.status,
    location: parsed.data.location,
    updatedAt: nowIso(),
  });

  delivery.status = parsed.data.status;
  const order = store.orders.find((o) => o.orderId === delivery.orderId);
  if (parsed.data.status === "Delivered") {
    delivery.deliveredAt = nowIso();
    if (order) {
      order.status = "Delivered";
      order.updatedBy = session.userId;
    }
  }

  recordActivity(session.userId, "UPDATE", "DELIVERY", delivery.deliveryId);
  revalidateDeliveryRoutes(delivery.orderId);
  revalidatePath(`/dashboard/deliveries/${delivery.deliveryId}`);
  return { ok: true, data: undefined };
}
