import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ProductWithDetails } from "@/lib/types/catalog";

/** Public catalog card: real product cutout on a tinted surface. */
export function ProductCard({ product }: { product: ProductWithDetails }) {
  const imageSrc = product.details.imageCutoutUrl ?? product.imageUrl;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-[box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-52 overflow-hidden border-b bg-brand-50">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={`${product.name} product pack`}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-medium text-brand-600">{product.categoryName}</p>
        <h3 className="font-sans text-lg font-semibold tracking-tight">
          <Link
            href={`/products/${product.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {product.details.shortDescription}
        </p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-brand-600">
          View details
          <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-xl ring-ring/50 ring-inset group-has-[a:focus-visible]:ring-2" />
    </article>
  );
}
