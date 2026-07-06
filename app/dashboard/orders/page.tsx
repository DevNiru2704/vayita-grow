import { Plus, ShoppingCart } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { FilterPills } from "@/components/shared/FilterPills";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { SortableHeader } from "@/components/shared/SortableHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import { formatDate, formatINR } from "@/lib/format";
import { getOrders } from "@/lib/services/orders";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types/database";
import type { OrderWithCustomer } from "@/lib/types/order";
import { paramNumber, paramString } from "@/lib/url";

export const metadata: Metadata = { title: "Orders" };

const PATH = "/dashboard/orders";

export default async function OrdersPage(props: PageProps<"/dashboard/orders">) {
  const searchParams = await props.searchParams;
  const statusParam = paramString(searchParams, "status");
  const status = ORDER_STATUSES.includes(statusParam as OrderStatus)
    ? (statusParam as OrderStatus)
    : undefined;

  const page = await getOrders({
    query: paramString(searchParams, "query"),
    page: paramNumber(searchParams, "page"),
    sort: paramString(searchParams, "sort"),
    dir: paramString(searchParams, "dir") === "asc" ? "asc" : "desc",
    status,
  });

  const columns: DataTableColumn<OrderWithCustomer>[] = [
    {
      key: "order",
      header: "Order",
      cell: (order) => (
        <Link
          href={`/dashboard/orders/${order.orderId}`}
          className="rounded-sm font-medium hover:text-brand-700 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          #{order.orderId}
        </Link>
      ),
    },
    {
      key: "customer",
      header: (
        <SortableHeader field="customerName" pathname={PATH} searchParams={searchParams}>
          Client
        </SortableHeader>
      ),
      cell: (order) => order.customerName,
    },
    {
      key: "date",
      header: (
        <SortableHeader field="createdAt" pathname={PATH} searchParams={searchParams}>
          Date
        </SortableHeader>
      ),
      cell: (order) => <span className="text-muted-foreground">{formatDate(order.createdAt)}</span>,
    },
    {
      key: "items",
      header: "Items",
      cell: (order) => <span className="tabular-nums">{order.itemCount}</span>,
    },
    {
      key: "total",
      header: (
        <SortableHeader field="totalAmount" pathname={PATH} searchParams={searchParams}>
          Total
        </SortableHeader>
      ),
      className: "text-right",
      cell: (order) => <span className="tabular-nums">{formatINR(order.totalAmount)}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (order) => <StatusBadge status={order.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Client orders across both operating states."
        actions={
          <Link href="/dashboard/orders/new" className={buttonVariants({ size: "lg" })}>
            <Plus aria-hidden data-icon="inline-start" />
            New order
          </Link>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterPills
          param="status"
          pathname={PATH}
          searchParams={searchParams}
          options={ORDER_STATUSES.map((s) => ({ value: s, label: s }))}
        />
        <SearchInput placeholder="Search orders…" />
      </div>

      <DataTable
        columns={columns}
        rows={page.items}
        rowKey={(order) => order.orderId}
        empty={{
          icon: ShoppingCart,
          title: "No orders found",
          hint: "Adjust the filters, or record a new order for a client.",
          action: (
            <Link href="/dashboard/orders/new" className={buttonVariants({ variant: "secondary" })}>
              <Plus aria-hidden data-icon="inline-start" />
              New order
            </Link>
          ),
        }}
      />

      <DataTablePagination page={page} pathname={PATH} searchParams={searchParams} itemNoun="orders" />
    </div>
  );
}
