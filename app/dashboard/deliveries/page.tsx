import { Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { FilterPills } from "@/components/shared/FilterPills";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatINR } from "@/lib/format";
import { getDeliveries } from "@/lib/services/deliveries";
import { DELIVERY_STATUSES, enumLabel, type DeliveryStatus } from "@/lib/types/database";
import type { DeliveryWithOrder } from "@/lib/types/delivery";
import { paramNumber, paramString } from "@/lib/url";

export const metadata: Metadata = { title: "Deliveries" };

const PATH = "/dashboard/deliveries";

export default async function DeliveriesPage(props: PageProps<"/dashboard/deliveries">) {
  const searchParams = await props.searchParams;
  const statusParam = paramString(searchParams, "status");
  const status = DELIVERY_STATUSES.includes(statusParam as DeliveryStatus)
    ? (statusParam as DeliveryStatus)
    : undefined;

  const page = await getDeliveries({
    query: paramString(searchParams, "query"),
    page: paramNumber(searchParams, "page"),
    status,
  });

  const columns: DataTableColumn<DeliveryWithOrder>[] = [
    {
      key: "delivery",
      header: "Delivery",
      cell: (delivery) => (
        <Link
          href={`/dashboard/deliveries/${delivery.deliveryId}`}
          className="rounded-sm font-medium hover:text-brand-700 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          #{delivery.deliveryId}
        </Link>
      ),
    },
    {
      key: "order",
      header: "Order",
      cell: (delivery) => (
        <Link
          href={`/dashboard/orders/${delivery.orderId}`}
          className="rounded-sm text-muted-foreground hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          #{delivery.orderId} · {formatINR(delivery.orderTotal)}
        </Link>
      ),
    },
    {
      key: "customer",
      header: "Client",
      cell: (delivery) => delivery.customerName,
    },
    {
      key: "courier",
      header: "Courier",
      cell: (delivery) => (
        <div>
          <p>{delivery.courierName ?? "-"}</p>
          <p className="text-xs text-muted-foreground">{delivery.trackingNum ?? ""}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (delivery) => <StatusBadge status={delivery.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deliveries"
        description="Shipments created from orders, with courier and transit tracking."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterPills
          param="status"
          pathname={PATH}
          searchParams={searchParams}
          options={DELIVERY_STATUSES.map((s) => ({ value: s, label: enumLabel(s) }))}
        />
        <SearchInput placeholder="Search deliveries…" />
      </div>

      <DataTable
        columns={columns}
        rows={page.items}
        rowKey={(delivery) => delivery.deliveryId}
        empty={{
          icon: Truck,
          title: "No deliveries found",
          hint: "Deliveries are created from an order's detail page once it is ready to dispatch.",
        }}
      />

      <DataTablePagination page={page} pathname={PATH} searchParams={searchParams} itemNoun="deliveries" />
    </div>
  );
}
