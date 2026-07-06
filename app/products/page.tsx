"use client";

import { useState } from "react";
import type { ProductCategory } from "@/lib/data";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/shared/SectionHeading";
import ProductCard from "@/components/shared/ProductCard";
import { products } from "@/lib/data";

// Keep this as your master list so the buttons render in this exact order
const masterCategories: ProductCategory[] = [
  "All",
  "Natural Plant Growth Promoter",
  "Amino Acid Enriched Liquid Nutrient",
  "Leaf Growth Promoter",
  "Flowering Promoter",
  "100% Organic Fertilizer",
  "Soil Conditioner Powder",
  "Soil pH Regulator",
  "Seaweed-Based Enriched Mixed Granules",
  "Organic Enzyme",
  "Silicone-Based Spreader & Activator",
];

export default function ProductsPage() {
  const [activeFilter, setActiveFilter] = useState<ProductCategory>("All");

  // 1. Tally up how many products belong to each category
  const categoryCounts = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 2. Filter the master list. Keep "All", and only keep categories with 2 or more products.
  // (If you truly meant 3 or more products, change `>= 2` to `>= 3`)
  const visibleCategories = masterCategories.filter(
    (cat) => cat === "All" || (categoryCounts[cat] && categoryCounts[cat] >= 2)
  );

  const filtered =
    activeFilter === "All"
      ? products
      : products.filter((p) => p.category === activeFilter);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-dark via-[#1a3a2a] to-brand-dark py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Our Products
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Comprehensive agricultural input solutions developed with scientific
              rigor and field-tested performance.
            </p>
          </div>
        </section>

        {/* Products */}
        <section className="py-20 bg-brand-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Product Portfolio"
              subtitle="Browse our range of bio fertilizers, organic inputs, growth promoters, and more."
            />

            {/* Filter Bar - ONLY renders if there is more than just the "All" button */}
            {visibleCategories.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mb-12">
                {visibleCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeFilter === cat
                        ? "bg-brand-primary text-white shadow-sm"
                        : "bg-white text-brand-body border border-brand-border hover:border-brand-primary/30 hover:text-brand-primary"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Product Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Empty State Fallback */}
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-brand-body">
                  No products found in this category.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}