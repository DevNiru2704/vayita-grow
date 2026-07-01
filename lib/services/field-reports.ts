import "server-only";
import { db, latency } from "@/lib/mock/store";
import type { ListParams, Paginated } from "@/lib/types/common";
import type { FieldReportStatus } from "@/lib/types/database";
import type { FieldReport } from "@/lib/types/field-report";
import { applyList } from "./helpers";

// EXTENSION domain: field reports have no table in DB design v1.2.0 yet.
// MOCK IMPLEMENTATION - replace bodies with Supabase queries. Signatures are the contract.

export async function getFieldReports(
  params?: ListParams & { status?: FieldReportStatus },
): Promise<Paginated<FieldReport>> {
  await latency();
  let rows = db().fieldReports;
  if (params?.status) rows = rows.filter((r) => r.status === params.status);

  return applyList(rows, params, {
    search: (r) => `${r.dealerName} ${r.location} ${r.summary}`,
    sorters: {
      visitDate: (r) => r.visitDate,
      dealerName: (r) => r.dealerName,
      status: (r) => r.status,
    },
    defaultSort: "visitDate",
    defaultDir: "desc",
  });
}

export async function getFieldReportById(id: number): Promise<FieldReport | null> {
  await latency();
  return db().fieldReports.find((r) => r.reportId === id) ?? null;
}
