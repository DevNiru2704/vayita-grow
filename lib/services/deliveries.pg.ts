import "server-only";
import { revalidatePath } from "next/cache";
import { paginate } from "@/lib/db/list";
import { query, queryOne, withActor } from "@/lib/db/query";
import type { ActionResult, ListParams, Paginated } from "@/lib/types/common";
import type { DeliveryStatus } from "@/lib/types/database";
import type {
  Delivery,
  DeliveryDetail,
  DeliveryInput,
  DeliveryUpdate,
  DeliveryUpdateInput,
  DeliveryWithOrder,
  DeliveryWithUpdates,
} from "@/lib/types/delivery";
import type { SessionUser } from "@/lib/types/user";

const SELECT = `
  SELECT d.delivery_id, d.order_id, d.courier_name, d.tracking_num, d.status, d.delivered_at,
         c.full_name AS customer_name, o.total_amount AS order_total
  FROM deliveries d
  JOIN orders o ON o.order_id = d.order_id
  JOIN customers c ON c.customer_id = o.customer_id`;

function updatesFor(deliveryId: number): Promise<DeliveryUpdate[]> {
  return query<DeliveryUpdate>(
    `SELECT update_id, delivery_id, status, location, updated_at
     FROM delivery_updates WHERE delivery_id = $1 ORDER BY updated_at DESC`,
    [deliveryId],
  );
}

export async function getDeliveries(
  params?: ListParams & { status?: DeliveryStatus },
): Promise<Paginated<DeliveryWithOrder>> {
  return paginate<DeliveryWithOrder>(
    {
      select: SELECT,
      where: params?.status ? ["d.status = $1"] : [],
      params: params?.status ? [params.status] : [],
      searchColumns: ["c.full_name", "d.courier_name", "d.tracking_num"],
      sorters: { deliveryId: "d.delivery_id", customerName: "c.full_name", status: "d.status" },
      defaultSort: "deliveryId",
      defaultDir: "desc",
    },
    params,
  );
}

export async function getDeliveryById(id: number): Promise<DeliveryDetail | null> {
  const delivery = await queryOne<DeliveryWithOrder>(`${SELECT} WHERE d.delivery_id = $1`, [id]);
  if (!delivery) return null;
  return { ...delivery, updates: await updatesFor(id) };
}

export async function getDeliveryByOrderId(orderId: number): Promise<DeliveryWithUpdates | null> {
  const delivery = await queryOne<Delivery>(
    `SELECT delivery_id, order_id, courier_name, tracking_num, status, delivered_at
     FROM deliveries WHERE order_id = $1`,
    [orderId],
  );
  if (!delivery) return null;
  return { ...delivery, updates: await updatesFor(delivery.deliveryId) };
}

function revalidateDeliveryRoutes(orderId?: number): void {
  revalidatePath("/dashboard/deliveries");
  revalidatePath("/dashboard/orders");
  if (orderId) revalidatePath(`/dashboard/orders/${orderId}`);
}

export async function createDelivery(
  data: DeliveryInput,
  session: SessionUser,
): Promise<ActionResult<{ id: number }>> {
  const order = await queryOne<{ orderId: number; status: string }>(
    "SELECT order_id, status FROM orders WHERE order_id = $1",
    [data.orderId],
  );
  if (!order) return { ok: false, error: "Order not found." };
  if (order.status === "Cancelled") {
    return { ok: false, error: "Cannot create a delivery for a cancelled order." };
  }
  if (await queryOne("SELECT 1 FROM deliveries WHERE order_id = $1", [data.orderId])) {
    return { ok: false, error: "This order already has a delivery." };
  }

  const id = await withActor(session.userId, async (c) => {
    const { rows } = await c.query(
      `INSERT INTO deliveries (order_id, courier_name, tracking_num, status, delivered_at)
       VALUES ($1, $2, $3, 'Dispatching', NULL) RETURNING delivery_id`,
      [data.orderId, data.courierName, data.trackingNum],
    );
    const deliveryId = rows[0].delivery_id as number;
    await c.query(
      "INSERT INTO delivery_updates (delivery_id, status, location) VALUES ($1, 'Dispatching', $2)",
      [deliveryId, "Warehouse, Ranchi"],
    );
    if (order.status === "Pending" || order.status === "Processing") {
      await c.query("UPDATE orders SET status = 'Shipped', updated_by = $1 WHERE order_id = $2", [
        session.userId,
        data.orderId,
      ]);
    }
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'CREATE', 'DELIVERY', $2)",
      [session.userId, deliveryId],
    );
    return deliveryId;
  });

  revalidateDeliveryRoutes(order.orderId);
  return { ok: true, data: { id } };
}

export async function addDeliveryUpdate(
  data: DeliveryUpdateInput,
  session: SessionUser,
): Promise<ActionResult> {
  const delivery = await queryOne<{ deliveryId: number; orderId: number }>(
    "SELECT delivery_id, order_id FROM deliveries WHERE delivery_id = $1",
    [data.deliveryId],
  );
  if (!delivery) return { ok: false, error: "Delivery not found." };

  await withActor(session.userId, async (c) => {
    await c.query("INSERT INTO delivery_updates (delivery_id, status, location) VALUES ($1, $2, $3)", [
      data.deliveryId,
      data.status,
      data.location,
    ]);
    if (data.status === "Delivered") {
      await c.query("UPDATE deliveries SET status = $1, delivered_at = NOW() WHERE delivery_id = $2", [
        data.status,
        data.deliveryId,
      ]);
      await c.query("UPDATE orders SET status = 'Delivered', updated_by = $1 WHERE order_id = $2", [
        session.userId,
        delivery.orderId,
      ]);
    } else {
      await c.query("UPDATE deliveries SET status = $1 WHERE delivery_id = $2", [
        data.status,
        data.deliveryId,
      ]);
    }
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'UPDATE', 'DELIVERY', $2)",
      [session.userId, data.deliveryId],
    );
  });

  revalidateDeliveryRoutes(delivery.orderId);
  revalidatePath(`/dashboard/deliveries/${data.deliveryId}`);
  return { ok: true, data: undefined };
}
