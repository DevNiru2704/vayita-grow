/** Mirrors `product_categories`, `products`, `product_images` (ERD v1.2.0). */

export interface ProductCategory {
  categoryId: number;
  categoryName: string;
  description: string | null;
  createdAt: string;
}

export interface CategoryWithProductCount extends ProductCategory {
  productCount: number;
}

export interface Product {
  productId: number;
  name: string;
  /** EXTENSION: not in DB design v1.2.0 - needed for public URLs; backend schema addition required. */
  slug: string;
  categoryId: number;
  sku: string;
  description: string | null;
  /** Demo-only pricing for dashboard/orders; never rendered on the public site. */
  basePrice: number;
  imageUrl: string | null;
  createdAt: string;
}

/**
 * EXTENSION: marketing fields not in DB design v1.2.0 (products table only has
 * name/sku/description/base_price/image_url). Backend needs a `product_details`
 * column-set or table for these.
 */
export interface ProductDetails {
  shortDescription: string;
  benefits: string[];
  dosage: string;
  composition: string | null;
  packSizes: string[];
  /** Background-removed product photo used on cards/heroes. */
  imageCutoutUrl: string | null;
}

export interface ProductWithCategory extends Product {
  categoryName: string;
}

export interface ProductWithDetails extends ProductWithCategory {
  details: ProductDetails;
}

export interface ProductInput {
  name: string;
  slug: string;
  categoryId: number;
  sku: string;
  description: string;
  basePrice: number;
  imageUrl: string | null;
  shortDescription: string;
  benefits: string[];
  dosage: string;
  composition: string | null;
  packSizes: string[];
  imageCutoutUrl: string | null;
}

export interface CategoryInput {
  categoryName: string;
  description: string;
}
