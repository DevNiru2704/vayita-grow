import { PackagePlus, PackageSearch, Plus } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { SortableHeader } from "@/components/shared/SortableHeader";
import { buttonVariants } from "@/components/ui/button";
import { formatINR, formatDate } from "@/lib/format";
import { getProducts } from "@/lib/services/products";
import type { ProductWithCategory } from "@/lib/types/catalog";
import { paramNumber, paramString } from "@/lib/url";
import { ProductRowActions } from "./product-row-actions";

export const metadata: Metadata = { title: "Products" };

const PATH = "/dashboard/catalog/products";

export default async function ProductsCmsPage(props: PageProps<"/dashboard/catalog/products">) {
  const searchParams = await props.searchParams;
  const page = await getProducts({
    query: paramString(searchParams, "query"),
    page: paramNumber(searchParams, "page"),
    sort: paramString(searchParams, "sort"),
    dir: paramString(searchParams, "dir") === "desc" ? "desc" : "asc",
  });

  const columns: DataTableColumn<ProductWithCategory>[] = [
    {
      key: "name",
      header: (
        <SortableHeader field="name" pathname={PATH} searchParams={searchParams}>
          Product
        </SortableHeader>
      ),
      cell: (product) => (
        <div className="flex items-center gap-3">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border bg-brand-50">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="2.5rem"
              />
            ) : null}
          </div>
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-xs text-muted-foreground">/products/{product.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "sku",
      header: (
        <SortableHeader field="sku" pathname={PATH} searchParams={searchParams}>
          SKU
        </SortableHeader>
      ),
      cell: (product) => <span className="text-muted-foreground">{product.sku}</span>,
    },
    {
      key: "category",
      header: "Category",
      cell: (product) => product.categoryName,
    },
    {
      key: "basePrice",
      header: (
        <SortableHeader field="basePrice" pathname={PATH} searchParams={searchParams}>
          Base price
        </SortableHeader>
      ),
      className: "text-right",
      cell: (product) => <span className="tabular-nums">{formatINR(product.basePrice)}</span>,
    },
    {
      key: "createdAt",
      header: (
        <SortableHeader field="createdAt" pathname={PATH} searchParams={searchParams}>
          Added
        </SortableHeader>
      ),
      cell: (product) => (
        <span className="text-muted-foreground">{formatDate(product.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "w-20",
      cell: (product) => (
        <ProductRowActions productId={product.productId} productName={product.name} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="The product catalog CMS - changes publish to the public site immediately."
        actions={
          <Link href="/dashboard/catalog/products/new" className={buttonVariants({ size: "lg" })}>
            <Plus aria-hidden data-icon="inline-start" />
            New product
          </Link>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchInput placeholder="Search products…" />
      </div>

      <DataTable
        columns={columns}
        rows={page.items}
        rowKey={(product) => product.productId}
        empty={{
          icon: PackageSearch,
          title: "No products found",
          hint: "Adjust your search, or add the first product to the catalog.",
          action: (
            <Link
              href="/dashboard/catalog/products/new"
              className={buttonVariants({ variant: "secondary" })}
            >
              <PackagePlus aria-hidden data-icon="inline-start" />
              Add product
            </Link>
          ),
        }}
      />

      <DataTablePagination
        page={page}
        pathname={PATH}
        searchParams={searchParams}
        itemNoun="products"
      />
    </div>
  );
}
