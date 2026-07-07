import "server-only";
import { query, queryOne } from "@/lib/db/query";
import type { InventoryWithProduct } from "@/lib/types/inventory";
import type { OrderWithCustomer } from "@/lib/types/order";
import type { DashboardStat, MonthlyOrderPoint } from "./dashboard.mock";
import { getInventory } from "./inventory.pg";
import { getOrders } from "./orders.pg";

export async function getDashboardStats(): Promise<DashboardStat[]> {
  const row = await queryOne<{
    clients: number;
    activeOrders: number;
    statements: number;
    fieldReports: number;
  }>(
    `SELECT
       (SELECT COUNT(*) FROM customers)::int AS clients,
       (SELECT COUNT(*) FROM orders WHERE status IN ('Pending','Processing','Shipped'))::int AS active_orders,
       (SELECT COUNT(*) FROM statements)::int AS statements,
       (SELECT COUNT(*) FROM field_reports)::int AS field_reports`,
  );
  return [
    { label: "Clients", value: row?.clients ?? 0, hint: "Dealer & distributor accounts" },
    { label: "Open Orders", value: row?.activeOrders ?? 0, hint: "Pending, processing, or shipped" },
    { label: "Statements", value: row?.statements ?? 0, hint: "Uploaded account statements" },
    { label: "Field Reports", value: row?.fieldReports ?? 0, hint: "Dealer visits logged" },
  ];
}

/** Orders/revenue per month for the trailing 6 months, derived from real order rows. */
export async function getMonthlyOrderSeries(): Promise<MonthlyOrderPoint[]> {
  const orders = await query<{ createdAt: string; totalAmount: number }>(
    "SELECT created_at, total_amount FROM orders WHERE status <> 'Cancelled'",
  );
  const points: MonthlyOrderPoint[] = [];
  const now = new Date();

  for (let offset = 5; offset >= 0; offset--) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
    const prefix = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
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
