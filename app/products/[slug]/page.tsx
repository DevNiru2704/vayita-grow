import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Download, MessageCircle, Package, Leaf } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/data";

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="bg-brand-section border-b border-brand-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-brand-body hover:text-brand-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Image */}
              <div className="relative rounded-2xl bg-brand-light h-80 lg:h-[480px] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1504275490777-45f30792f13f?auto=format&fit=crop&w=800&q=80"
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div>
                <span className="inline-block text-xs font-medium text-brand-secondary bg-brand-light px-3 py-1 rounded-full mb-4">
                  {product.category}
                </span>
                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-dark mb-4">
                  {product.name}
                </h1>
                <p className="text-brand-body leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Benefits */}
                <div className="mb-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-dark mb-3">
                    Key Benefits
                  </h3>
                  <div className="space-y-2">
                    {product.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-brand-primary mt-0.5 shrink-0" />
                        <span className="text-sm text-brand-body">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pack Sizes */}
                <div className="mb-8">
                  <h3 className="font-heading text-lg font-semibold text-brand-dark mb-3">
                    Available Pack Sizes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.packSizes.map((size) => (
                      <span
                        key={size}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-dark bg-brand-section border border-brand-border px-3 py-1.5 rounded-xl"
                      >
                        <Package className="w-3.5 h-3.5 text-brand-primary" />
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="bg-brand-primary hover:bg-brand-secondary text-white rounded-xl px-6 h-11 text-sm font-medium">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Inquiry
                  </Button>
                  <Button className="bg-white text-brand-primary border border-brand-primary hover:bg-brand-light rounded-xl px-6 h-11 text-sm font-medium">
                    <Download className="w-4 h-4 mr-2" />
                    Download Brochure
                  </Button>
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="grid md:grid-cols-2 gap-8 mt-16">
              <div className="bg-brand-section rounded-2xl p-6 border border-brand-border">
                <h3 className="font-heading text-lg font-semibold text-brand-dark mb-3">
                  Application Method
                </h3>
                <p className="text-sm text-brand-body leading-relaxed">
                  {product.applicationMethod}
                </p>
              </div>
              <div className="bg-brand-section rounded-2xl p-6 border border-brand-border">
                <h3 className="font-heading text-lg font-semibold text-brand-dark mb-3">
                  Recommended Usage
                </h3>
                <p className="text-sm text-brand-body leading-relaxed">
                  {product.recommendedUsage}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
