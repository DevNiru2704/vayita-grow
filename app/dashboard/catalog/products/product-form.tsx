"use client";

import { Save } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { FormField, fieldAria } from "@/components/shared/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProduct, updateProduct } from "@/lib/actions/products";
import type { ProductInput, ProductWithDetails } from "@/lib/types/catalog";

interface CategoryOption {
  categoryId: number;
  categoryName: string;
}

/** Form state mirrors ProductInput but keeps list fields as editable text. */
interface FormValues {
  name: string;
  slug: string;
  sku: string;
  categoryId: number;
  basePrice: string;
  shortDescription: string;
  description: string;
  benefitsText: string;
  dosage: string;
  composition: string;
  packSizesText: string;
  imageUrl: string;
  imageCutoutUrl: string;
}

function toInput(values: FormValues): ProductInput {
  return {
    name: values.name,
    slug: values.slug,
    sku: values.sku,
    categoryId: values.categoryId,
    basePrice: Number(values.basePrice),
    description: values.description,
    shortDescription: values.shortDescription,
    benefits: values.benefitsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    dosage: values.dosage,
    composition: values.composition.trim() || null,
    packSizes: values.packSizesText
      .split(",")
      .map((size) => size.trim())
      .filter(Boolean),
    imageUrl: values.imageUrl || null,
    imageCutoutUrl: values.imageCutoutUrl || null,
  };
}

export function ProductForm({
  product,
  categories,
  imageOptions,
}: {
  /** Present in edit mode; absent when creating. */
  product?: ProductWithDetails;
  categories: CategoryOption[];
  /** Known asset paths under public/products for the demo image pickers. */
  imageOptions: string[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [values, setValues] = useState<FormValues>({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    sku: product?.sku ?? "",
    categoryId: product?.categoryId ?? categories[0]?.categoryId ?? 0,
    basePrice: product ? String(product.basePrice) : "",
    shortDescription: product?.details.shortDescription ?? "",
    description: product?.description ?? "",
    benefitsText: product?.details.benefits.join("\n") ?? "",
    dosage: product?.details.dosage ?? "",
    composition: product?.details.composition ?? "",
    packSizesText: product?.details.packSizes.join(", ") ?? "",
    imageUrl: product?.imageUrl ?? "",
    imageCutoutUrl: product?.details.imageCutoutUrl ?? "",
  });

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const input = toInput(values);
      const result = product
        ? await updateProduct(product.productId, input)
        : await createProduct(input);

      if (result.ok) {
        toast.success(product ? "Product updated" : "Product created", {
          description: "Changes are live on the public site immediately.",
        });
        router.push("/dashboard/catalog/products");
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.error);
      }
    });
  }

  const selectClass =
    "flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div className="rounded-xl border bg-card p-5">
          <h2 className="mb-5 font-sans text-sm font-semibold">Basic information</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="p-name" label="Product name" errors={fieldErrors.name}>
              <Input
                {...fieldAria("p-name", fieldErrors.name)}
                value={values.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </FormField>
            <FormField
              id="p-slug"
              label="URL slug"
              hint="Used in the public URL: /products/<slug>"
              errors={fieldErrors.slug}
            >
              <Input
                {...fieldAria("p-slug", fieldErrors.slug)}
                value={values.slug}
                onChange={(e) => update("slug", e.target.value.toUpperCase())}
                required
              />
            </FormField>
            <FormField id="p-sku" label="SKU" errors={fieldErrors.sku}>
              <Input
                {...fieldAria("p-sku", fieldErrors.sku)}
                value={values.sku}
                onChange={(e) => update("sku", e.target.value.toUpperCase())}
                required
              />
            </FormField>
            <FormField id="p-category" label="Category" errors={fieldErrors.categoryId}>
              <select
                {...fieldAria("p-category", fieldErrors.categoryId)}
                value={values.categoryId}
                onChange={(e) => update("categoryId", Number(e.target.value))}
                className={selectClass}
              >
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField
              id="p-price"
              label="Base price (₹)"
              hint="Dealer price used in orders - not shown on the public site."
              errors={fieldErrors.basePrice}
            >
              <Input
                {...fieldAria("p-price", fieldErrors.basePrice)}
                type="number"
                min="1"
                step="1"
                value={values.basePrice}
                onChange={(e) => update("basePrice", e.target.value)}
                required
              />
            </FormField>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h2 className="mb-5 font-sans text-sm font-semibold">Marketing content</h2>
          <div className="space-y-5">
            <FormField
              id="p-short"
              label="Short description"
              hint="Shown on product cards (max ~220 characters)."
              errors={fieldErrors.shortDescription}
            >
              <Textarea
                {...fieldAria("p-short", fieldErrors.shortDescription)}
                value={values.shortDescription}
                onChange={(e) => update("shortDescription", e.target.value)}
                rows={2}
                required
              />
            </FormField>
            <FormField id="p-desc" label="Full description" errors={fieldErrors.description}>
              <Textarea
                {...fieldAria("p-desc", fieldErrors.description)}
                value={values.description}
                onChange={(e) => update("description", e.target.value)}
                rows={5}
                required
              />
            </FormField>
            <FormField
              id="p-benefits"
              label="Key benefits"
              hint="One benefit per line."
              errors={fieldErrors.benefits}
            >
              <Textarea
                {...fieldAria("p-benefits", fieldErrors.benefits)}
                value={values.benefitsText}
                onChange={(e) => update("benefitsText", e.target.value)}
                rows={5}
                required
              />
            </FormField>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="p-dosage" label="Dosage" errors={fieldErrors.dosage}>
                <Input
                  {...fieldAria("p-dosage", fieldErrors.dosage)}
                  value={values.dosage}
                  onChange={(e) => update("dosage", e.target.value)}
                  required
                />
              </FormField>
              <FormField
                id="p-composition"
                label="Composition"
                optional
                errors={fieldErrors.composition}
              >
                <Input
                  {...fieldAria("p-composition", fieldErrors.composition)}
                  value={values.composition}
                  onChange={(e) => update("composition", e.target.value)}
                />
              </FormField>
            </div>
            <FormField
              id="p-packs"
              label="Pack sizes"
              hint="Comma separated, e.g. 100 ml, 250 ml, 1 Ltr"
              errors={fieldErrors.packSizes}
            >
              <Input
                {...fieldAria("p-packs", fieldErrors.packSizes)}
                value={values.packSizesText}
                onChange={(e) => update("packSizesText", e.target.value)}
                required
              />
            </FormField>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-xl border bg-card p-5">
          <h2 className="mb-5 font-sans text-sm font-semibold">Images</h2>
          <div className="space-y-5">
            <FormField
              id="p-cutout"
              label="Card image (cutout)"
              hint="Background-removed pack shot shown on cards."
              errors={fieldErrors.imageCutoutUrl}
            >
              <select
                {...fieldAria("p-cutout", fieldErrors.imageCutoutUrl)}
                value={values.imageCutoutUrl}
                onChange={(e) => update("imageCutoutUrl", e.target.value)}
                className={selectClass}
              >
                <option value="">No image</option>
                {imageOptions.map((path) => (
                  <option key={path} value={path}>
                    {path.replace("/products/", "")}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField
              id="p-image"
              label="Photo (full)"
              hint="Used for social sharing previews."
              errors={fieldErrors.imageUrl}
            >
              <select
                {...fieldAria("p-image", fieldErrors.imageUrl)}
                value={values.imageUrl}
                onChange={(e) => update("imageUrl", e.target.value)}
                className={selectClass}
              >
                <option value="">No image</option>
                {imageOptions.map((path) => (
                  <option key={path} value={path}>
                    {path.replace("/products/", "")}
                  </option>
                ))}
              </select>
            </FormField>
            {values.imageCutoutUrl ? (
              <div className="relative flex h-44 items-center justify-center rounded-lg border bg-brand-50">
                <Image
                  src={values.imageCutoutUrl}
                  alt="Selected product image preview"
                  fill
                  className="object-contain p-4"
                  sizes="20rem"
                />
              </div>
            ) : null}
            <p className="rounded-lg border border-dashed bg-muted/50 p-3 text-xs text-muted-foreground">
              Direct image upload arrives with the backend phase (Cloudinary per the database
              design). For now, choose from the photo library.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" size="lg" className="h-10 flex-1" disabled={pending}>
            <Save aria-hidden data-icon="inline-start" />
            {pending ? "Saving…" : product ? "Save changes" : "Create product"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-10"
            disabled={pending}
            onClick={() => router.push("/dashboard/catalog/products")}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
