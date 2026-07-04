import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { getCategories, getProductById } from "@/lib/services/products";
import { getProductImageOptions } from "../image-options";
import { ProductForm } from "../product-form";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage(
  props: PageProps<"/dashboard/catalog/products/[id]">,
) {
  const { id } = await props.params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) notFound();

  const [product, categories] = await Promise.all([
    getProductById(productId),
    getCategories(),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit ${product.name}`}
        description="Changes publish to the public site immediately."
      />
      <ProductForm
        product={product}
        categories={categories}
        imageOptions={getProductImageOptions()}
      />
    </div>
  );
}
