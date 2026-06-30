import type { InventoryLog, InventoryRecord, Supplier } from "@/lib/types/inventory";

/** DEMO operational data - suppliers, stock levels, and adjustment history. */

export const seedSuppliers: Supplier[] = [
  { supplierId: 1, companyName: "Eastern Organics Supply Co.", contactEmail: "sales@easternorganics.example.com", phone: "+91 97000 00001" },
  { supplierId: 2, companyName: "GreenBase Raw Materials", contactEmail: "orders@greenbase.example.com", phone: "+91 97000 00002" },
  { supplierId: 3, companyName: "Shakti Minerals & Chemicals", contactEmail: null, phone: "+91 97000 00003" },
  { supplierId: 4, companyName: "AgriPack Packaging Solutions", contactEmail: "support@agripack.example.com", phone: null },
];

export const seedInventory: InventoryRecord[] = [
  { inventoryId: 1, productId: 1, supplierId: 1, quantity: 420, lastUpdated: "2026-06-30T09:00:00.000Z" },
  { inventoryId: 2, productId: 2, supplierId: 1, quantity: 310, lastUpdated: "2026-06-28T09:00:00.000Z" },
  { inventoryId: 3, productId: 3, supplierId: 2, quantity: 275, lastUpdated: "2026-07-01T09:00:00.000Z" },
  { inventoryId: 4, productId: 4, supplierId: 2, quantity: 38, lastUpdated: "2026-07-02T09:00:00.000Z" },
  { inventoryId: 5, productId: 5, supplierId: 1, quantity: 180, lastUpdated: "2026-06-25T09:00:00.000Z" },
  { inventoryId: 6, productId: 6, supplierId: 3, quantity: 520, lastUpdated: "2026-06-20T09:00:00.000Z" },
  { inventoryId: 7, productId: 7, supplierId: 3, quantity: 45, lastUpdated: "2026-07-03T09:00:00.000Z" },
  { inventoryId: 8, productId: 8, supplierId: 2, quantity: 240, lastUpdated: "2026-06-29T09:00:00.000Z" },
  { inventoryId: 9, productId: 9, supplierId: 1, quantity: 130, lastUpdated: "2026-06-27T09:00:00.000Z" },
  { inventoryId: 10, productId: 10, supplierId: 2, quantity: 365, lastUpdated: "2026-07-01T09:00:00.000Z" },
];

export const seedInventoryLogs: InventoryLog[] = [
  { logId: 1, inventoryId: 1, userId: 2, changeAmount: 200, reason: "New production batch", createdAt: "2026-06-15T08:00:00.000Z" },
  { logId: 2, inventoryId: 4, userId: 2, changeAmount: -150, reason: "Order dispatch (Malda)", createdAt: "2026-05-19T10:30:00.000Z" },
  { logId: 3, inventoryId: 7, userId: 3, changeAmount: -60, reason: "Order dispatch (Ranchi)", createdAt: "2026-06-12T09:15:00.000Z" },
  { logId: 4, inventoryId: 6, userId: 2, changeAmount: 300, reason: "New production batch", createdAt: "2026-06-18T07:45:00.000Z" },
  { logId: 5, inventoryId: 9, userId: 2, changeAmount: -12, reason: "Damaged stock write-off", createdAt: "2026-06-26T11:00:00.000Z" },
  { logId: 6, inventoryId: 3, userId: 2, changeAmount: 120, reason: "New production batch", createdAt: "2026-06-30T08:30:00.000Z" },
];
