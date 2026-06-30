/** Mirrors `suppliers`, `inventory`, `inventory_logs` (ERD v1.2.0). */

export interface Supplier {
  supplierId: number;
  companyName: string;
  contactEmail: string | null;
  phone: string | null;
}

export interface InventoryRecord {
  inventoryId: number;
  productId: number;
  supplierId: number | null;
  quantity: number;
  lastUpdated: string;
}

export interface InventoryWithProduct extends InventoryRecord {
  productName: string;
  sku: string;
  supplierName: string | null;
}

export interface InventoryLog {
  logId: number;
  inventoryId: number;
  userId: number;
  changeAmount: number;
  reason: string;
  createdAt: string;
}

export interface InventoryLogWithUser extends InventoryLog {
  username: string;
  productName: string;
}

export interface SupplierInput {
  companyName: string;
  contactEmail: string;
  phone: string;
}

export interface StockAdjustmentInput {
  inventoryId: number;
  changeAmount: number;
  reason: string;
}
