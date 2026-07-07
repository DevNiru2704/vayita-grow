import "server-only";
import { revalidatePath } from "next/cache";
import { paginate } from "@/lib/db/list";
import { query, queryOne, withActor } from "@/lib/db/query";
import type { CustomerDetail, CustomerInput, CustomerNote, CustomerWithStats } from "@/lib/types/customer";
import type { ActionResult, ListParams, Paginated } from "@/lib/types/common";
import type { CustomerStatus } from "@/lib/types/database";
import type { SessionUser } from "@/lib/types/user";

const SELECT = `
  SELECT c.customer_id, c.full_name, c.email, c.phone, c.address, c.state, c.status, c.created_at,
         COALESCE(o.order_count, 0)::int AS order_count, o.last_order_at
  FROM customers c
  LEFT JOIN (
    SELECT customer_id, COUNT(*) AS order_count, MAX(created_at) AS last_order_at
    FROM orders GROUP BY customer_id
  ) o ON o.customer_id = c.customer_id`;

export async function getCustomers(
  params?: ListParams & { status?: CustomerStatus; state?: string },
): Promise<Paginated<CustomerWithStats>> {
  const where: string[] = [];
  const values: unknown[] = [];
  if (params?.status) {
    values.push(params.status);
    where.push(`c.status = $${values.length}`);
  }
  if (params?.state) {
    values.push(params.state);
    where.push(`c.state = $${values.length}`);
  }

  return paginate<CustomerWithStats>(
    {
      select: SELECT,
      where,
      params: values,
      searchColumns: ["c.full_name", "c.address", "c.state", "c.phone"],
      sorters: {
        fullName: "c.full_name",
        state: "c.state",
        createdAt: "c.created_at",
        orderCount: "order_count",
      },
      defaultSort: "fullName",
    },
    params,
  );
}

export async function getCustomerNotes(customerId: number): Promise<CustomerNote[]> {
  return query<CustomerNote>(
    `SELECT n.note_id, n.customer_id, n.created_by, n.note_text, n.created_at,
            u.username AS created_by_username
     FROM customer_notes n
     JOIN users u ON u.user_id = n.created_by
     WHERE n.customer_id = $1
     ORDER BY n.created_at DESC`,
    [customerId],
  );
}

export async function getCustomerById(id: number): Promise<CustomerDetail | null> {
  const customer = await queryOne<CustomerWithStats>(`${SELECT} WHERE c.customer_id = $1`, [id]);
  if (!customer) return null;
  return { ...customer, notes: await getCustomerNotes(id) };
}

export async function getCustomerOptions(): Promise<{ customerId: number; fullName: string }[]> {
  return query<{ customerId: number; fullName: string }>(
    "SELECT customer_id, full_name FROM customers ORDER BY full_name ASC",
  );
}

function revalidateCustomerRoutes(): void {
  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard");
}

export async function createCustomer(
  data: CustomerInput,
  session: SessionUser,
): Promise<ActionResult<{ id: number }>> {
  const dupe = await queryOne<{ customerId: number }>(
    "SELECT customer_id FROM customers WHERE phone = $1",
    [data.phone],
  );
  if (dupe) {
    return {
      ok: false,
      error: "Validation failed.",
      fieldErrors: { phone: ["A client with this phone number already exists"] },
    };
  }

  const id = await withActor(session.userId, async (c) => {
    const { rows } = await c.query(
      `INSERT INTO customers (full_name, email, phone, address, state, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING customer_id`,
      [data.fullName, data.email || null, data.phone, data.address, data.state, data.status],
    );
    const customerId = rows[0].customer_id as number;
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'CREATE', 'SYSTEM', $2)",
      [session.userId, customerId],
    );
    return customerId;
  });

  revalidateCustomerRoutes();
  return { ok: true, data: { id } };
}

export async function updateCustomer(
  id: number,
  data: CustomerInput,
  session: SessionUser,
): Promise<ActionResult> {
  const customer = await queryOne<{ customerId: number }>(
    "SELECT customer_id FROM customers WHERE customer_id = $1",
    [id],
  );
  if (!customer) return { ok: false, error: "Client not found." };

  const dupe = await queryOne<{ customerId: number }>(
    "SELECT customer_id FROM customers WHERE phone = $1 AND customer_id <> $2",
    [data.phone, id],
  );
  if (dupe) {
    return {
      ok: false,
      error: "Validation failed.",
      fieldErrors: { phone: ["A client with this phone number already exists"] },
    };
  }

  await withActor(session.userId, async (c) => {
    await c.query(
      `UPDATE customers SET full_name = $1, email = $2, phone = $3, address = $4, state = $5, status = $6
       WHERE customer_id = $7`,
      [data.fullName, data.email || null, data.phone, data.address, data.state, data.status, id],
    );
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'UPDATE', 'SYSTEM', $2)",
      [session.userId, id],
    );
  });

  revalidateCustomerRoutes();
  revalidatePath(`/dashboard/clients/${id}`);
  return { ok: true, data: undefined };
}

export async function addCustomerNote(
  customerId: number,
  noteText: string,
  session: SessionUser,
): Promise<ActionResult> {
  const customer = await queryOne<{ customerId: number }>(
    "SELECT customer_id FROM customers WHERE customer_id = $1",
    [customerId],
  );
  if (!customer) return { ok: false, error: "Client not found." };

  await withActor(session.userId, async (c) => {
    await c.query(
      "INSERT INTO customer_notes (customer_id, created_by, note_text) VALUES ($1, $2, $3)",
      [customerId, session.userId, noteText],
    );
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'CREATE', 'SYSTEM', $2)",
      [session.userId, customerId],
    );
  });

  revalidatePath(`/dashboard/clients/${customerId}`);
  return { ok: true, data: undefined };
}
