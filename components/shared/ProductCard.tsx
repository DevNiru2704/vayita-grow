import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ImageOff } from "lucide-react";
import { Product } from "@/lib/data";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Check if a valid image cutout exists and is not an empty string
  const hasValidImage = product.imagecut && product.imagecut.trim() !== "";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-brand-border overflow-hidden group hover:shadow-md transition-shadow">

      {/* Transparent Image Container */}
      <div className="relative h-56 bg-brand-light border-b border-brand-border overflow-hidden">
        {hasValidImage ? (
          <Image
            src={product.imagecut}
            alt={`${product.name} packaging`}
            fill
            className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-brand-body opacity-40">
            <ImageOff className="w-10 h-10 stroke-[1.5]" />
            <span className="text-xs font-medium">Image Not Available</span>
          </div>
        )}
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