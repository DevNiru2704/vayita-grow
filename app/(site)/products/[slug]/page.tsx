import { ArrowRight, Beaker, Check, ChevronRight, Droplets, Package2 } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MotionReveal } from "@/components/shared/MotionReveal";
import { buttonVariants } from "@/components/ui/button";
import { getProductBySlug, getPublicProducts } from "@/lib/services/products";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  const products = await getPublicProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(
  props: PageProps<"/products/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: `${product.name} - ${product.categoryName}`,
    description: product.details.shortDescription,
    openGraph: product.imageUrl ? { images: [{ url: product.imageUrl }] } : undefined,
  };
}

export default async function ProductDetailPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const infoCards = [
    { title: "Dosage", value: product.details.dosage, icon: Droplets },
    ...(product.details.composition
      ? [{ title: "Composition", value: product.details.composition, icon: Beaker }]
      : []),
    { title: "Pack Sizes", value: product.details.packSizes.join(" · "), icon: Package2 },
  ];

  return (
    <>
      <nav aria-label="Breadcrumb" className="border-b bg-muted/50">
        <ol className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-3 text-sm sm:px-6 lg:px-8">
          <li>
            <Link href="/products" className="rounded-sm text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
              Products
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-3.5 text-muted-foreground" />
          </li>
          <li aria-current="page" className="font-medium">
            {product.name}
          </li>
        </ol>
      </nav>

      <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <MotionReveal>
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border bg-brand-50">
              {product.details.imageCutoutUrl ? (
                <Image
                  src={product.details.imageCutoutUrl}
                  alt={`${product.name} product pack`}
                  fill
                  priority
                  className="object-contain p-10"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              ) : null}
            </div>
          </MotionReveal>

          <div className="space-y-8">
            <MotionReveal>
              <div className="space-y-3">
                <p className="text-sm font-semibold tracking-wide text-brand-600 uppercase">
                  {product.categoryName}
                </p>
                <h1 className="text-4xl tracking-tight sm:text-5xl">{product.name}</h1>
                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {product.description}
                </p>
              </div>
            </MotionReveal>

            <MotionReveal delay={0.08}>
              <section aria-labelledby="benefits-heading">
                <h2 id="benefits-heading" className="font-sans text-base font-semibold">
                  Key benefits
                </h2>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {product.details.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                        <Check aria-hidden className="size-3" />
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </section>
            </MotionReveal>

            <MotionReveal delay={0.16}>
              <div className="grid gap-4 sm:grid-cols-2">
                {infoCards.map((card) => (
                  <div key={card.title} className="rounded-xl border bg-card p-5">
                    <div className="flex items-center gap-2 text-brand-600">
                      <card.icon aria-hidden className="size-4" />
                      <h3 className="font-sans text-sm font-semibold text-foreground">
                        {card.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {card.value}
                    </p>
                  </div>
                ))}
              </div>
            </MotionReveal>

            <MotionReveal delay={0.22}>
              <div className="flex flex-wrap gap-3 border-t pt-6">
                <Link
                  href={`/contact?subject=product&product=${product.slug}`}
                  className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
                >
                  Send an inquiry
                  <ArrowRight aria-hidden data-icon="inline-end" />
                </Link>
                <Link
                  href="/products"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-5")}
                >
                  Back to all products
                </Link>
              </div>
            </MotionReveal>
          </div>
        </div>
      </article>
    </>
  );
}
