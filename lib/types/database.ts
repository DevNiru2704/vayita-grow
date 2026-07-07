/**
 * Shared enums mirroring the PostgreSQL ENUM types defined in
 * docs/project_details/ERD_dbml.md (schema v1.2.0).
 *
 * Value casing intentionally matches the DB enums so the future
 * Supabase integration is a drop-in swap.
 */

export const ROLE_NAMES = ["dev", "admin", "staff"] as const;
export type RoleName = (typeof ROLE_NAMES)[number];

export const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_METHODS = ["Bank_Transfer", "Credit_Card", "UPI", "Cash"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_STATUSES = ["Pending", "Completed", "Failed", "Refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const DELIVERY_STATUSES = [
  "Dispatching",
  "In_Transit",
  "Delivered",
  "Returned",
] as const;
export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

export const FEEDBACK_STATUSES = ["Open", "In_Progress", "Resolved", "Closed"] as const;
export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];

export const ACTION_TYPES = ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT"] as const;
export type ActionType = (typeof ACTION_TYPES)[number];

export const ENTITY_TYPES = [
  "USER",
  "PRODUCT",
  "ORDER",
  "INVENTORY",
  "DELIVERY",
  "QUOTATION",
  "SYSTEM",
] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

// EXTENSION: not in DB design v1.2.0 - backend schema addition required.
export const FIELD_REPORT_STATUSES = ["Completed", "Follow_Up_Required"] as const;
export type FieldReportStatus = (typeof FIELD_REPORT_STATUSES)[number];

export const CUSTOMER_STATUSES = ["Active", "Inactive", "New"] as const;
export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];

// EXTENSION: not in DB design v1.2.0 - quotations module (see 0007_quotations.sql).
export const QUOTATION_STATUSES = ["Draft", "Sent", "Accepted", "Rejected", "Expired"] as const;
export type QuotationStatus = (typeof QUOTATION_STATUSES)[number];

/** Human-readable label for DB enum values that use underscores. */
export function enumLabel(value: string): string {
  return value.replaceAll("_", " ");
}
