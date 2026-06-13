import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/lib/data";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-brand-border overflow-hidden group hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-brand-light flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
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
