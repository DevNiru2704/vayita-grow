import type { NextRequest } from "next/server";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { getSession } from "@/lib/auth/session";
import { xlsxResponse, type ExportColumn } from "@/lib/export/excel";
import { formatDate, formatDateTime } from "@/lib/format";
import { getActivityLogs } from "@/lib/services/activity";
import { getCustomers } from "@/lib/services/customers";
import { getDeliveries } from "@/lib/services/deliveries";
import { getFeedbackTickets } from "@/lib/services/feedback";
import { getFieldReports } from "@/lib/services/field-reports";
import { getContactInquiries, getPublicFeedback } from "@/lib/services/inquiries";
import { getInventory, getSuppliers } from "@/lib/services/inventory";
import { getOrders } from "@/lib/services/orders";
import { getCategories, getProducts } from "@/lib/services/products";
import { getQuotations } from "@/lib/services/quotations";
import { getSettings } from "@/lib/services/settings";
import { getStatements } from "@/lib/services/statements";
import { getUsers } from "@/lib/services/users";
import {
  CONTACT_SUBJECT_LABELS,
  PUBLIC_FEEDBACK_ROLE_LABELS,
} from "@/lib/types/inquiries";
import {
  ACTION_TYPES,
  CUSTOMER_STATUSES,
  DELIVERY_STATUSES,
  ENTITY_TYPES,
  FEEDBACK_STATUSES,
  FIELD_REPORT_STATUSES,
  ORDER_STATUSES,
  QUOTATION_STATUSES,
  type ActionType,
  type CustomerStatus,
  type DeliveryStatus,
  type EntityType,
  type FeedbackStatus,
  type FieldReportStatus,
  type OrderStatus,
  type QuotationStatus,
} from "@/lib/types/database";

// Exports honor the same filters/search/sort as the list view (pagination
// ignored — the full filtered set is exported). Auth is enforced per request.

const ALL = { page: 1, pageSize: 100_000 };

function base(sp: URLSearchParams) {
  return {
    ...ALL,
    query: sp.get("query") ?? undefined,
    sort: sp.get("sort") ?? undefined,
    dir: sp.get("dir") === "asc" ? ("asc" as const) : sp.get("dir") === "desc" ? ("desc" as const) : undefined,
  };
}

function pick<T extends string>(sp: URLSearchParams, key: string, allowed: readonly T[]): T | undefined {
  const value = sp.get(key);
  return value && (allowed as readonly string[]).includes(value) ? (value as T) : undefined;
}

async function build(entity: string, sp: URLSearchParams): Promise<Response | null> {
  switch (entity) {
    case "clients": {
      const rows = (
        await getCustomers({
          ...base(sp),
          status: pick<CustomerStatus>(sp, "status", CUSTOMER_STATUSES),
          state: sp.get("state") ?? undefined,
        })
      ).items;
      const cols: ExportColumn<(typeof rows)[number]>[] = [
        { header: "Name", value: (r) => r.fullName, width: 30 },
        { header: "Email", value: (r) => r.email },
        { header: "Phone", value: (r) => r.phone },
        { header: "State", value: (r) => r.state },
        { header: "Status", value: (r) => r.status },
        { header: "Orders", value: (r) => r.orderCount },
        { header: "Address", value: (r) => r.address, width: 40 },
        { header: "Created", value: (r) => formatDate(r.createdAt) },
      ];
      return xlsxResponse("clients.xlsx", "Clients", cols, rows);
    }
    case "orders": {
      const rows = (
        await getOrders({ ...base(sp), status: pick<OrderStatus>(sp, "status", ORDER_STATUSES) })
      ).items;
      const cols: ExportColumn<(typeof rows)[number]>[] = [
        { header: "Order #", value: (r) => r.orderId },
        { header: "Client", value: (r) => r.customerName, width: 30 },
        { header: "Status", value: (r) => r.status },
        { header: "Items", value: (r) => r.itemCount },
        { header: "Total (INR)", value: (r) => r.totalAmount },
        { header: "Created", value: (r) => formatDate(r.createdAt) },
      ];
      return xlsxResponse("orders.xlsx", "Orders", cols, rows);
    }
    case "deliveries": {
      const rows = (
        await getDeliveries({ ...base(sp), status: pick<DeliveryStatus>(sp, "status", DELIVERY_STATUSES) })
      ).items;
      const cols: ExportColumn<(typeof rows)[number]>[] = [
        { header: "Delivery #", value: (r) => r.deliveryId },
        { header: "Client", value: (r) => r.customerName, width: 30 },
        { header: "Courier", value: (r) => r.courierName },
        { header: "Tracking", value: (r) => r.trackingNum },
        { header: "Status", value: (r) => r.status },
        { header: "Order total (INR)", value: (r) => r.orderTotal },
      ];
      return xlsxResponse("deliveries.xlsx", "Deliveries", cols, rows);
    }
    case "statements": {
      const rows = (await getStatements(base(sp))).items;
      const cols: ExportColumn<(typeof rows)[number]>[] = [
        { header: "Number", value: (r) => r.statementNumber },
        { header: "Client", value: (r) => r.customerName, width: 30 },
        { header: "Period", value: (r) => r.periodLabel, width: 30 },
        { header: "Uploaded", value: (r) => formatDate(r.uploadDate) },
        { header: "Uploaded by", value: (r) => r.uploadedByUsername },
      ];
      return xlsxResponse("statements.xlsx", "Statements", cols, rows);
    }
    case "products": {
      const rows = (await getProducts(base(sp))).items;
      const cols: ExportColumn<(typeof rows)[number]>[] = [
        { header: "Name", value: (r) => r.name, width: 30 },
        { header: "SKU", value: (r) => r.sku },
        { header: "Category", value: (r) => r.categoryName, width: 26 },
        { header: "Base price (INR)", value: (r) => r.basePrice },
        { header: "Slug", value: (r) => r.slug },
        { header: "Created", value: (r) => formatDate(r.createdAt) },
      ];
      return xlsxResponse("products.xlsx", "Products", cols, rows);
    }
    case "categories": {
      const rows = await getCategories();
      const cols: ExportColumn<(typeof rows)[number]>[] = [
        { header: "Name", value: (r) => r.categoryName, width: 30 },
        { header: "Description", value: (r) => r.description, width: 50 },
        { header: "Products", value: (r) => r.productCount },
        { header: "Created", value: (r) => formatDate(r.createdAt) },
      ];
      return xlsxResponse("categories.xlsx", "Categories", cols, rows);
    }
    case "inventory": {
      const rows = (await getInventory({ ...base(sp), lowStockOnly: sp.get("low") === "1" })).items;
      const cols: ExportColumn<(typeof rows)[number]>[] = [
        { header: "Product", value: (r) => r.productName, width: 30 },
        { header: "SKU", value: (r) => r.sku },
        { header: "Supplier", value: (r) => r.supplierName, width: 26 },
        { header: "Quantity", value: (r) => r.quantity },
        { header: "Last updated", value: (r) => formatDateTime(r.lastUpdated) },
      ];
      return xlsxResponse("inventory.xlsx", "Inventory", cols, rows);
    }
    case "suppliers": {
      const rows = (await getSuppliers(base(sp))).items;
      const cols: ExportColumn<(typeof rows)[number]>[] = [
        { header: "Company", value: (r) => r.companyName, width: 30 },
        { header: "Email", value: (r) => r.contactEmail },
        { header: "Phone", value: (r) => r.phone },
      ];
      return xlsxResponse("suppliers.xlsx", "Suppliers", cols, rows);
    }
    case "field-reports": {
      const rows = (
        await getFieldReports({ ...base(sp), status: pick<FieldReportStatus>(sp, "status", FIELD_REPORT_STATUSES) })
      ).items;
      const cols: ExportColumn<(typeof rows)[number]>[] = [
        { header: "Visit date", value: (r) => r.visitDate },
        { header: "Dealer", value: (r) => r.dealerName, width: 30 },
        { header: "Location", value: (r) => r.location, width: 26 },
        { header: "Status", value: (r) => r.status },
        { header: "Summary", value: (r) => r.summary, width: 60 },
        { header: "By", value: (r) => r.createdByUsername },
      ];
      return xlsxResponse("field-reports.xlsx", "Field reports", cols, rows);
    }
    case "feedback": {
      const rows = (
        await getFeedbackTickets({ ...base(sp), status: pick<FeedbackStatus>(sp, "status", FEEDBACK_STATUSES) })
      ).items;
      const cols: ExportColumn<(typeof rows)[number]>[] = [
        { header: "Subject", value: (r) => r.subject, width: 34 },
        { header: "Status", value: (r) => r.status },
        { header: "By", value: (r) => r.username },
        { header: "Created", value: (r) => formatDate(r.createdAt) },
        { header: "Message", value: (r) => r.message, width: 60 },
      ];
      return xlsxResponse("feedback.xlsx", "Feedback", cols, rows);
    }
    case "activity": {
      const rows = (
        await getActivityLogs({
          ...base(sp),
          actionType: pick<ActionType>(sp, "action", ACTION_TYPES),
          entityType: pick<EntityType>(sp, "entity", ENTITY_TYPES),
        })
      ).items;
      const cols: ExportColumn<(typeof rows)[number]>[] = [
        { header: "Event", value: (r) => r.summary, width: 44 },
        { header: "Action", value: (r) => r.actionType },
        { header: "Entity", value: (r) => r.entityType },
        { header: "When", value: (r) => formatDateTime(r.createdAt) },
      ];
      return xlsxResponse("activity-log.xlsx", "Activity", cols, rows);
    }
    case "quotations": {
      const rows = (
        await getQuotations({ ...base(sp), status: pick<QuotationStatus>(sp, "status", QUOTATION_STATUSES) })
      ).items;
      const cols: ExportColumn<(typeof rows)[number]>[] = [
        { header: "Number", value: (r) => r.quotationNumber },
        { header: "Client", value: (r) => r.customerName, width: 30 },
        { header: "Status", value: (r) => r.status },
        { header: "Assigned to", value: (r) => r.assignedStaffName },
        { header: "Total (INR)", value: (r) => r.totalAmount },
        { header: "Created", value: (r) => formatDate(r.createdAt) },
      ];
      return xlsxResponse("quotations.xlsx", "Quotations", cols, rows);
    }
    case "contact-inquiries": {
      const rows = (
        await getContactInquiries({ ...base(sp), subject: sp.get("subject") ?? undefined })
      ).items;
      const cols: ExportColumn<(typeof rows)[number]>[] = [
        { header: "Name", value: (r) => r.name, width: 26 },
        { header: "Organization", value: (r) => r.organization, width: 28 },
        { header: "Subject", value: (r) => CONTACT_SUBJECT_LABELS[r.subject] ?? r.subject, width: 22 },
        { header: "Phone", value: (r) => r.phone },
        { header: "Email", value: (r) => r.email, width: 26 },
        { header: "Message", value: (r) => r.message, width: 60 },
        { header: "Received", value: (r) => formatDateTime(r.createdAt) },
      ];
      return xlsxResponse("contact-inquiries.xlsx", "Contact inquiries", cols, rows);
    }
    case "public-feedback": {
      const rows = (
        await getPublicFeedback({ ...base(sp), role: sp.get("role") ?? undefined })
      ).items;
      const cols: ExportColumn<(typeof rows)[number]>[] = [
        { header: "Name", value: (r) => r.name, width: 26 },
        { header: "Role", value: (r) => PUBLIC_FEEDBACK_ROLE_LABELS[r.role] ?? r.role },
        { header: "Email", value: (r) => r.email, width: 26 },
        { header: "Message", value: (r) => r.message, width: 60 },
        { header: "Received", value: (r) => formatDateTime(r.createdAt) },
      ];
      return xlsxResponse("public-feedback.xlsx", "Public feedback", cols, rows);
    }
    case "settings": {
      const rows = await getSettings();
      const cols: ExportColumn<(typeof rows)[number]>[] = [
        { header: "Key", value: (r) => r.settingKey, width: 34 },
        { header: "Value", value: (r) => r.settingValue, width: 44 },
      ];
      return xlsxResponse("settings.xlsx", "Settings", cols, rows);
    }
    default:
      return null;
  }
}

export async function GET(request: NextRequest, ctx: { params: Promise<{ entity: string }> }) {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { entity } = await ctx.params;

  // The users export is admin/dev only, mirroring the Users module gate.
  if (entity === "users") {
    if (!ADMIN_ROLES.includes(session.role)) return new Response("Forbidden", { status: 403 });
    const sp = request.nextUrl.searchParams;
    const rows = (await getUsers(base(sp))).items;
    const cols: ExportColumn<(typeof rows)[number]>[] = [
      { header: "Username", value: (r) => r.username, width: 26 },
      { header: "Role", value: (r) => r.roleName },
      { header: "Created by", value: (r) => r.createdByUsername },
      { header: "Created", value: (r) => formatDate(r.createdAt) },
    ];
    return xlsxResponse("users.xlsx", "Users", cols, rows);
  }

  const response = await build(entity, request.nextUrl.searchParams);
  return response ?? new Response("Unknown export", { status: 404 });
}
