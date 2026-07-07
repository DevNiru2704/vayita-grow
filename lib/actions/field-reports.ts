"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { isSupabase } from "@/lib/db/source";
import { recordActivity } from "@/lib/mock/activity";
import { db, latency, nextId, nowIso } from "@/lib/mock/store";
import * as fieldReportsPg from "@/lib/services/field-reports.pg";
import type { ActionResult } from "@/lib/types/common";
import { FIELD_REPORT_STATUSES, type FieldReportStatus } from "@/lib/types/database";
import type { FieldReportInput } from "@/lib/types/field-report";

// Validation + auth run here; data access dispatches to mock or Postgres
// (lib/services/field-reports.pg.ts) based on DATA_SOURCE.

const reportSchema = z.object({
  visitDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Select a visit date"),
  customerId: z.number().int().positive().nullable(),
  dealerName: z.string().trim().min(3, "Dealer name is required").max(150),
  location: z.string().trim().min(3, "Location is required").max(150),
  summary: z.string().trim().min(20, "Summary must be at least 20 characters"),
  status: z.enum(FIELD_REPORT_STATUSES),
});

export async function createFieldReport(
  input: FieldReportInput,
): Promise<ActionResult<{ id: number }>> {
  const session = await requireSession();
  const parsed = reportSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  if (isSupabase) return fieldReportsPg.createFieldReport(parsed.data, session);
  await latency();

  const store = db();
  if (
    parsed.data.customerId !== null &&
    !store.customers.some((c) => c.customerId === parsed.data.customerId)
  ) {
    return { ok: false, error: "Linked client not found." };
  }

  const reportId = nextId(store.fieldReports, "reportId");
  store.fieldReports.push({
    reportId,
    ...parsed.data,
    createdBy: session.userId,
    createdByUsername: session.username,
    createdAt: nowIso(),
  });

  recordActivity(session.userId, "CREATE", "SYSTEM", reportId);
  revalidatePath("/dashboard/field-reports");
  revalidatePath("/dashboard");
  return { ok: true, data: { id: reportId } };
}

export async function updateFieldReportStatus(
  reportId: number,
  status: FieldReportStatus,
): Promise<ActionResult> {
  const session = await requireSession();
  if (!FIELD_REPORT_STATUSES.includes(status)) {
    return { ok: false, error: "Invalid status." };
  }
  if (isSupabase) return fieldReportsPg.updateFieldReportStatus(reportId, status, session);
  await latency();

  const report = db().fieldReports.find((r) => r.reportId === reportId);
  if (!report) return { ok: false, error: "Field report not found." };

  report.status = status;
  recordActivity(session.userId, "UPDATE", "SYSTEM", reportId);
  revalidatePath("/dashboard/field-reports");
  revalidatePath(`/dashboard/field-reports/${reportId}`);
  return { ok: true, data: undefined };
}
