import { Inbox } from "lucide-react";
import type { Metadata } from "next";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { formatDateTime } from "@/lib/format";
import { getContactInquiries } from "@/lib/services/inquiries";
import {
  CONTACT_SUBJECTS,
  CONTACT_SUBJECT_LABELS,
} from "@/lib/types/inquiries";
import { paramNumber, paramString } from "@/lib/url";

export const metadata: Metadata = { title: "Contact inquiries" };

const PATH = "/dashboard/contact-inquiries";

export default async function ContactInquiriesPage(
  props: PageProps<"/dashboard/contact-inquiries">,
) {
  const searchParams = await props.searchParams;
  const subjectParam = paramString(searchParams, "subject");
  const subject =
    subjectParam && CONTACT_SUBJECTS.includes(subjectParam) ? subjectParam : undefined;

  const page = await getContactInquiries({
    page: paramNumber(searchParams, "page"),
    query: paramString(searchParams, "query"),
    subject,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact inquiries"
        description="Messages submitted through the public contact form."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterSelect
          label="Subject"
          param="subject"
          options={CONTACT_SUBJECTS.map((s) => ({ value: s, label: CONTACT_SUBJECT_LABELS[s] }))}
        />
        <SearchInput placeholder="Search inquiries…" />
      </div>

      {page.items.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No inquiries found"
          hint="New contact-form submissions will appear here."
        />
      ) : (
        <ul className="space-y-3">
          {page.items.map((inquiry) => (
            <li key={inquiry.inquiryId} className="rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-sans text-sm font-semibold">{inquiry.name}</h2>
                <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                  {CONTACT_SUBJECT_LABELS[inquiry.subject] ?? inquiry.subject}
                </span>
                {inquiry.organization ? (
                  <span className="text-xs text-muted-foreground">· {inquiry.organization}</span>
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{inquiry.message}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <a href={`tel:${inquiry.phone}`} className="hover:text-foreground">
                  {inquiry.phone}
                </a>
                {inquiry.email ? (
                  <a href={`mailto:${inquiry.email}`} className="hover:text-foreground">
                    {inquiry.email}
                  </a>
                ) : null}
                <span>{formatDateTime(inquiry.createdAt)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <DataTablePagination
        page={page}
        pathname={PATH}
        searchParams={searchParams}
        itemNoun="inquiries"
      />
    </div>
  );
}
