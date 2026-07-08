import "server-only";
import { revalidatePath } from "next/cache";
import { contactInbox, sendEmail } from "@/lib/email/resend";
import { quotationEmail } from "@/lib/email/templates";
import { paginate } from "@/lib/db/list";
import { query, queryOne, withActor } from "@/lib/db/query";
import { formatINR } from "@/lib/format";
import type { ActionResult, ListParams, Paginated } from "@/lib/types/common";
import type { QuotationStatus } from "@/lib/types/database";
import type {
  QuotationDetail,
  QuotationInput,
  QuotationItemWithProduct,
  QuotationWithCustomer,
} from "@/lib/types/quotation";
import type { SessionUser } from "@/lib/types/user";

const LIST_SELECT = `
  SELECT q.quotation_id, q.quotation_number, q.customer_id, q.created_by, q.assigned_staff_id,
         q.status, q.total_amount, q.valid_until, q.notes, q.created_at,
         c.full_name AS customer_name, u.username AS created_by_username,
         s.username AS assigned_staff_name,
         COALESCE(qi.item_count, 0)::int AS item_count
  FROM quotations q
  JOIN customers c ON c.customer_id = q.customer_id
  JOIN users u ON u.user_id = q.created_by
  LEFT JOIN users s ON s.user_id = q.assigned_staff_id
  LEFT JOIN (SELECT quotation_id, COUNT(*) AS item_count FROM quotation_items GROUP BY quotation_id) qi
    ON qi.quotation_id = q.quotation_id`;

export async function getQuotations(
  params?: ListParams & { status?: QuotationStatus; assignedStaffId?: number },
): Promise<Paginated<QuotationWithCustomer>> {
  const where: string[] = [];
  const values: unknown[] = [];
  if (params?.status) {
    values.push(params.status);
    where.push(`q.status = $${values.length}`);
  }
  if (params?.assignedStaffId) {
    values.push(params.assignedStaffId);
    where.push(`q.assigned_staff_id = $${values.length}`);
  }

  return paginate<QuotationWithCustomer>(
    {
      select: LIST_SELECT,
      where,
      params: values,
      searchColumns: ["q.quotation_number", "c.full_name", "q.status::text"],
      sorters: {
        createdAt: "q.created_at",
        totalAmount: "q.total_amount",
        customerName: "c.full_name",
        status: "q.status",
      },
      defaultSort: "createdAt",
      defaultDir: "desc",
    },
    params,
  );
}

export async function getQuotationById(id: number): Promise<QuotationDetail | null> {
  const quotation = await queryOne<QuotationWithCustomer>(`${LIST_SELECT} WHERE q.quotation_id = $1`, [id]);
  if (!quotation) return null;
  const items = await query<QuotationItemWithProduct>(
    `SELECT qi.item_id, qi.quotation_id, qi.product_id, qi.quantity, qi.unit_price,
            p.name AS product_name, p.sku
     FROM quotation_items qi
     JOIN products p ON p.product_id = qi.product_id
     WHERE qi.quotation_id = $1
     ORDER BY qi.item_id ASC`,
    [id],
  );
  return { ...quotation, items };
}

function revalidateQuotationRoutes(id?: number): void {
  revalidatePath("/dashboard/quotations");
  if (id) revalidatePath(`/dashboard/quotations/${id}`);
}

export async function createQuotation(
  data: QuotationInput,
  session: SessionUser,
): Promise<ActionResult<{ id: number }>> {
  if (!(await queryOne("SELECT 1 FROM customers WHERE customer_id = $1", [data.customerId]))) {
    return { ok: false, error: "Client not found." };
  }

  const quantities = new Map<number, number>();
  for (const item of data.items) {
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }
  const priceRows = await query<{ productId: number; basePrice: number }>(
    "SELECT product_id, base_price FROM products WHERE product_id = ANY($1::int[])",
    [[...quantities.keys()]],
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
      `INSERT INTO quotations (quotation_number, customer_id, created_by, status, total_amount, valid_until, notes)
       VALUES ('', $1, $2, 'Draft', $3, $4, $5) RETURNING quotation_id`,
      [data.customerId, session.userId, totalAmount, data.validUntil, data.notes],
    );
    const quotationId = rows[0].quotation_id as number;
    const number = `QT-${new Date().getFullYear()}-${String(quotationId).padStart(3, "0")}`;
    await c.query("UPDATE quotations SET quotation_number = $1 WHERE quotation_id = $2", [
      number,
      quotationId,
    ]);
    for (const line of lines) {
      await c.query(
        "INSERT INTO quotation_items (quotation_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)",
        [quotationId, line.productId, line.quantity, line.unitPrice],
      );
    }
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'CREATE', 'QUOTATION', $2)",
      [session.userId, quotationId],
    );
    return quotationId;
  });

  revalidateQuotationRoutes();
  return { ok: true, data: { id } };
}

export async function updateQuotationStatus(
  quotationId: number,
  status: QuotationStatus,
  session: SessionUser,
): Promise<ActionResult> {
  if (!(await queryOne("SELECT 1 FROM quotations WHERE quotation_id = $1", [quotationId]))) {
    return { ok: false, error: "Quotation not found." };
  }
  await withActor(session.userId, async (c) => {
    await c.query("UPDATE quotations SET status = $1 WHERE quotation_id = $2", [status, quotationId]);
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'UPDATE', 'QUOTATION', $2)",
      [session.userId, quotationId],
    );
  });
  revalidateQuotationRoutes(quotationId);
  return { ok: true, data: undefined };
}

export async function sendQuotationToStaff(
  quotationId: number,
  staffId: number,
  session: SessionUser,
): Promise<ActionResult> {
  const quotation = await queryOne<{
    quotationNumber: string;
    customerName: string;
    totalAmount: number;
    validUntil: string | null;
    notes: string | null;
  }>(
    `SELECT q.quotation_number, q.total_amount, q.valid_until, q.notes, c.full_name AS customer_name
     FROM quotations q JOIN customers c ON c.customer_id = q.customer_id
     WHERE q.quotation_id = $1`,
    [quotationId],
  );
  if (!quotation) return { ok: false, error: "Quotation not found." };

  const staff = await queryOne<{ username: string }>(
    "SELECT username FROM users WHERE user_id = $1",
    [staffId],
  );
  if (!staff) return { ok: false, error: "Selected staff member not found." };

  await withActor(session.userId, async (c) => {
    await c.query(
      "UPDATE quotations SET assigned_staff_id = $1, status = 'Sent' WHERE quotation_id = $2",
      [staffId, quotationId],
    );
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'UPDATE', 'QUOTATION', $2)",
      [session.userId, quotationId],
    );
  });

  // Staff accounts have no email column, so notify the company inbox that a
  // quotation was assigned (the assignment itself is visible in the staff's
  // dashboard via the "assigned to me" filter).
  const inbox = contactInbox();
  if (inbox) {
    await sendEmail({
      to: inbox,
      subject: `Quotation ${quotation.quotationNumber} assigned to ${staff.username}`,
      html: quotationEmail({
        quotationNumber: quotation.quotationNumber,
        customerName: quotation.customerName,
        total: formatINR(quotation.totalAmount),
        validUntil: quotation.validUntil,
        assignedBy: session.username,
        notes: quotation.notes,
      }),
    });
  }

  revalidateQuotationRoutes(quotationId);
  return { ok: true, data: undefined };
}
