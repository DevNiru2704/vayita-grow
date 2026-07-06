import { FileText } from "lucide-react";
import type { Metadata } from "next";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { SortableHeader } from "@/components/shared/SortableHeader";
import { formatDate } from "@/lib/format";
import { getCustomerOptions } from "@/lib/services/customers";
import { getStatements } from "@/lib/services/statements";
import type { StatementWithCustomer } from "@/lib/types/statement";
import { paramNumber, paramString } from "@/lib/url";
import { StatementDialog } from "./statement-dialog";

export const metadata: Metadata = { title: "Statements" };

const PATH = "/dashboard/statements";

export default async function StatementsPage(props: PageProps<"/dashboard/statements">) {
  const searchParams = await props.searchParams;
  const [page, customers] = await Promise.all([
    getStatements({
      query: paramString(searchParams, "query"),
      page: paramNumber(searchParams, "page"),
      sort: paramString(searchParams, "sort"),
      dir: paramString(searchParams, "dir") === "asc" ? "asc" : "desc",
    }),
    getCustomerOptions(),
  ]);

  const columns: DataTableColumn<StatementWithCustomer>[] = [
    {
      key: "number",
      header: "Statement",
      cell: (statement) => <span className="font-medium">{statement.statementNumber}</span>,
    },
    {
      key: "customer",
      header: (
        <SortableHeader field="customerName" pathname={PATH} searchParams={searchParams}>
          Client
        </SortableHeader>
      ),
      cell: (statement) => statement.customerName,
    },
    {
      key: "period",
      header: "Period",
      cell: (statement) => <span className="text-muted-foreground">{statement.periodLabel}</span>,
    },
    {
      key: "uploaded",
      header: (
        <SortableHeader field="uploadDate" pathname={PATH} searchParams={searchParams}>
          Uploaded
        </SortableHeader>
      ),
      cell: (statement) => (
        <div>
          <p>{formatDate(statement.uploadDate)}</p>
          <p className="text-xs text-muted-foreground">by {statement.uploadedByUsername}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Statements"
        description="Account statements uploaded for dealers and distributors."
        actions={<StatementDialog customers={customers} />}
      />

      <div className="flex justify-end">
        <SearchInput placeholder="Search statements…" />
      </div>

      <DataTable
        columns={columns}
        rows={page.items}
        rowKey={(statement) => statement.statementId}
        empty={{
          icon: FileText,
          title: "No statements found",
          hint: "Upload a statement to make it available for the client's account.",
          action: <StatementDialog customers={customers} />,
        }}
      />

      <DataTablePagination page={page} pathname={PATH} searchParams={searchParams} itemNoun="statements" />
    </div>
  );
}
