import type { QuotationStatus } from "@/lib/types/database";

/**
 * DEMO quotations. Declarative form (items reference the REAL catalog); line
 * unit prices + totals are expanded in buildSeedDb from the product base price.
 */

export interface SeedQuotation {
  quotationId: number;
  quotationNumber: string;
  customerId: number;
  createdBy: number;
  assignedStaffId: number | null;
  status: QuotationStatus;
  validUntil: string | null;
  notes: string | null;
  createdAt: string;
  items: { productId: number; quantity: number }[];
}

export const seedQuotations: SeedQuotation[] = [
  {
    quotationId: 1,
    quotationNumber: "QT-2026-001",
    customerId: 2,
    createdBy: 2,
    assignedStaffId: 3,
    status: "Sent",
    validUntil: "2026-07-31",
    notes: "Pre-kharif stocking proposal for the Bardhaman belt.",
    createdAt: "2026-07-01T09:00:00.000Z",
    items: [
      { productId: 1, quantity: 50 },
      { productId: 3, quantity: 30 },
    ],
  },
  {
    quotationId: 2,
    quotationNumber: "QT-2026-002",
    customerId: 8,
    createdBy: 2,
    assignedStaffId: 4,
    status: "Accepted",
    validUntil: "2026-07-20",
    notes: "Ranchi dealer restock; awaiting confirmation on pack sizes.",
    createdAt: "2026-06-24T10:30:00.000Z",
    items: [
      { productId: 5, quantity: 40 },
      { productId: 7, quantity: 20 },
      { productId: 10, quantity: 25 },
    ],
  },
  {
    quotationId: 3,
    quotationNumber: "QT-2026-003",
    customerId: 5,
    createdBy: 2,
    assignedStaffId: null,
    status: "Draft",
    validUntil: "2026-08-15",
    notes: "North Bengal tea-garden trial quantities.",
    createdAt: "2026-07-04T08:15:00.000Z",
    items: [{ productId: 1, quantity: 15 }],
  },
  {
    quotationId: 4,
    quotationNumber: "QT-2026-004",
    customerId: 6,
    createdBy: 2,
    assignedStaffId: 3,
    status: "Rejected",
    validUntil: "2026-06-30",
    notes: "Malda mango orchard proposal - dealer sourced locally this season.",
    createdAt: "2026-06-12T11:00:00.000Z",
    items: [
      { productId: 4, quantity: 35 },
      { productId: 10, quantity: 15 },
    ],
  },
];
