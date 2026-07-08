import "server-only";
import { db, latency } from "@/lib/mock/store";
import type { ListParams, Paginated } from "@/lib/types/common";
import type { QuotationStatus } from "@/lib/types/database";
import type {
  Quotation,
  QuotationDetail,
  QuotationItemWithProduct,
  QuotationWithCustomer,
} from "@/lib/types/quotation";
import { applyList } from "./helpers";

// MOCK IMPLEMENTATION - replace bodies with Supabase queries. Signatures are the contract.

function username(userId: number | null): string | null {
  if (userId === null) return null;
  return db().users.find((u) => u.userId === userId)?.username ?? null;
}

function toWithCustomer(quotation: Quotation): QuotationWithCustomer {
  const data = db();
  return {
    ...quotation,
    customerName:
      data.customers.find((c) => c.customerId === quotation.customerId)?.fullName ?? "Unknown",
    itemCount: data.quotationItems.filter((i) => i.quotationId === quotation.quotationId).length,
    createdByUsername: username(quotation.createdBy) ?? "unknown",
    assignedStaffName: username(quotation.assignedStaffId),
  };
}

export async function getQuotations(
  params?: ListParams & { status?: QuotationStatus; assignedStaffId?: number },
): Promise<Paginated<QuotationWithCustomer>> {
  await latency();
  let rows = db().quotations;
  if (params?.status) rows = rows.filter((q) => q.status === params.status);
  if (params?.assignedStaffId) rows = rows.filter((q) => q.assignedStaffId === params.assignedStaffId);

  return applyList(rows.map(toWithCustomer), params, {
    search: (q) => `${q.quotationNumber} ${q.customerName} ${q.status}`,
    sorters: {
      createdAt: (q) => q.createdAt,
      totalAmount: (q) => q.totalAmount,
      customerName: (q) => q.customerName,
      status: (q) => q.status,
    },
    defaultSort: "createdAt",
    defaultDir: "desc",
  });
}

export async function getQuotationById(id: number): Promise<QuotationDetail | null> {
  await latency();
  const data = db();
  const quotation = data.quotations.find((q) => q.quotationId === id);
  if (!quotation) return null;

  const items: QuotationItemWithProduct[] = data.quotationItems
    .filter((i) => i.quotationId === id)
    .map((item) => {
      const product = data.products.find((p) => p.productId === item.productId);
      return { ...item, productName: product?.name ?? "Unknown", sku: product?.sku ?? "-" };
    });

  return { ...toWithCustomer(quotation), items };
}
