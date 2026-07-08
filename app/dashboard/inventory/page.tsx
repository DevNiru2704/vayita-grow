import { Warehouse } from "lucide-react";
import type { Metadata } from "next";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { ExportButton } from "@/components/shared/ExportButton";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { SortableHeader } from "@/components/shared/SortableHeader";
import { formatDateTime, formatNumber } from "@/lib/format";
import { getInventory, getInventoryLogs, getLowStockThreshold } from "@/lib/services/inventory";
import type { InventoryWithProduct } from "@/lib/types/inventory";
import { paramNumber, paramString } from "@/lib/url";
import { AdjustStockDialog } from "./adjust-stock-dialog";

export const metadata: Metadata = { title: "Inventory" };

const PATH = "/dashboard/inventory";

export default async function InventoryPage(props: PageProps<"/dashboard/inventory">) {
  const searchParams = await props.searchParams;
  const lowOnly = paramString(searchParams, "low") === "1";

  const [page, logs, threshold] = await Promise.all([
    getInventory({
      query: paramString(searchParams, "query"),
      page: paramNumber(searchParams, "page"),
      sort: paramString(searchParams, "sort"),
      dir: paramString(searchParams, "dir") === "desc" ? "desc" : "asc",
      lowStockOnly: lowOnly,
    }),
    getInventoryLogs({ pageSize: 6 }),
    getLowStockThreshold(),
  ]);

  const columns: DataTableColumn<InventoryWithProduct>[] = [
    {
      key: "product",
      header: (
        <SortableHeader field="productName" pathname={PATH} searchParams={searchParams}>
          Product
        </SortableHeader>
      ),
      cell: (record) => (
        <div>
          <p className="font-medium">{record.productName}</p>
          <p className="text-xs text-muted-foreground">{record.sku}</p>
        </div>
      ),
    },
    {
      key: "supplier",
      header: "Supplier",
      cell: (record) => (
        <span className="text-muted-foreground">{record.supplierName ?? "-"}</span>
      ),
    },
    {
      key: "quantity",
      header: (
        <SortableHeader field="quantity" pathname={PATH} searchParams={searchParams}>
          In stock
        </SortableHeader>
      ),
      cell: (record) => (
        <span className="inline-flex items-center gap-2 tabular-nums">
          {formatNumber(record.quantity)}
          {record.quantity <= threshold ? (
            <span className="rounded-full bg-status-warning-soft px-2 py-0.5 text-xs font-semibold text-status-warning">
              Low
            </span>
          ) : null}
        </span>
      ),
    },
    {
      key: "updated",
      header: (
        <SortableHeader field="lastUpdated" pathname={PATH} searchParams={searchParams}>
          Last updated
        </SortableHeader>
      ),
      cell: (record) => (
        <span className="text-muted-foreground">{formatDateTime(record.lastUpdated)}</span>
      ),
    },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "w-28 text-right",
      cell: (record) => (
        <AdjustStockDialog
          inventoryId={record.inventoryId}
          productName={record.productName}
          currentQuantity={record.quantity}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description={`Stock levels per product. Items at or below ${threshold} units are flagged as low.`}
        actions={<ExportButton entity="inventory" searchParams={searchParams} />}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterSelect
          label="Stock"
          param="low"
          allLabel="All stock"
          options={[{ value: "1", label: "Low stock only" }]}
        />
        <SearchInput placeholder="Search inventory…" />
      </div>

      <DataTable
        columns={columns}
        rows={page.items}
        rowKey={(record) => record.inventoryId}
        empty={{
          icon: Warehouse,
          title: lowOnly ? "No low-stock items" : "No inventory records",
          hint: lowOnly
            ? "Every product is above the low-stock threshold."
            : "Inventory records are created automatically when products are added.",
        }}
      />

      <DataTablePagination page={page} pathname={PATH} searchParams={searchParams} itemNoun="items" />

      <section aria-labelledby="recent-adjustments" className="rounded-xl border bg-card">
        <h2 id="recent-adjustments" className="border-b p-5 pb-4 font-sans text-base font-semibold">
          Recent adjustments
        </h2>
        <ul className="divide-y">
          {logs.items.map((log) => (
            <li key={log.logId} className="flex items-center justify-between gap-4 px-5 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{log.productName}</p>
                <p className="text-xs text-muted-foreground">
                  {log.reason} · by {log.username} · {formatDateTime(log.createdAt)}
                </p>
              </div>
              <span
                className={
                  log.changeAmount > 0
                    ? "shrink-0 text-sm font-semibold text-status-success tabular-nums"
                    : "shrink-0 text-sm font-semibold text-status-danger tabular-nums"
                }
              >
                {log.changeAmount > 0 ? "+" : ""}
                {formatNumber(log.changeAmount)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
