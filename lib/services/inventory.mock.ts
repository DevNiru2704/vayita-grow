import "server-only";
import { db, latency } from "@/lib/mock/store";
import type { ListParams, Paginated } from "@/lib/types/common";
import type { InventoryLogWithUser, InventoryWithProduct, Supplier } from "@/lib/types/inventory";
import { applyList } from "./helpers";
import { getSettingNumber } from "./settings";

// MOCK IMPLEMENTATION - replace bodies with Supabase queries. Signatures are the contract.

function toWithProduct(record: (ReturnType<typeof db>["inventory"])[number]): InventoryWithProduct {
  const data = db();
  const product = data.products.find((p) => p.productId === record.productId);
  const supplier = record.supplierId
    ? data.suppliers.find((s) => s.supplierId === record.supplierId)
    : undefined;
  return {
    ...record,
    productName: product?.name ?? "Unknown",
    sku: product?.sku ?? "-",
    supplierName: supplier?.companyName ?? null,
  };
}

export async function getInventory(
  params?: ListParams & { lowStockOnly?: boolean },
): Promise<Paginated<InventoryWithProduct>> {
  await latency();
  let rows = db().inventory.map(toWithProduct);
  if (params?.lowStockOnly) {
    const threshold = await getLowStockThreshold();
    rows = rows.filter((r) => r.quantity <= threshold);
  }
  return applyList(rows, params, {
    search: (r) => `${r.productName} ${r.sku} ${r.supplierName ?? ""}`,
    sorters: {
      productName: (r) => r.productName,
      quantity: (r) => r.quantity,
      lastUpdated: (r) => r.lastUpdated,
    },
    defaultSort: "productName",
  });
}

export async function getInventoryLogs(
  params?: ListParams & { inventoryId?: number },
): Promise<Paginated<InventoryLogWithUser>> {
  await latency();
  const data = db();
  let rows = data.inventoryLogs;
  if (params?.inventoryId) rows = rows.filter((l) => l.inventoryId === params.inventoryId);

  const enriched: InventoryLogWithUser[] = rows.map((log) => {
    const record = data.inventory.find((i) => i.inventoryId === log.inventoryId);
    const product = record
      ? data.products.find((p) => p.productId === record.productId)
      : undefined;
    return {
      ...log,
      username: data.users.find((u) => u.userId === log.userId)?.username ?? "unknown",
      productName: product?.name ?? "Unknown",
    };
  });

  return applyList(enriched, params, {
    search: (l) => `${l.productName} ${l.reason} ${l.username}`,
    sorters: { createdAt: (l) => l.createdAt },
    defaultSort: "createdAt",
    defaultDir: "desc",
  });
}

export async function getSuppliers(params?: ListParams): Promise<Paginated<Supplier>> {
  await latency();
  return applyList(db().suppliers, params, {
    search: (s) => `${s.companyName} ${s.contactEmail ?? ""} ${s.phone ?? ""}`,
    sorters: { companyName: (s) => s.companyName },
    defaultSort: "companyName",
  });
}

export async function getLowStockThreshold(): Promise<number> {
  return getSettingNumber("low_stock_threshold", 50);
}
