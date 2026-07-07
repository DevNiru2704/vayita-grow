import "server-only";
import { revalidatePath } from "next/cache";
import { paginate } from "@/lib/db/list";
import { queryOne, withActor } from "@/lib/db/query";
import type { ActionResult, ListParams, Paginated } from "@/lib/types/common";
import type { FieldReportStatus } from "@/lib/types/database";
import type { FieldReport, FieldReportInput } from "@/lib/types/field-report";
import type { SessionUser } from "@/lib/types/user";

const SELECT = `
  SELECT r.report_id, r.visit_date, r.customer_id, r.dealer_name, r.location,
         r.summary, r.status, r.created_by, r.created_at,
         u.username AS created_by_username
  FROM field_reports r
  JOIN users u ON u.user_id = r.created_by`;

export async function getFieldReports(
  params?: ListParams & { status?: FieldReportStatus },
): Promise<Paginated<FieldReport>> {
  return paginate<FieldReport>(
    {
      select: SELECT,
      where: params?.status ? ["r.status = $1"] : [],
      params: params?.status ? [params.status] : [],
      searchColumns: ["r.dealer_name", "r.location", "r.summary"],
      sorters: { visitDate: "r.visit_date", dealerName: "r.dealer_name", status: "r.status" },
      defaultSort: "visitDate",
      defaultDir: "desc",
    },
    params,
  );
}

export async function getFieldReportById(id: number): Promise<FieldReport | null> {
  return queryOne<FieldReport>(`${SELECT} WHERE r.report_id = $1`, [id]);
}

export async function createFieldReport(
  data: FieldReportInput,
  session: SessionUser,
): Promise<ActionResult<{ id: number }>> {
  if (data.customerId !== null) {
    const customer = await queryOne<{ customerId: number }>(
      "SELECT customer_id FROM customers WHERE customer_id = $1",
      [data.customerId],
    );
    if (!customer) return { ok: false, error: "Linked client not found." };
  }

  const id = await withActor(session.userId, async (c) => {
    const { rows } = await c.query(
      `INSERT INTO field_reports (visit_date, customer_id, dealer_name, location, summary, status, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING report_id`,
      [data.visitDate, data.customerId, data.dealerName, data.location, data.summary, data.status, session.userId],
    );
    const reportId = rows[0].report_id as number;
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'CREATE', 'SYSTEM', $2)",
      [session.userId, reportId],
    );
    return reportId;
  });

  revalidatePath("/dashboard/field-reports");
  revalidatePath("/dashboard");
  return { ok: true, data: { id } };
}

export async function updateFieldReportStatus(
  reportId: number,
  status: FieldReportStatus,
  session: SessionUser,
): Promise<ActionResult> {
  const report = await queryOne<{ reportId: number }>(
    "SELECT report_id FROM field_reports WHERE report_id = $1",
    [reportId],
  );
  if (!report) return { ok: false, error: "Field report not found." };

  await withActor(session.userId, async (c) => {
    await c.query("UPDATE field_reports SET status = $1 WHERE report_id = $2", [status, reportId]);
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'UPDATE', 'SYSTEM', $2)",
      [session.userId, reportId],
    );
  });

  revalidatePath("/dashboard/field-reports");
  revalidatePath(`/dashboard/field-reports/${reportId}`);
  return { ok: true, data: undefined };
}
