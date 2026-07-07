"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { isSupabase } from "@/lib/db/source";
import { recordActivity } from "@/lib/mock/activity";
import { db, latency, nextId, nowIso } from "@/lib/mock/store";
import * as catalogPg from "@/lib/services/products.pg";
import type { ProductInput } from "@/lib/types/catalog";
import type { ActionResult } from "@/lib/types/common";

// Validation + auth run here; data access dispatches to mock or Postgres
// (lib/services/products.pg.ts) based on DATA_SOURCE.

const productSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(60)
    .regex(/^[A-Za-z0-9-]+$/, "Slug may only contain letters, numbers, and hyphens"),
  categoryId: z.number().int().positive("Select a category"),
  sku: z.string().trim().min(2, "SKU is required").max(20),
  description: z.string().trim().min(20, "Description must be at least 20 characters"),
  basePrice: z.number().positive("Price must be positive").max(100000),
  imageUrl: z.string().nullable(),
  shortDescription: z.string().trim().min(10, "Short description is too short").max(220),
  benefits: z.array(z.string().trim().min(3)).min(1, "Add at least one benefit").max(8),
  dosage: z.string().trim().min(3, "Dosage is required"),
  composition: z.string().trim().nullable(),
  packSizes: z.array(z.string().trim().min(1)).min(1, "Add at least one pack size").max(8),
  imageCutoutUrl: z.string().nullable(),
});

function validate(input: ProductInput) {
  const parsed = productSchema.safeParse(input);
  if (parsed.success) return { data: parsed.data, failure: null } as const;
  return {
    data: null,
    failure: {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    } satisfies ActionResult,
  } as const;
}

function revalidateProductRoutes(): void {
  revalidatePath("/products");
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/dashboard/catalog/products");
  revalidatePath("/dashboard/inventory");
}

export async function createProduct(input: ProductInput): Promise<ActionResult<{ id: number }>> {
  const session = await requireSession();
  const { data, failure } = validate(input);
  if (!data) return failure;
  if (isSupabase) return catalogPg.createProduct(data, session);
  await latency();

  const store = db();
  if (store.products.some((p) => p.slug.toLowerCase() === data.slug.toLowerCase())) {
    return { ok: false, error: "Validation failed.", fieldErrors: { slug: ["Slug already exists"] } };
  }
  if (store.products.some((p) => p.sku.toLowerCase() === data.sku.toLowerCase())) {
    return { ok: false, error: "Validation failed.", fieldErrors: { sku: ["SKU already exists"] } };
  }
  if (!store.categories.some((c) => c.categoryId === data.categoryId)) {
    return { ok: false, error: "Validation failed.", fieldErrors: { categoryId: ["Category not found"] } };
  }

  const productId = nextId(store.products, "productId");
  const { shortDescription, benefits, dosage, composition, packSizes, imageCutoutUrl, ...base } =
    data;
  store.products.push({
    ...base,
    productId,
    createdAt: nowIso(),
    details: { shortDescription, benefits, dosage, composition, packSizes, imageCutoutUrl },
  });
  // New product gets an inventory record so stock can be managed immediately.
  store.inventory.push({
    inventoryId: nextId(store.inventory, "inventoryId"),
    productId,
    supplierId: null,
    quantity: 0,
    lastUpdated: nowIso(),
  });

  recordActivity(session.userId, "CREATE", "PRODUCT", productId);
  revalidateProductRoutes();
  return { ok: true, data: { id: productId } };
}

export async function updateProduct(id: number, input: ProductInput): Promise<ActionResult> {
  const session = await requireSession();
  const { data, failure } = validate(input);
  if (!data) return failure;
  if (isSupabase) return catalogPg.updateProduct(id, data, session);
  await latency();

  const store = db();
  const product = store.products.find((p) => p.productId === id);
  if (!product) return { ok: false, error: "Product not found." };

  if (
    store.products.some(
      (p) => p.productId !== id && p.slug.toLowerCase() === data.slug.toLowerCase(),
    )
  ) {
    return { ok: false, error: "Validation failed.", fieldErrors: { slug: ["Slug already exists"] } };
  }
  if (
    store.products.some(
      (p) => p.productId !== id && p.sku.toLowerCase() === data.sku.toLowerCase(),
    )
  ) {
    return { ok: false, error: "Validation failed.", fieldErrors: { sku: ["SKU already exists"] } };
  }

  const { shortDescription, benefits, dosage, composition, packSizes, imageCutoutUrl, ...base } =
    data;
  Object.assign(product, base, {
    details: { shortDescription, benefits, dosage, composition, packSizes, imageCutoutUrl },
  });

  recordActivity(session.userId, "UPDATE", "PRODUCT", id);
  revalidateProductRoutes();
  return { ok: true, data: undefined };
}

export async function deleteProduct(id: number): Promise<ActionResult> {
  const session = await requireSession();
  if (isSupabase) return catalogPg.deleteProduct(id, session);
  await latency();
  const store = db();
  const product = store.products.find((p) => p.productId === id);
  if (!product) return { ok: false, error: "Product not found." };

  if (store.orderItems.some((item) => item.productId === id)) {
    return {
      ok: false,
      error: "This product appears in existing orders and cannot be deleted.",
    };
  }

  const inventoryIds = store.inventory
    .filter((record) => record.productId === id)
    .map((record) => record.inventoryId);
  store.inventoryLogs = store.inventoryLogs.filter(
    (log) => !inventoryIds.includes(log.inventoryId),
  );
  store.inventory = store.inventory.filter((record) => record.productId !== id);
  store.products = store.products.filter((p) => p.productId !== id);

  recordActivity(session.userId, "DELETE", "PRODUCT", id);
  revalidateProductRoutes();
  return { ok: true, data: undefined };
}
