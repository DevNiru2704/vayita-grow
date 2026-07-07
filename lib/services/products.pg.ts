import "server-only";
import { revalidatePath } from "next/cache";
import { paginate } from "@/lib/db/list";
import { query, queryOne, withActor } from "@/lib/db/query";
import type {
  CategoryInput,
  CategoryWithProductCount,
  ProductInput,
  ProductWithCategory,
  ProductWithDetails,
} from "@/lib/types/catalog";
import type { ActionResult, ListParams, Paginated } from "@/lib/types/common";
import type { SessionUser } from "@/lib/types/user";

// --- Reads -----------------------------------------------------------------

const LIST_SELECT = `
  SELECT p.product_id, p.name, p.slug, p.category_id, p.sku, p.description,
         p.base_price, p.image_url, p.created_at, cat.category_name
  FROM products p
  JOIN product_categories cat ON cat.category_id = p.category_id`;

/** Flat row (details columns joined) → nested ProductWithDetails. */
interface DetailRow extends ProductWithCategory {
  shortDescription: string;
  benefits: string[];
  dosage: string;
  composition: string | null;
  packSizes: string[];
  imageCutoutUrl: string | null;
}

const DETAIL_SELECT = `
  SELECT p.product_id, p.name, p.slug, p.category_id, p.sku, p.description,
         p.base_price, p.image_url, p.created_at, cat.category_name,
         d.short_description, d.benefits, d.dosage, d.composition, d.pack_sizes, d.image_cutout_url
  FROM products p
  JOIN product_categories cat ON cat.category_id = p.category_id
  LEFT JOIN product_details d ON d.product_id = p.product_id`;

function toDetails(row: DetailRow): ProductWithDetails {
  const { shortDescription, benefits, dosage, composition, packSizes, imageCutoutUrl, ...base } = row;
  return {
    ...base,
    details: {
      shortDescription: shortDescription ?? "",
      benefits: benefits ?? [],
      dosage: dosage ?? "",
      composition: composition ?? null,
      packSizes: packSizes ?? [],
      imageCutoutUrl: imageCutoutUrl ?? null,
    },
  };
}

export async function getProducts(
  params?: ListParams & { categoryId?: number },
): Promise<Paginated<ProductWithCategory>> {
  return paginate<ProductWithCategory>(
    {
      select: LIST_SELECT,
      where: params?.categoryId ? ["p.category_id = $1"] : [],
      params: params?.categoryId ? [params.categoryId] : [],
      searchColumns: ["p.name", "p.sku", "cat.category_name"],
      sorters: { name: "p.name", sku: "p.sku", basePrice: "p.base_price", createdAt: "p.created_at" },
      defaultSort: "name",
    },
    params,
  );
}

export async function getPublicProducts(categoryId?: number): Promise<ProductWithDetails[]> {
  const rows = await query<DetailRow>(
    `${DETAIL_SELECT} ${categoryId ? "WHERE p.category_id = $1" : ""} ORDER BY p.name ASC`,
    categoryId ? [categoryId] : [],
  );
  return rows.map(toDetails);
}

export async function getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
  const row = await queryOne<DetailRow>(`${DETAIL_SELECT} WHERE lower(p.slug) = lower($1)`, [slug]);
  return row ? toDetails(row) : null;
}

export async function getProductById(id: number): Promise<ProductWithDetails | null> {
  const row = await queryOne<DetailRow>(`${DETAIL_SELECT} WHERE p.product_id = $1`, [id]);
  return row ? toDetails(row) : null;
}

export async function getCategories(): Promise<CategoryWithProductCount[]> {
  return query<CategoryWithProductCount>(
    `SELECT cat.category_id, cat.category_name, cat.description, cat.created_at,
            COALESCE(COUNT(p.product_id), 0)::int AS product_count
     FROM product_categories cat
     LEFT JOIN products p ON p.category_id = cat.category_id
     GROUP BY cat.category_id
     ORDER BY cat.category_name ASC`,
  );
}

// --- Product writes --------------------------------------------------------

function revalidateProductRoutes(): void {
  revalidatePath("/products");
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/dashboard/catalog/products");
  revalidatePath("/dashboard/inventory");
}

export async function createProduct(
  data: ProductInput,
  session: SessionUser,
): Promise<ActionResult<{ id: number }>> {
  if (await queryOne("SELECT 1 FROM products WHERE lower(slug) = lower($1)", [data.slug])) {
    return { ok: false, error: "Validation failed.", fieldErrors: { slug: ["Slug already exists"] } };
  }
  if (await queryOne("SELECT 1 FROM products WHERE lower(sku) = lower($1)", [data.sku])) {
    return { ok: false, error: "Validation failed.", fieldErrors: { sku: ["SKU already exists"] } };
  }
  if (!(await queryOne("SELECT 1 FROM product_categories WHERE category_id = $1", [data.categoryId]))) {
    return { ok: false, error: "Validation failed.", fieldErrors: { categoryId: ["Category not found"] } };
  }

  const id = await withActor(session.userId, async (c) => {
    const { rows } = await c.query(
      `INSERT INTO products (name, slug, category_id, sku, description, base_price, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING product_id`,
      [data.name, data.slug, data.categoryId, data.sku, data.description, data.basePrice, data.imageUrl],
    );
    const productId = rows[0].product_id as number;
    await c.query(
      `INSERT INTO product_details (product_id, short_description, benefits, dosage, composition, pack_sizes, image_cutout_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [productId, data.shortDescription, data.benefits, data.dosage, data.composition, data.packSizes, data.imageCutoutUrl],
    );
    // New product gets an inventory record so stock can be managed immediately.
    await c.query("INSERT INTO inventory (product_id, supplier_id, quantity) VALUES ($1, NULL, 0)", [
      productId,
    ]);
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'CREATE', 'PRODUCT', $2)",
      [session.userId, productId],
    );
    return productId;
  });

  revalidateProductRoutes();
  return { ok: true, data: { id } };
}

export async function updateProduct(
  id: number,
  data: ProductInput,
  session: SessionUser,
): Promise<ActionResult> {
  if (!(await queryOne("SELECT 1 FROM products WHERE product_id = $1", [id]))) {
    return { ok: false, error: "Product not found." };
  }
  if (await queryOne("SELECT 1 FROM products WHERE lower(slug) = lower($1) AND product_id <> $2", [data.slug, id])) {
    return { ok: false, error: "Validation failed.", fieldErrors: { slug: ["Slug already exists"] } };
  }
  if (await queryOne("SELECT 1 FROM products WHERE lower(sku) = lower($1) AND product_id <> $2", [data.sku, id])) {
    return { ok: false, error: "Validation failed.", fieldErrors: { sku: ["SKU already exists"] } };
  }

  await withActor(session.userId, async (c) => {
    await c.query(
      `UPDATE products SET name = $1, slug = $2, category_id = $3, sku = $4, description = $5,
              base_price = $6, image_url = $7 WHERE product_id = $8`,
      [data.name, data.slug, data.categoryId, data.sku, data.description, data.basePrice, data.imageUrl, id],
    );
    await c.query(
      `INSERT INTO product_details (product_id, short_description, benefits, dosage, composition, pack_sizes, image_cutout_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (product_id) DO UPDATE SET
         short_description = EXCLUDED.short_description, benefits = EXCLUDED.benefits,
         dosage = EXCLUDED.dosage, composition = EXCLUDED.composition,
         pack_sizes = EXCLUDED.pack_sizes, image_cutout_url = EXCLUDED.image_cutout_url`,
      [id, data.shortDescription, data.benefits, data.dosage, data.composition, data.packSizes, data.imageCutoutUrl],
    );
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'UPDATE', 'PRODUCT', $2)",
      [session.userId, id],
    );
  });

  revalidateProductRoutes();
  return { ok: true, data: undefined };
}

export async function deleteProduct(id: number, session: SessionUser): Promise<ActionResult> {
  if (!(await queryOne("SELECT 1 FROM products WHERE product_id = $1", [id]))) {
    return { ok: false, error: "Product not found." };
  }
  if (await queryOne("SELECT 1 FROM order_items WHERE product_id = $1", [id])) {
    return { ok: false, error: "This product appears in existing orders and cannot be deleted." };
  }

  await withActor(session.userId, async (c) => {
    // product_details, product_images, inventory (→ inventory_logs) cascade via FK.
    await c.query("DELETE FROM products WHERE product_id = $1", [id]);
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'DELETE', 'PRODUCT', $2)",
      [session.userId, id],
    );
  });

  revalidateProductRoutes();
  return { ok: true, data: undefined };
}

// --- Category writes -------------------------------------------------------

function revalidateCategoryRoutes(): void {
  revalidatePath("/products");
  revalidatePath("/dashboard/catalog/categories");
  revalidatePath("/dashboard/catalog/products");
}

export async function createCategory(
  data: CategoryInput,
  session: SessionUser,
): Promise<ActionResult<{ id: number }>> {
  if (await queryOne("SELECT 1 FROM product_categories WHERE lower(category_name) = lower($1)", [data.categoryName])) {
    return { ok: false, error: "Validation failed.", fieldErrors: { categoryName: ["Category already exists"] } };
  }

  const id = await withActor(session.userId, async (c) => {
    const { rows } = await c.query(
      "INSERT INTO product_categories (category_name, description) VALUES ($1, $2) RETURNING category_id",
      [data.categoryName, data.description],
    );
    const categoryId = rows[0].category_id as number;
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'CREATE', 'PRODUCT', $2)",
      [session.userId, categoryId],
    );
    return categoryId;
  });

  revalidateCategoryRoutes();
  return { ok: true, data: { id } };
}

export async function updateCategory(
  id: number,
  data: CategoryInput,
  session: SessionUser,
): Promise<ActionResult> {
  if (!(await queryOne("SELECT 1 FROM product_categories WHERE category_id = $1", [id]))) {
    return { ok: false, error: "Category not found." };
  }
  if (await queryOne("SELECT 1 FROM product_categories WHERE lower(category_name) = lower($1) AND category_id <> $2", [data.categoryName, id])) {
    return { ok: false, error: "Validation failed.", fieldErrors: { categoryName: ["Category already exists"] } };
  }

  await withActor(session.userId, async (c) => {
    await c.query("UPDATE product_categories SET category_name = $1, description = $2 WHERE category_id = $3", [
      data.categoryName,
      data.description,
      id,
    ]);
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'UPDATE', 'PRODUCT', $2)",
      [session.userId, id],
    );
  });

  revalidateCategoryRoutes();
  return { ok: true, data: undefined };
}

export async function deleteCategory(id: number, session: SessionUser): Promise<ActionResult> {
  if (!(await queryOne("SELECT 1 FROM product_categories WHERE category_id = $1", [id]))) {
    return { ok: false, error: "Category not found." };
  }
  const attached = await queryOne<{ count: number }>(
    "SELECT COUNT(*)::int AS count FROM products WHERE category_id = $1",
    [id],
  );
  const count = attached?.count ?? 0;
  if (count > 0) {
    return {
      ok: false,
      error: `Cannot delete: ${count} product${count === 1 ? "" : "s"} still use this category.`,
    };
  }

  await withActor(session.userId, async (c) => {
    await c.query("DELETE FROM product_categories WHERE category_id = $1", [id]);
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'DELETE', 'PRODUCT', $2)",
      [session.userId, id],
    );
  });

  revalidateCategoryRoutes();
  return { ok: true, data: undefined };
}
