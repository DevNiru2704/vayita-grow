"use client";

import { useState } from "react";
import type { ProductCategory } from "@/lib/data";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/shared/SectionHeading";
import ProductCard from "@/components/shared/ProductCard";
import { products } from "@/lib/data";

const filterCategories: ProductCategory[] = [
  "All",
  "Bio Fertilizers",
  "Organic Fertilizers",
  "Growth Promoters",
  "Micronutrients",
  "Soil Conditioners",
  "Crop Protection",
];

export default function ProductsPage() {
  const [activeFilter, setActiveFilter] = useState<ProductCategory>("All");

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

            {/* Filter Bar */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {filterCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeFilter === cat
                      ? "bg-brand-primary text-white shadow-sm"
                      : "bg-white text-brand-body border border-brand-border hover:border-brand-primary/30 hover:text-brand-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

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
