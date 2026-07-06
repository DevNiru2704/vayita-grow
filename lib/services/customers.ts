import "server-only";
import { db, latency } from "@/lib/mock/store";
import type { ListParams, Paginated } from "@/lib/types/common";
import type { CustomerStatus } from "@/lib/types/database";
import type { CustomerDetail, CustomerNote, CustomerWithStats } from "@/lib/types/customer";
import { applyList } from "./helpers";

// MOCK IMPLEMENTATION - replace bodies with Supabase queries. Signatures are the contract.

function withStats(customerId: number): { orderCount: number; lastOrderAt: string | null } {
  const orders = db().orders.filter((o) => o.customerId === customerId);
  const lastOrderAt = orders.reduce<string | null>(
    (latest, o) => (latest === null || o.createdAt > latest ? o.createdAt : latest),
    null,
  );
  return { orderCount: orders.length, lastOrderAt };
}

export async function getCustomers(
  params?: ListParams & { status?: CustomerStatus; state?: string },
): Promise<Paginated<CustomerWithStats>> {
  await latency();
  let rows = db().customers;
  if (params?.status) rows = rows.filter((c) => c.status === params.status);
  if (params?.state) rows = rows.filter((c) => c.state === params.state);

  const enriched: CustomerWithStats[] = rows.map((c) => ({ ...c, ...withStats(c.customerId) }));
  return applyList(enriched, params, {
    search: (c) => `${c.fullName} ${c.address} ${c.state} ${c.phone}`,
    sorters: {
      fullName: (c) => c.fullName,
      state: (c) => c.state,
      createdAt: (c) => c.createdAt,
      orderCount: (c) => c.orderCount,
    },
    defaultSort: "fullName",
  });
}

export async function getCustomerById(id: number): Promise<CustomerDetail | null> {
  await latency();
  const customer = db().customers.find((c) => c.customerId === id);
  if (!customer) return null;
  return { ...customer, ...withStats(id), notes: await getCustomerNotes(id) };
}

export async function getCustomerNotes(customerId: number): Promise<CustomerNote[]> {
  return db()
    .customerNotes.filter((n) => n.customerId === customerId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Lightweight id/name pairs for select inputs. */
export async function getCustomerOptions(): Promise<{ customerId: number; fullName: string }[]> {
  await latency();
  return db()
    .customers.map(({ customerId, fullName }) => ({ customerId, fullName }))
    .sort((a, b) => a.fullName.localeCompare(b.fullName));
}
