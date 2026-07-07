import "server-only";
import { db, latency } from "@/lib/mock/store";
import type { ListParams, Paginated } from "@/lib/types/common";
import type { DeliveryStatus } from "@/lib/types/database";
import type {
  Delivery,
  DeliveryDetail,
  DeliveryUpdate,
  DeliveryWithOrder,
  DeliveryWithUpdates,
} from "@/lib/types/delivery";
import { applyList } from "./helpers";

// MOCK IMPLEMENTATION - replace bodies with Supabase queries. Signatures are the contract.

function updatesFor(deliveryId: number): DeliveryUpdate[] {
  return db()
    .deliveryUpdates.filter((u) => u.deliveryId === deliveryId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function toWithOrder(delivery: Delivery): DeliveryWithOrder {
  const data = db();
  const order = data.orders.find((o) => o.orderId === delivery.orderId);
  const customer = order
    ? data.customers.find((c) => c.customerId === order.customerId)
    : undefined;
  return {
    ...delivery,
    customerName: customer?.fullName ?? "Unknown",
    orderTotal: order?.totalAmount ?? 0,
  };
}

export async function getDeliveries(
  params?: ListParams & { status?: DeliveryStatus },
): Promise<Paginated<DeliveryWithOrder>> {
  await latency();
  let rows = db().deliveries;
  if (params?.status) rows = rows.filter((d) => d.status === params.status);

  return applyList(rows.map(toWithOrder), params, {
    search: (d) => `${d.customerName} ${d.courierName ?? ""} ${d.trackingNum ?? ""}`,
    sorters: {
      deliveryId: (d) => d.deliveryId,
      customerName: (d) => d.customerName,
      status: (d) => d.status,
    },
    defaultSort: "deliveryId",
    defaultDir: "desc",
  });
}

export async function getDeliveryById(id: number): Promise<DeliveryDetail | null> {
  await latency();
  const delivery = db().deliveries.find((d) => d.deliveryId === id);
  if (!delivery) return null;
  return { ...toWithOrder(delivery), updates: updatesFor(id) };
}

/** Used by order detail; no extra latency - called alongside other reads. */
export async function getDeliveryByOrderId(orderId: number): Promise<DeliveryWithUpdates | null> {
  const delivery = db().deliveries.find((d) => d.orderId === orderId);
  if (!delivery) return null;
  return { ...delivery, updates: updatesFor(delivery.deliveryId) };
}
