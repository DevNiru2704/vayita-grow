import "server-only";
import { db, latency } from "@/lib/mock/store";
import type { ListParams, Paginated } from "@/lib/types/common";
import type { StatementWithCustomer } from "@/lib/types/statement";
import { applyList } from "./helpers";

// EXTENSION domain: statements have no table in DB design v1.2.0 yet.
// MOCK IMPLEMENTATION - replace bodies with Supabase queries. Signatures are the contract.

export async function getStatements(
  params?: ListParams & { customerId?: number },
): Promise<Paginated<StatementWithCustomer>> {
  await latency();
  const data = db();
  let rows = data.statements;
  if (params?.customerId) rows = rows.filter((s) => s.customerId === params.customerId);

  const enriched: StatementWithCustomer[] = rows.map((statement) => ({
    ...statement,
    customerName:
      data.customers.find((c) => c.customerId === statement.customerId)?.fullName ?? "Unknown",
    uploadedByUsername:
      data.users.find((u) => u.userId === statement.uploadedBy)?.username ?? "unknown",
  }));

  return applyList(enriched, params, {
    search: (s) => `${s.statementNumber} ${s.customerName} ${s.periodLabel}`,
    sorters: {
      uploadDate: (s) => s.uploadDate,
      customerName: (s) => s.customerName,
    },
    defaultSort: "uploadDate",
    defaultDir: "desc",
  });
}
