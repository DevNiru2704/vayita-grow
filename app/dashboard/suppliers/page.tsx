import { Boxes } from "lucide-react";
import type { Metadata } from "next";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { getSuppliers } from "@/lib/services/inventory";
import type { Supplier } from "@/lib/types/inventory";
import { paramNumber, paramString } from "@/lib/url";
import { SupplierDialog } from "./supplier-dialog";

export const metadata: Metadata = { title: "Suppliers" };

const PATH = "/dashboard/suppliers";

export default async function SuppliersPage(props: PageProps<"/dashboard/suppliers">) {
  const searchParams = await props.searchParams;
  const page = await getSuppliers({
    query: paramString(searchParams, "query"),
    page: paramNumber(searchParams, "page"),
  });

  const columns: DataTableColumn<Supplier>[] = [
    {
      key: "name",
      header: "Supplier",
      cell: (supplier) => <span className="font-medium">{supplier.companyName}</span>,
    },
    {
      key: "email",
      header: "Email",
      cell: (supplier) => (
        <span className="text-muted-foreground">{supplier.contactEmail ?? "-"}</span>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      cell: (supplier) => <span className="text-muted-foreground">{supplier.phone ?? "-"}</span>,
    },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "w-16 text-right",
      cell: (supplier) => <SupplierDialog supplier={supplier} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        description="Raw material and packaging suppliers referenced by inventory."
        actions={<SupplierDialog />}
      />
      <div className="flex justify-end">
        <SearchInput placeholder="Search suppliers…" />
      </div>
      <DataTable
        columns={columns}
        rows={page.items}
        rowKey={(supplier) => supplier.supplierId}
        empty={{
          icon: Boxes,
          title: "No suppliers found",
          hint: "Add suppliers to link them with inventory records.",
          action: <SupplierDialog />,
        }}
      />
      <DataTablePagination page={page} pathname={PATH} searchParams={searchParams} itemNoun="suppliers" />
    </div>
  );
}
