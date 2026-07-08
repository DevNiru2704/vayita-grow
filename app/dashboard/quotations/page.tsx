import { FileText, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { ExportButton } from "@/components/shared/ExportButton";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { SortableHeader } from "@/components/shared/SortableHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { getSession } from "@/lib/auth/session";
import { formatDate, formatINR } from "@/lib/format";
import { getQuotations } from "@/lib/services/quotations";
import { QUOTATION_STATUSES, type QuotationStatus } from "@/lib/types/database";
import type { QuotationWithCustomer } from "@/lib/types/quotation";
import { paramNumber, paramString } from "@/lib/url";

export const metadata: Metadata = { title: "Quotations" };

const PATH = "/dashboard/quotations";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function QuotationsPage({ searchParams: sp }: Props) {
  const searchParams = await sp;
  const statusParam = paramString(searchParams, "status");
  const status = QUOTATION_STATUSES.includes(statusParam as QuotationStatus)
    ? (statusParam as QuotationStatus)
    : undefined;

  const [page, session] = await Promise.all([
    getQuotations({
      query: paramString(searchParams, "query"),
      page: paramNumber(searchParams, "page"),
      sort: paramString(searchParams, "sort"),
      dir: paramString(searchParams, "dir") === "asc" ? "asc" : "desc",
      status,
    }),
    getSession(),
  ]);
  const canManage = session ? ADMIN_ROLES.includes(session.role) : false;

  const newButton = (
    <Link href="/dashboard/quotations/new" className={buttonVariants({ size: "lg" })}>
      <Plus aria-hidden data-icon="inline-start" />
      New quotation
    </Link>
  );

  const columns: DataTableColumn<QuotationWithCustomer>[] = [
    {
      key: "number",
      header: "Quotation",
      cell: (q) => (
        <Link
          href={`/dashboard/quotations/${q.quotationId}`}
          className="rounded-sm font-medium hover:text-brand-700 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {q.quotationNumber}
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
      cell: (q) => q.customerName,
    },
    {
      key: "date",
      header: (
        <SortableHeader field="createdAt" pathname={PATH} searchParams={searchParams}>
          Created
        </SortableHeader>
      ),
      cell: (q) => <span className="text-muted-foreground">{formatDate(q.createdAt)}</span>,
    },
    {
      key: "assigned",
      header: "Assigned to",
      cell: (q) => (
        <span className="text-muted-foreground">{q.assignedStaffName ?? "—"}</span>
      ),
    },
    {
      key: "total",
      header: (
        <SortableHeader field="totalAmount" pathname={PATH} searchParams={searchParams}>
          Total
        </SortableHeader>
      ),
      className: "text-right",
      cell: (q) => <span className="tabular-nums">{formatINR(q.totalAmount)}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (q) => <StatusBadge status={q.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quotations"
        description="Draft price quotations and assign them to field staff."
        actions={
          <>
            <ExportButton entity="quotations" searchParams={searchParams} />
            {canManage ? newButton : null}
          </>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterSelect
          label="Status"
          param="status"
          options={QUOTATION_STATUSES.map((s) => ({ value: s, label: s }))}
        />
        <SearchInput placeholder="Search quotations…" />
      </div>

      <DataTable
        columns={columns}
        rows={page.items}
        rowKey={(q) => q.quotationId}
        empty={{
          icon: FileText,
          title: "No quotations found",
          hint: canManage
            ? "Adjust the filters, or draft a new quotation for a client."
            : "Quotations assigned to you will appear here.",
          action: canManage ? newButton : undefined,
        }}
      />

      <DataTablePagination page={page} pathname={PATH} searchParams={searchParams} itemNoun="quotations" />
    </div>
  );
}
