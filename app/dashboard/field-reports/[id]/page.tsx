import { ArrowLeft, CalendarDays, MapPin, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate, formatDateTime } from "@/lib/format";
import { getFieldReportById } from "@/lib/services/field-reports";
import { ReportStatusButton } from "../report-status-button";

export const metadata: Metadata = { title: "Field report" };

export default async function FieldReportDetailPage(
  props: PageProps<"/dashboard/field-reports/[id]">,
) {
  const { id } = await props.params;
  const reportId = Number(id);
  if (!Number.isInteger(reportId)) notFound();

  const report = await getFieldReportById(reportId);
  if (!report) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/field-reports"
        className="inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <ArrowLeft aria-hidden className="size-4" />
        All field reports
      </Link>

      <PageHeader
        title={report.dealerName}
        description={`Field report #${report.reportId}`}
        actions={
          report.status === "Follow_Up_Required" ? (
            <ReportStatusButton reportId={report.reportId} />
          ) : undefined
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <section aria-label="Visit details" className="rounded-xl border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-sans text-base font-semibold">Visit</h2>
            <StatusBadge status={report.status} />
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2.5">
              <CalendarDays aria-hidden className="size-4 shrink-0 text-muted-foreground" />
              {formatDate(report.visitDate)}
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin aria-hidden className="size-4 shrink-0 text-muted-foreground" />
              {report.location}
            </li>
            <li className="flex items-center gap-2.5">
              <UserRound aria-hidden className="size-4 shrink-0 text-muted-foreground" />
              Reported by {report.createdByUsername}
            </li>
          </ul>
          {report.customerId ? (
            <Link
              href={`/dashboard/clients/${report.customerId}`}
              className="mt-4 inline-block rounded-sm text-sm font-medium text-brand-600 hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              View client record
            </Link>
          ) : null}
          <p className="mt-4 border-t pt-3 text-xs text-muted-foreground">
            Logged {formatDateTime(report.createdAt)}
          </p>
        </section>

        <section aria-labelledby="report-summary" className="rounded-xl border bg-card p-5 lg:col-span-2">
          <h2 id="report-summary" className="mb-3 font-sans text-base font-semibold">
            Summary
          </h2>
          <p className="text-sm leading-relaxed whitespace-pre-line">{report.summary}</p>
        </section>
      </div>
    </div>
  );
}
