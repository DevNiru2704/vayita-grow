import "server-only";
import { db, latency } from "@/lib/mock/store";
import type { InventoryWithProduct } from "@/lib/types/inventory";
import type { OrderWithCustomer } from "@/lib/types/order";
import { getInventory } from "./inventory";
import { getOrders } from "./orders";

// MOCK IMPLEMENTATION - replace bodies with Supabase queries. Signatures are the contract.

export interface DashboardStat {
  label: string;
  value: number;
  hint: string;
}

export interface MonthlyOrderPoint {
  month: string;
  orders: number;
  revenue: number;
}

export async function getDashboardStats(): Promise<DashboardStat[]> {
  await latency();
  const data = db();
  const activeOrders = data.orders.filter(
    (o) => o.status === "Pending" || o.status === "Processing" || o.status === "Shipped",
  ).length;
  return [
    { label: "Clients", value: data.customers.length, hint: "Dealer & distributor accounts" },
    { label: "Open Orders", value: activeOrders, hint: "Pending, processing, or shipped" },
    { label: "Statements", value: data.statements.length, hint: "Uploaded account statements" },
    { label: "Field Reports", value: data.fieldReports.length, hint: "Dealer visits logged" },
  ];
}

/** Years that have at least one non-cancelled order in the mock data. */
export async function getAvailableYears(): Promise<number[]> {
  await latency();
  const orders = db().orders.filter((o) => o.status !== "Cancelled");
  const years = [...new Set(orders.map((o) => new Date(o.createdAt).getUTCFullYear()))].sort(
    (a, b) => b - a,
  );
  return years.length ? years : [new Date().getUTCFullYear()];
}

/** All 12 months (Jan–Dec) for the given year, zero-filled where there are no orders. */
export async function getMonthlyOrderSeries(year: number): Promise<MonthlyOrderPoint[]> {
  await latency();
  const orders = db().orders.filter((o) => o.status !== "Cancelled");
  const points: MonthlyOrderPoint[] = [];

  for (let month = 0; month < 12; month++) {
    const date = new Date(Date.UTC(year, month, 1));
    const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
    const inMonth = orders.filter((o) => o.createdAt.startsWith(prefix));
    points.push({
      month: date.toLocaleString("en-IN", { month: "short", timeZone: "UTC" }),
      orders: inMonth.length,
      revenue: inMonth.reduce((sum, o) => sum + o.totalAmount, 0),
    });
  }
  return points;
}

export async function getRecentOrders(limit: number): Promise<OrderWithCustomer[]> {
  const page = await getOrders({ page: 1, pageSize: limit, sort: "createdAt", dir: "desc" });
  return page.items;
}

export async function getLowStockItems(limit: number): Promise<InventoryWithProduct[]> {
  const page = await getInventory({
    lowStockOnly: true,
    page: 1,
    pageSize: limit,
    sort: "quantity",
    dir: "asc",
  });
  return page.items;
}
