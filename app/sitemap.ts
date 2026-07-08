import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { getPublicProducts } from "@/lib/services/products";

// Regenerate hourly (ISR); a database hiccup falls back to the static routes
// instead of failing the build.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = ["", "/about", "/products", "/feedback", "/contact"].map(
    (path) => ({
      url: `${siteConfig.url}${path}`,
      changeFrequency: "monthly",
      priority: path === "" ? 1 : 0.7,
    }),
  );

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await getPublicProducts();
    productPages = products.map((product) => ({
      url: `${siteConfig.url}/products/${product.slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Sitemap product load failed; emitting static routes only:", error);
  }

  return [...staticPages, ...productPages];
}
