import { Layers } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { formatDate } from "@/lib/format";
import { getCategories } from "@/lib/services/products";
import type { CategoryWithProductCount } from "@/lib/types/catalog";
import { CategoryDelete } from "./category-delete";
import { CategoryDialog } from "./category-dialog";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const categories = await getCategories();

  const columns: DataTableColumn<CategoryWithProductCount>[] = [
    {
      key: "name",
      header: "Category",
      cell: (category) => (
        <div>
          <p className="font-medium">{category.categoryName}</p>
          <p className="line-clamp-1 max-w-md text-xs text-muted-foreground">
            {category.description}
          </p>
        </div>
      ),
    },
    {
      key: "products",
      header: "Products",
      cell: (category) =>
        category.productCount > 0 ? (
          <Link
            href={`/products?category=${category.categoryId}`}
            className="rounded-sm text-sm font-medium text-brand-600 hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {category.productCount} product{category.productCount === 1 ? "" : "s"}
          </Link>
        ) : (
          <span className="text-sm text-muted-foreground">None</span>
        ),
    },
    {
      key: "created",
      header: "Created",
      cell: (category) => (
        <span className="text-muted-foreground">{formatDate(category.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "w-20",
      cell: (category) => (
        <div className="flex items-center justify-end gap-1.5">
          <CategoryDialog category={category} />
          <CategoryDelete
            categoryId={category.categoryId}
            categoryName={category.categoryName}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Product categories shown on the public site and used across the catalog."
        actions={<CategoryDialog />}
      />
      <DataTable
        columns={columns}
        rows={categories}
        rowKey={(category) => category.categoryId}
        empty={{
          icon: Layers,
          title: "No categories yet",
          hint: "Create the first category to start organizing the catalog.",
          action: <CategoryDialog />,
        }}
      />
    </div>
  );
}
