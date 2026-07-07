import "server-only";
import { revalidatePath } from "next/cache";
import { paginate } from "@/lib/db/list";
import { query, queryOne, withActor } from "@/lib/db/query";
import type { ActionResult, ListParams, Paginated } from "@/lib/types/common";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types/database";
import type {
  OrderDetail,
  OrderInput,
  OrderItemWithProduct,
  OrderWithCustomer,
  Payment,
  PaymentInput,
} from "@/lib/types/order";
import type { SessionUser } from "@/lib/types/user";
import { getDeliveryByOrderId } from "./deliveries.pg";

const LIST_SELECT = `
  SELECT o.order_id, o.customer_id, o.status, o.total_amount, o.created_by, o.updated_by, o.created_at,
         c.full_name AS customer_name, COALESCE(oi.item_count, 0)::int AS item_count
  FROM orders o
  JOIN customers c ON c.customer_id = o.customer_id
  LEFT JOIN (SELECT order_id, COUNT(*) AS item_count FROM order_items GROUP BY order_id) oi
    ON oi.order_id = o.order_id`;

export async function getOrders(
  params?: ListParams & { status?: OrderStatus; customerId?: number },
): Promise<Paginated<OrderWithCustomer>> {
  const where: string[] = [];
  const values: unknown[] = [];
  if (params?.status) {
    values.push(params.status);
    where.push(`o.status = $${values.length}`);
  }
  if (params?.customerId) {
    values.push(params.customerId);
    where.push(`o.customer_id = $${values.length}`);
  }

  return paginate<OrderWithCustomer>(
    {
      select: LIST_SELECT,
      where,
      params: values,
      searchColumns: ["o.order_id::text", "c.full_name", "o.status::text"],
      sorters: {
        createdAt: "o.created_at",
        totalAmount: "o.total_amount",
        customerName: "c.full_name",
        status: "o.status",
      },
      defaultSort: "createdAt",
      defaultDir: "desc",
    },
    params,
  );
}

export async function getOrderById(id: number): Promise<OrderDetail | null> {
  const order = await queryOne<OrderWithCustomer & { createdByUsername: string }>(
    `SELECT o.order_id, o.customer_id, o.status, o.total_amount, o.created_by, o.updated_by, o.created_at,
            c.full_name AS customer_name, u.username AS created_by_username,
            COALESCE(oi.item_count, 0)::int AS item_count
     FROM orders o
     JOIN customers c ON c.customer_id = o.customer_id
     JOIN users u ON u.user_id = o.created_by
     LEFT JOIN (SELECT order_id, COUNT(*) AS item_count FROM order_items GROUP BY order_id) oi
       ON oi.order_id = o.order_id
     WHERE o.order_id = $1`,
    [id],
  );
  if (!order) return null;

  const items = await query<OrderItemWithProduct>(
    `SELECT oi.item_id, oi.order_id, oi.product_id, oi.quantity, oi.unit_price,
            p.name AS product_name, p.sku
     FROM order_items oi
     JOIN products p ON p.product_id = oi.product_id
     WHERE oi.order_id = $1
     ORDER BY oi.item_id ASC`,
    [id],
  );
  const payments = await query<Payment>(
    `SELECT payment_id, order_id, amount, payment_method, payment_status, processed_at
     FROM payments WHERE order_id = $1 ORDER BY processed_at DESC NULLS LAST`,
    [id],
  );

  return { ...order, items, payments, delivery: await getDeliveryByOrderId(id) };
}

export async function getOrderStats(): Promise<{
  byStatus: Record<OrderStatus, number>;
  revenueMTD: number;
}> {
  const rows = await query<{ status: OrderStatus; count: number }>(
    "SELECT status, COUNT(*)::int AS count FROM orders GROUP BY status",
  );
  const byStatus = Object.fromEntries(ORDER_STATUSES.map((s) => [s, 0])) as Record<OrderStatus, number>;
  for (const row of rows) byStatus[row.status] = row.count;

  const rev = await queryOne<{ revenue: number }>(
    `SELECT COALESCE(SUM(total_amount), 0)::float AS revenue FROM orders
     WHERE status <> 'Cancelled' AND created_at >= date_trunc('month', NOW())`,
  );
  return { byStatus, revenueMTD: rev?.revenue ?? 0 };
}

function revalidateOrderRoutes(): void {
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");
}

export async function createOrder(
  data: OrderInput,
  session: SessionUser,
): Promise<ActionResult<{ id: number }>> {
  if (!(await queryOne("SELECT 1 FROM customers WHERE customer_id = $1", [data.customerId]))) {
    return { ok: false, error: "Client not found." };
  }

  // De-duplicate product lines by summing quantities.
  const quantities = new Map<number, number>();
  for (const item of data.items) {
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }
  const productIds = [...quantities.keys()];
  const priceRows = await query<{ productId: number; basePrice: number }>(
    "SELECT product_id, base_price FROM products WHERE product_id = ANY($1::int[])",
    [productIds],
  );
  const priceById = new Map(priceRows.map((p) => [p.productId, p.basePrice]));

  const lines: { productId: number; quantity: number; unitPrice: number }[] = [];
  for (const [productId, quantity] of quantities) {
    const unitPrice = priceById.get(productId);
    if (unitPrice === undefined) return { ok: false, error: `Product #${productId} not found.` };
    lines.push({ productId, quantity, unitPrice });
  }
  const totalAmount = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);

  const id = await withActor(session.userId, async (c) => {
    const { rows } = await c.query(
      `INSERT INTO orders (customer_id, status, total_amount, created_by)
       VALUES ($1, 'Pending', $2, $3) RETURNING order_id`,
      [data.customerId, totalAmount, session.userId],
    );
    const orderId = rows[0].order_id as number;
    for (const line of lines) {
      await c.query(
        "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)",
        [orderId, line.productId, line.quantity, line.unitPrice],
      );
    }
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'CREATE', 'ORDER', $2)",
      [session.userId, orderId],
    );
    return orderId;
  });

  revalidateOrderRoutes();
  return { ok: true, data: { id } };
}

export async function updateOrderStatus(
  orderId: number,
  status: OrderStatus,
  session: SessionUser,
): Promise<ActionResult> {
  if (!(await queryOne("SELECT 1 FROM orders WHERE order_id = $1", [orderId]))) {
    return { ok: false, error: "Order not found." };
  }
  await withActor(session.userId, async (c) => {
    await c.query("UPDATE orders SET status = $1, updated_by = $2 WHERE order_id = $3", [
      status,
      session.userId,
      orderId,
    ]);
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'UPDATE', 'ORDER', $2)",
      [session.userId, orderId],
    );
  });
  revalidateOrderRoutes();
  revalidatePath(`/dashboard/orders/${orderId}`);
  return { ok: true, data: undefined };
}

export async function recordPayment(
  data: PaymentInput,
  session: SessionUser,
): Promise<ActionResult> {
  const order = await queryOne<{ orderId: number; totalAmount: number }>(
    "SELECT order_id, total_amount FROM orders WHERE order_id = $1",
    [data.orderId],
  );
  if (!order) return { ok: false, error: "Order not found." };

  const paidRow = await queryOne<{ paid: number }>(
    "SELECT COALESCE(SUM(amount), 0)::float AS paid FROM payments WHERE order_id = $1 AND payment_status = 'Completed'",
    [data.orderId],
  );
  const paid = paidRow?.paid ?? 0;
  if (paid + data.amount > order.totalAmount) {
    return {
      ok: false,
      error: "Validation failed.",
      fieldErrors: { amount: ["Payment would exceed the order total"] },
    };
  }

  await withActor(session.userId, async (c) => {
    await c.query(
      `INSERT INTO payments (order_id, amount, payment_method, payment_status, processed_at)
       VALUES ($1, $2, $3, 'Completed', NOW())`,
      [data.orderId, data.amount, data.paymentMethod],
    );
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'UPDATE', 'ORDER', $2)",
      [session.userId, data.orderId],
    );
  });

  revalidatePath(`/dashboard/orders/${data.orderId}`);
  return { ok: true, data: undefined };
}
