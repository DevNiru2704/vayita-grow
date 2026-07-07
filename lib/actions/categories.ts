"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { isSupabase } from "@/lib/db/source";
import { recordActivity } from "@/lib/mock/activity";
import { db, latency, nextId, nowIso } from "@/lib/mock/store";
import * as catalogPg from "@/lib/services/products.pg";
import type { CategoryInput } from "@/lib/types/catalog";
import type { ActionResult } from "@/lib/types/common";

// Validation + auth run here; data access dispatches to mock or Postgres
// (lib/services/products.pg.ts) based on DATA_SOURCE.

const categorySchema = z.object({
  categoryName: z.string().trim().min(3, "Name must be at least 3 characters").max(100),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
});

function revalidateCategoryRoutes(): void {
  revalidatePath("/products");
  revalidatePath("/dashboard/catalog/categories");
  revalidatePath("/dashboard/catalog/products");
}

export async function createCategory(input: CategoryInput): Promise<ActionResult<{ id: number }>> {
  const session = await requireSession();
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  if (isSupabase) return catalogPg.createCategory(parsed.data, session);
  await latency();

  const store = db();
  if (
    store.categories.some(
      (c) => c.categoryName.toLowerCase() === parsed.data.categoryName.toLowerCase(),
    )
  ) {
    return {
      ok: false,
      error: "Validation failed.",
      fieldErrors: { categoryName: ["Category already exists"] },
    };
  }

  const categoryId = nextId(store.categories, "categoryId");
  store.categories.push({ categoryId, ...parsed.data, createdAt: nowIso() });

  recordActivity(session.userId, "CREATE", "PRODUCT", categoryId);
  revalidateCategoryRoutes();
  return { ok: true, data: { id: categoryId } };
}

export async function updateCategory(id: number, input: CategoryInput): Promise<ActionResult> {
  const session = await requireSession();
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  if (isSupabase) return catalogPg.updateCategory(id, parsed.data, session);
  await latency();

  const store = db();
  const category = store.categories.find((c) => c.categoryId === id);
  if (!category) return { ok: false, error: "Category not found." };

  if (
    store.categories.some(
      (c) =>
        c.categoryId !== id &&
        c.categoryName.toLowerCase() === parsed.data.categoryName.toLowerCase(),
    )
  ) {
    return {
      ok: false,
      error: "Validation failed.",
      fieldErrors: { categoryName: ["Category already exists"] },
    };
  }

  Object.assign(category, parsed.data);
  recordActivity(session.userId, "UPDATE", "PRODUCT", id);
  revalidateCategoryRoutes();
  return { ok: true, data: undefined };
}

export async function deleteCategory(id: number): Promise<ActionResult> {
  const session = await requireSession();
  if (isSupabase) return catalogPg.deleteCategory(id, session);
  await latency();
  const store = db();
  const category = store.categories.find((c) => c.categoryId === id);
  if (!category) return { ok: false, error: "Category not found." };

  // Mirrors the FK constraint: products.category_id → product_categories.
  const attached = store.products.filter((p) => p.categoryId === id).length;
  if (attached > 0) {
    return {
      ok: false,
      error: `Cannot delete: ${attached} product${attached === 1 ? "" : "s"} still use this category.`,
    };
  }

  store.categories = store.categories.filter((c) => c.categoryId !== id);
  recordActivity(session.userId, "DELETE", "PRODUCT", id);
  revalidateCategoryRoutes();
  return { ok: true, data: undefined };
}
