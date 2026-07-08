import { ClipboardList, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { ExportButton } from "@/components/shared/ExportButton";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/format";
import { getCustomerOptions } from "@/lib/services/customers";
import { getFieldReports } from "@/lib/services/field-reports";
import { FIELD_REPORT_STATUSES, enumLabel, type FieldReportStatus } from "@/lib/types/database";
import { paramNumber, paramString } from "@/lib/url";
import { ReportDialog } from "./report-dialog";

export const metadata: Metadata = { title: "Field Reports" };

const PATH = "/dashboard/field-reports";

export default async function FieldReportsPage(props: PageProps<"/dashboard/field-reports">) {
  const searchParams = await props.searchParams;
  const statusParam = paramString(searchParams, "status");
  const status = FIELD_REPORT_STATUSES.includes(statusParam as FieldReportStatus)
    ? (statusParam as FieldReportStatus)
    : undefined;

  const [page, customers] = await Promise.all([
    getFieldReports({
      query: paramString(searchParams, "query"),
      page: paramNumber(searchParams, "page"),
      status,
    }),
    getCustomerOptions(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Field reports"
        description="Dealer visits, demonstrations, and farmer meetings logged by the field team."
        actions={
          <>
            <ExportButton entity="field-reports" searchParams={searchParams} />
            <ReportDialog customers={customers} />
          </>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterSelect
          label="Status"
          param="status"
          options={FIELD_REPORT_STATUSES.map((s) => ({ value: s, label: enumLabel(s) }))}
        />
        <SearchInput placeholder="Search reports…" />
      </div>

      {page.items.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No field reports found"
          hint="Adjust the filters, or log a new dealer visit."
          action={<ReportDialog customers={customers} />}
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {page.items.map((report) => (
            <li key={report.reportId}>
              <Link
                href={`/dashboard/field-reports/${report.reportId}`}
                className="flex h-full flex-col gap-3 rounded-xl border bg-card p-5 transition-[box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-sans text-sm font-semibold">{report.dealerName}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin aria-hidden className="size-3" />
                      {report.location}
                    </p>
                  </div>
                  <StatusBadge status={report.status} />
                </div>
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {report.summary}
                </p>
                <p className="mt-auto pt-1 text-xs text-muted-foreground">
                  Visited {formatDate(report.visitDate)} · by {report.createdByUsername}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <DataTablePagination page={page} pathname={PATH} searchParams={searchParams} itemNoun="reports" />
    </div>
  );
}
