import { MessagesSquare } from "lucide-react";
import type { Metadata } from "next";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { formatDateTime } from "@/lib/format";
import { getPublicFeedback } from "@/lib/services/inquiries";
import {
  PUBLIC_FEEDBACK_ROLE_LABELS,
  PUBLIC_FEEDBACK_ROLES,
} from "@/lib/types/inquiries";
import { paramNumber, paramString } from "@/lib/url";

export const metadata: Metadata = { title: "Public feedback" };

const PATH = "/dashboard/public-feedback";

export default async function PublicFeedbackPage(
  props: PageProps<"/dashboard/public-feedback">,
) {
  const searchParams = await props.searchParams;
  const roleParam = paramString(searchParams, "role");
  const role = roleParam && PUBLIC_FEEDBACK_ROLES.includes(roleParam) ? roleParam : undefined;

  const page = await getPublicFeedback({
    page: paramNumber(searchParams, "page"),
    query: paramString(searchParams, "query"),
    role,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Public feedback"
        description="Feedback submitted through the public feedback page."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterSelect
          label="Role"
          param="role"
          options={PUBLIC_FEEDBACK_ROLES.map((r) => ({
            value: r,
            label: PUBLIC_FEEDBACK_ROLE_LABELS[r],
          }))}
        />
        <SearchInput placeholder="Search feedback…" />
      </div>

      {page.items.length === 0 ? (
        <EmptyState
          icon={MessagesSquare}
          title="No feedback found"
          hint="New public feedback submissions will appear here."
        />
      ) : (
        <ul className="space-y-3">
          {page.items.map((entry) => (
            <li key={entry.feedbackId} className="rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-sans text-sm font-semibold">{entry.name}</h2>
                <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                  {PUBLIC_FEEDBACK_ROLE_LABELS[entry.role] ?? entry.role}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{entry.message}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {entry.email ? (
                  <a href={`mailto:${entry.email}`} className="hover:text-foreground">
                    {entry.email}
                  </a>
                ) : null}
                <span>{formatDateTime(entry.createdAt)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <DataTablePagination
        page={page}
        pathname={PATH}
        searchParams={searchParams}
        itemNoun="entries"
      />
    </div>
  );
}
