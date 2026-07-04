import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { getCategories } from "@/lib/services/products";
import { getProductImageOptions } from "../image-options";
import { ProductForm } from "../product-form";

export const metadata: Metadata = { title: "New product" };

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <PageHeader
        title="New product"
        description="Add a product to the catalog. It appears on the public site as soon as it is created."
      />
      <ProductForm categories={categories} imageOptions={getProductImageOptions()} />
    </div>
  );
}
