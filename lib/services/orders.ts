import "server-only";
import { db, latency } from "@/lib/mock/store";
import type { ListParams, Paginated } from "@/lib/types/common";
import type { OrderStatus } from "@/lib/types/database";
import type { Order, OrderDetail, OrderItemWithProduct, OrderWithCustomer } from "@/lib/types/order";
import { getDeliveryByOrderId } from "./deliveries";
import { applyList } from "./helpers";

// MOCK IMPLEMENTATION - replace bodies with Supabase queries. Signatures are the contract.

function toWithCustomer(order: Order): OrderWithCustomer {
  const data = db();
  return {
    ...order,
    customerName:
      data.customers.find((c) => c.customerId === order.customerId)?.fullName ?? "Unknown",
    itemCount: data.orderItems.filter((i) => i.orderId === order.orderId).length,
  };
}

export async function getOrders(
  params?: ListParams & { status?: OrderStatus; customerId?: number },
): Promise<Paginated<OrderWithCustomer>> {
  await latency();
  let rows = db().orders;
  if (params?.status) rows = rows.filter((o) => o.status === params.status);
  if (params?.customerId) rows = rows.filter((o) => o.customerId === params.customerId);

  return applyList(rows.map(toWithCustomer), params, {
    search: (o) => `${o.orderId} ${o.customerName} ${o.status}`,
    sorters: {
      createdAt: (o) => o.createdAt,
      totalAmount: (o) => o.totalAmount,
      customerName: (o) => o.customerName,
      status: (o) => o.status,
    },
    defaultSort: "createdAt",
    defaultDir: "desc",
  });
}

export async function getOrderById(id: number): Promise<OrderDetail | null> {
  await latency();
  const data = db();
  const order = data.orders.find((o) => o.orderId === id);
  if (!order) return null;

  const items: OrderItemWithProduct[] = data.orderItems
    .filter((i) => i.orderId === id)
    .map((item) => {
      const product = data.products.find((p) => p.productId === item.productId);
      return { ...item, productName: product?.name ?? "Unknown", sku: product?.sku ?? "-" };
    });

  return {
    ...toWithCustomer(order),
    items,
    payments: data.payments
      .filter((p) => p.orderId === id)
      .sort((a, b) => (b.processedAt ?? "").localeCompare(a.processedAt ?? "")),
    delivery: await getDeliveryByOrderId(id),
    createdByUsername:
      data.users.find((u) => u.userId === order.createdBy)?.username ?? "unknown",
  };
}

export async function getOrderStats(): Promise<{
  byStatus: Record<OrderStatus, number>;
  revenueMTD: number;
}> {
  await latency();
  const orders = db().orders;
  const byStatus = {
    Pending: 0,
    Processing: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
  } satisfies Record<OrderStatus, number>;
  for (const order of orders) byStatus[order.status] += 1;

  const now = new Date();
  const monthPrefix = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const revenueMTD = orders
    .filter((o) => o.status !== "Cancelled" && o.createdAt.startsWith(monthPrefix))
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return { byStatus, revenueMTD };
}
