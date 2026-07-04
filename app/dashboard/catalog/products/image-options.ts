import "server-only";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { db } from "@/lib/mock/store";

/**
 * Image choices for the product form. Reads public/products at request time
 * (demo photo library); falls back to paths referenced by existing products.
 * Replaced by Cloudinary upload in the backend phase.
 */
export function getProductImageOptions(): string[] {
  try {
    return readdirSync(join(process.cwd(), "public", "products"))
      .filter((file) => /\.(png|jpe?g|webp)$/i.test(file))
      .map((file) => `/products/${file}`)
      .sort();
  } catch {
    const referenced = db().products.flatMap((p) =>
      [p.imageUrl, p.details.imageCutoutUrl].filter((v): v is string => !!v),
    );
    return [...new Set(referenced)].sort();
  }
}
