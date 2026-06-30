import type { CustomerStatus } from "./database";

/** Mirrors `customers`, `customer_notes` (ERD v1.2.0). */

export interface Customer {
  customerId: number;
  fullName: string;
  email: string | null;
  phone: string;
  address: string;
  /** EXTENSION: operating state for filtering (WB/Jharkhand); DB stores address text only. */
  state: string;
  /** EXTENSION: relationship status used by the dashboard; not in DB design v1.2.0. */
  status: CustomerStatus;
  createdAt: string;
}

export interface CustomerNote {
  noteId: number;
  customerId: number;
  createdBy: number;
  createdByUsername: string;
  noteText: string;
  createdAt: string;
}

export interface CustomerWithStats extends Customer {
  orderCount: number;
  lastOrderAt: string | null;
}

export interface CustomerDetail extends CustomerWithStats {
  notes: CustomerNote[];
}

export interface CustomerInput {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  status: CustomerStatus;
}
