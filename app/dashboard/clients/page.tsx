import { Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { ExportButton } from "@/components/shared/ExportButton";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { SortableHeader } from "@/components/shared/SortableHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { company } from "@/lib/config/company";
import { formatDate } from "@/lib/format";
import { getCustomers } from "@/lib/services/customers";
import type { CustomerWithStats } from "@/lib/types/customer";
import { CUSTOMER_STATUSES, type CustomerStatus } from "@/lib/types/database";
import { paramNumber, paramString } from "@/lib/url";
import { ClientDialog } from "./client-dialog";

export const metadata: Metadata = { title: "Clients" };

const PATH = "/dashboard/clients";

export default async function ClientsPage(props: PageProps<"/dashboard/clients">) {
  const searchParams = await props.searchParams;
  const statusParam = paramString(searchParams, "status");
  const status = CUSTOMER_STATUSES.includes(statusParam as CustomerStatus)
    ? (statusParam as CustomerStatus)
    : undefined;

  const page = await getCustomers({
    query: paramString(searchParams, "query"),
    page: paramNumber(searchParams, "page"),
    sort: paramString(searchParams, "sort"),
    dir: paramString(searchParams, "dir") === "desc" ? "desc" : "asc",
    status,
    state: paramString(searchParams, "state"),
  });

  const columns: DataTableColumn<CustomerWithStats>[] = [
    {
      key: "name",
      header: (
        <SortableHeader field="fullName" pathname={PATH} searchParams={searchParams}>
          Client
        </SortableHeader>
      ),
      cell: (customer) => (
        <div>
          <Link
            href={`/dashboard/clients/${customer.customerId}`}
            className="rounded-sm font-medium hover:text-brand-700 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {customer.fullName}
          </Link>
          <p className="text-xs text-muted-foreground">{customer.address}</p>
        </div>
      ),
    },
    {
      key: "state",
      header: (
        <SortableHeader field="state" pathname={PATH} searchParams={searchParams}>
          State
        </SortableHeader>
      ),
      cell: (customer) => customer.state,
    },
    {
      key: "phone",
      header: "Phone",
      cell: (customer) => <span className="text-muted-foreground">{customer.phone}</span>,
    },
    {
      key: "orders",
      header: (
        <SortableHeader field="orderCount" pathname={PATH} searchParams={searchParams}>
          Orders
        </SortableHeader>
      ),
      cell: (customer) => (
        <div>
          <p className="tabular-nums">{customer.orderCount}</p>
          {customer.lastOrderAt ? (
            <p className="text-xs text-muted-foreground">last {formatDate(customer.lastOrderAt)}</p>
          ) : null}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (customer) => <StatusBadge status={customer.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        description="Dealers, distributors, retailers, and institutional buyers."
        actions={
          <>
            <ExportButton entity="clients" searchParams={searchParams} />
            <ClientDialog />
          </>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect
            label="Status"
            param="status"
            options={CUSTOMER_STATUSES.map((s) => ({ value: s, label: s }))}
          />
          <FilterSelect
            label="State"
            param="state"
            allLabel="Both states"
            options={company.operatingStates.map((s) => ({ value: s, label: s }))}
          />
        </div>
        <SearchInput placeholder="Search clients…" />
      </div>

      <DataTable
        columns={columns}
        rows={page.items}
        rowKey={(customer) => customer.customerId}
        empty={{
          icon: Users,
          title: "No clients found",
          hint: "Adjust the filters, or add a new client record.",
          action: <ClientDialog />,
        }}
      />

      <DataTablePagination page={page} pathname={PATH} searchParams={searchParams} itemNoun="clients" />
    </div>
  );
}
