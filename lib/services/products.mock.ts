import "server-only";
import { db, latency } from "@/lib/mock/store";
import type { SeedProduct } from "@/lib/mock/seed/catalog";
import type {
  CategoryWithProductCount,
  ProductWithCategory,
  ProductWithDetails,
} from "@/lib/types/catalog";
import type { ListParams, Paginated } from "@/lib/types/common";
import { applyList } from "./helpers";

// MOCK IMPLEMENTATION - replace bodies with Supabase queries. Signatures are the contract.

function categoryName(categoryId: number): string {
  return db().categories.find((c) => c.categoryId === categoryId)?.categoryName ?? "Uncategorized";
}

function toWithCategory(product: SeedProduct): ProductWithCategory {
  const { details, ...base } = product;
  void details; // stripped - list views don't need marketing content
  return { ...base, categoryName: categoryName(product.categoryId) };
}

function toWithDetails(product: SeedProduct): ProductWithDetails {
  const { details, ...base } = product;
  return { ...base, categoryName: categoryName(product.categoryId), details };
}

/** Dashboard/CMS list with search, sort, and pagination. */
export async function getProducts(
  params?: ListParams & { categoryId?: number },
): Promise<Paginated<ProductWithCategory>> {
  await latency();
  let rows = db().products;
  if (params?.categoryId) {
    rows = rows.filter((p) => p.categoryId === params.categoryId);
  }
  return applyList(rows.map(toWithCategory), params, {
    search: (p) => `${p.name} ${p.sku} ${p.categoryName}`,
    sorters: {
      name: (p) => p.name,
      sku: (p) => p.sku,
      basePrice: (p) => p.basePrice,
      createdAt: (p) => p.createdAt,
    },
    defaultSort: "name",
  });
}

/** Full catalog for the public site (10 SKUs - no pagination needed). */
export async function getPublicProducts(categoryId?: number): Promise<ProductWithDetails[]> {
  await latency();
  let rows = db().products;
  if (categoryId) rows = rows.filter((p) => p.categoryId === categoryId);
  return rows.map(toWithDetails).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
  await latency();
  const product = db().products.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  return product ? toWithDetails(product) : null;
}

export async function getProductById(id: number): Promise<ProductWithDetails | null> {
  await latency();
  const product = db().products.find((p) => p.productId === id);
  return product ? toWithDetails(product) : null;
}

export async function getCategories(): Promise<CategoryWithProductCount[]> {
  await latency();
  const { categories, products } = db();
  return categories
    .map((category) => ({
      ...category,
      productCount: products.filter((p) => p.categoryId === category.categoryId).length,
    }))
    .sort((a, b) => a.categoryName.localeCompare(b.categoryName));
}
