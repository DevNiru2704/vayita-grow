import type { QuotationStatus } from "./database";

/**
 * EXTENSION: not in DB design v1.2.0 - quotations module (0007_quotations.sql).
 * Admins draft quotations and assign ("send") them to a staff member.
 */

export interface Quotation {
  quotationId: number;
  quotationNumber: string;
  customerId: number;
  createdBy: number;
  assignedStaffId: number | null;
  status: QuotationStatus;
  totalAmount: number;
  validUntil: string | null;
  notes: string | null;
  createdAt: string;
}

export interface QuotationItem {
  itemId: number;
  quotationId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface QuotationItemWithProduct extends QuotationItem {
  productName: string;
  sku: string;
}

export interface QuotationWithCustomer extends Quotation {
  customerName: string;
  itemCount: number;
  createdByUsername: string;
  assignedStaffName: string | null;
}

export interface QuotationDetail extends QuotationWithCustomer {
  items: QuotationItemWithProduct[];
}

export interface QuotationInput {
  customerId: number;
  validUntil: string | null;
  notes: string | null;
  items: { productId: number; quantity: number }[];
}
