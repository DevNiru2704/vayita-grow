import { MessageSquare } from "lucide-react";
import type { Metadata } from "next";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { ExportButton } from "@/components/shared/ExportButton";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateTime } from "@/lib/format";
import { getFeedbackTickets } from "@/lib/services/feedback";
import { FEEDBACK_STATUSES, enumLabel, type FeedbackStatus } from "@/lib/types/database";
import { paramNumber, paramString } from "@/lib/url";
import { NewTicketDialog, TicketStatusSelect } from "./feedback-controls";

export const metadata: Metadata = { title: "Feedback" };

const PATH = "/dashboard/feedback";

export default async function FeedbackTicketsPage(props: PageProps<"/dashboard/feedback">) {
  const searchParams = await props.searchParams;
  const statusParam = paramString(searchParams, "status");
  const status = FEEDBACK_STATUSES.includes(statusParam as FeedbackStatus)
    ? (statusParam as FeedbackStatus)
    : undefined;

  const page = await getFeedbackTickets({
    page: paramNumber(searchParams, "page"),
    status,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Feedback tickets"
        description="Internal operational feedback and requests from the team."
        actions={
          <>
            <ExportButton entity="feedback" searchParams={searchParams} />
            <NewTicketDialog />
          </>
        }
      />

      <FilterSelect
        label="Status"
        param="status"
        options={FEEDBACK_STATUSES.map((s) => ({ value: s, label: enumLabel(s) }))}
      />

      {page.items.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No tickets found"
          hint="Adjust the filter, or raise a new internal ticket."
          action={<NewTicketDialog />}
        />
      ) : (
        <ul className="space-y-3">
          {page.items.map((ticket) => (
            <li
              key={ticket.feedbackId}
              className="flex flex-col gap-3 rounded-xl border bg-card p-5 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-sans text-sm font-semibold">{ticket.subject}</h2>
                  <StatusBadge status={ticket.status} />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{ticket.message}</p>
                <p className="text-xs text-muted-foreground">
                  #{ticket.feedbackId} · {ticket.username} · {formatDateTime(ticket.createdAt)}
                </p>
              </div>
              <TicketStatusSelect feedbackId={ticket.feedbackId} status={ticket.status} />
            </li>
          ))}
        </ul>
      )}

      <DataTablePagination page={page} pathname={PATH} searchParams={searchParams} itemNoun="tickets" />
    </div>
  );
}
