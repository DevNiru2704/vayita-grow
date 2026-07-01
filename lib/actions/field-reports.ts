"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { recordActivity } from "@/lib/mock/activity";
import { db, latency, nextId, nowIso } from "@/lib/mock/store";
import type { ActionResult } from "@/lib/types/common";
import { FIELD_REPORT_STATUSES, type FieldReportStatus } from "@/lib/types/database";
import type { FieldReportInput } from "@/lib/types/field-report";

// EXTENSION domain: field reports have no table in DB design v1.2.0 yet.
// MOCK IMPLEMENTATION - replace store mutations with Supabase queries.

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
  await latency();
  const parsed = reportSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

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
  await latency();
  if (!FIELD_REPORT_STATUSES.includes(status)) {
    return { ok: false, error: "Invalid status." };
  }

  const report = db().fieldReports.find((r) => r.reportId === reportId);
  if (!report) return { ok: false, error: "Field report not found." };

  report.status = status;
  recordActivity(session.userId, "UPDATE", "SYSTEM", reportId);
  revalidatePath("/dashboard/field-reports");
  revalidatePath(`/dashboard/field-reports/${reportId}`);
  return { ok: true, data: undefined };
}
