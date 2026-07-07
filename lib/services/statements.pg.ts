import "server-only";
import { revalidatePath } from "next/cache";
import { paginate } from "@/lib/db/list";
import { queryOne, withActor } from "@/lib/db/query";
import type { ActionResult, ListParams, Paginated } from "@/lib/types/common";
import type { StatementInput, StatementWithCustomer } from "@/lib/types/statement";
import type { SessionUser } from "@/lib/types/user";

const SELECT = `
  SELECT s.statement_id, s.statement_number, s.customer_id, s.period_label,
         s.upload_date, s.uploaded_by,
         c.full_name AS customer_name, u.username AS uploaded_by_username
  FROM statements s
  JOIN customers c ON c.customer_id = s.customer_id
  JOIN users u ON u.user_id = s.uploaded_by`;

export async function getStatements(
  params?: ListParams & { customerId?: number },
): Promise<Paginated<StatementWithCustomer>> {
  return paginate<StatementWithCustomer>(
    {
      select: SELECT,
      where: params?.customerId ? ["s.customer_id = $1"] : [],
      params: params?.customerId ? [params.customerId] : [],
      searchColumns: ["s.statement_number", "c.full_name", "s.period_label"],
      sorters: { uploadDate: "s.upload_date", customerName: "c.full_name" },
      defaultSort: "uploadDate",
      defaultDir: "desc",
    },
    params,
  );
}

export async function createStatement(
  data: StatementInput,
  session: SessionUser,
): Promise<ActionResult<{ id: number }>> {
  const customer = await queryOne<{ customerId: number }>(
    "SELECT customer_id FROM customers WHERE customer_id = $1",
    [data.customerId],
  );
  if (!customer) return { ok: false, error: "Client not found." };

  const id = await withActor(session.userId, async (c) => {
    const { rows } = await c.query(
      `INSERT INTO statements (statement_number, customer_id, period_label, uploaded_by)
       VALUES ('', $1, $2, $3) RETURNING statement_id`,
      [data.customerId, data.periodLabel, session.userId],
    );
    const statementId = rows[0].statement_id as number;
    const number = `STM-${new Date().getFullYear()}-${String(statementId).padStart(3, "0")}`;
    await c.query("UPDATE statements SET statement_number = $1 WHERE statement_id = $2", [
      number,
      statementId,
    ]);
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'CREATE', 'SYSTEM', $2)",
      [session.userId, statementId],
    );
    return statementId;
  });

  revalidatePath("/dashboard/statements");
  revalidatePath("/dashboard");
  return { ok: true, data: { id } };
}
