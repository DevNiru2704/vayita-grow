import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/lib/data";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-brand-border overflow-hidden group hover:shadow-md transition-shadow">
      {/* Image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-brand-light to-brand-section flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-2">
            <span className="text-2xl">🌱</span>
          </div>
          <p className="text-xs font-medium text-brand-primary">{product.category}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <span className="inline-block text-xs font-medium text-brand-secondary bg-brand-light px-2.5 py-1 rounded-full mb-3">
          {product.category}
        </span>
        <h3 className="font-heading text-lg font-semibold text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-brand-body leading-relaxed mb-4 line-clamp-2">
          {product.shortDescription}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
