import {
  ArrowRight,
  ClipboardList,
  FileText,
  PackageOpen,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DashboardCharts } from "@/components/dashboard/charts/DashboardCharts";
import { getSession } from "@/lib/auth/session";
import { formatINR, formatNumber, formatDate } from "@/lib/format";
import {
  getDashboardStats,
  getAvailableYears,
  getLowStockItems,
  getMonthlyOrderSeries,
  type MonthlyOrderPoint,
} from "@/lib/services/dashboard";
import { getRecentOrders } from "@/lib/services/dashboard";
import { getOrderStats } from "@/lib/services/orders";
import { ORDER_STATUSES } from "@/lib/types/database";

const STAT_ICONS = [Users, ShoppingCart, FileText, ClipboardList];

/** Server action: refetch the 12-month series for a given year (called from DashboardCharts). */
async function fetchYearSeries(year: number): Promise<MonthlyOrderPoint[]> {
  "use server";
  return getMonthlyOrderSeries(year);
}

export default async function DashboardOverviewPage() {
  const currentYear = new Date().getFullYear();

  const [session, stats, availableYears, series, orderStats, recentOrders, lowStock] =
    await Promise.all([
      getSession(),
      getDashboardStats(),
      getAvailableYears(),
      getMonthlyOrderSeries(currentYear),
      getOrderStats(),
      getRecentOrders(6),
      getLowStockItems(5),
    ]);

  const statusData = ORDER_STATUSES.map((status) => ({
    status,
    count: orderStats.byStatus[status],
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${session?.username ?? "there"}`}
        description="A live overview of clients, orders, catalog, and field operations."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            hint={stat.hint}
            icon={STAT_ICONS[index]}
          />
        ))}
      </div>

      <DashboardCharts
        series={series}
        status={statusData}
        availableYears={availableYears}
        defaultYear={currentYear}
        fetchYearSeries={fetchYearSeries}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <section
          aria-labelledby="recent-orders-heading"
          className="rounded-xl border bg-card lg:col-span-2"
        >
          <div className="flex items-center justify-between gap-4 border-b p-5 pb-4">
            <h2 id="recent-orders-heading" className="font-sans text-base font-semibold">
              Recent orders
            </h2>
            <Link
              href="/dashboard/orders"
              className="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-brand-600 hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              View all
              <ArrowRight aria-hidden className="size-3.5" />
            </Link>
          </div>
          <ul className="divide-y">
            {recentOrders.map((order) => (
              <li key={order.orderId}>
                <Link
                  href={`/dashboard/orders/${order.orderId}`}
                  className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      #{order.orderId} · {formatDate(order.createdAt)} · {order.itemCount} item
                      {order.itemCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-medium">{formatINR(order.totalAmount)}</span>
                    <StatusBadge status={order.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="low-stock-heading" className="rounded-xl border bg-card">
          <div className="flex items-center justify-between gap-4 border-b p-5 pb-4">
            <h2 id="low-stock-heading" className="font-sans text-base font-semibold">
              Low stock
            </h2>
            <Link
              href="/dashboard/inventory?low=1"
              className="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-brand-600 hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              Inventory
              <ArrowRight aria-hidden className="size-3.5" />
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
              <PackageOpen aria-hidden className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                All products are above the low-stock threshold.
              </p>
            </div>
          ) : (
            <ul className="divide-y">
              {lowStock.map((item) => (
                <li key={item.inventoryId} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">{item.sku}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-status-warning-soft px-2.5 py-0.5 text-xs font-semibold text-status-warning">
                    {formatNumber(item.quantity)} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
