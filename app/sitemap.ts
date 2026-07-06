import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { getPublicProducts } from "@/lib/services/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getPublicProducts();

  const staticPages: MetadataRoute.Sitemap = ["", "/about", "/products", "/feedback", "/contact"].map(
    (path) => ({
      url: `${siteConfig.url}${path}`,
      changeFrequency: "monthly",
      priority: path === "" ? 1 : 0.7,
    }),
  );

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}/products/${product.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
