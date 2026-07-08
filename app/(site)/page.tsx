import { ArrowRight, Handshake, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MotionReveal } from "@/components/shared/MotionReveal";
import { ProductCard } from "@/components/shared/ProductCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { StatCard } from "@/components/shared/StatCard";
import { buttonVariants } from "@/components/ui/button";
import { company } from "@/lib/config/company";
import { categoryIcons, DEFAULT_CATEGORY_ICON, whyChooseUs } from "@/lib/config/marketing";
import { getCategories, getPublicProducts } from "@/lib/services/products";
import { cn } from "@/lib/utils";

// ISR: the homepage is statically served and refreshed hourly, so normal page
// loads never hit the database. The fetch is wrapped so a database outage
// degrades to an empty catalog instead of failing the build/render.
export const revalidate = 3600;

export default async function HomePage() {
  let products: Awaited<ReturnType<typeof getPublicProducts>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  try {
    [products, categories] = await Promise.all([getPublicProducts(), getCategories()]);
  } catch (error) {
    console.error("Homepage catalog load failed; rendering without catalog:", error);
  }
  const featured = products.slice(0, 4);
  const heroProduct = products.find((p) => p.slug === "VEER-L") ?? products[0];

  // Only verifiable facts - no invented statistics.
  const facts = [
    { label: "Bioorganic Products", value: products.length, suffix: "" },
    { label: "Product Categories", value: categories.filter((c) => c.productCount > 0).length, suffix: "" },
    { label: "Operating States", value: company.operatingStates.length, suffix: "" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-950 text-white">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(60rem_30rem_at_80%_-10%,rgba(42,157,75,0.25),transparent)]"
        />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-28">
          <div className="max-w-xl space-y-6">
            <MotionReveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium tracking-wide text-brand-200 uppercase">
                {company.industry}
              </p>
            </MotionReveal>
            <MotionReveal delay={0.08}>
              <h1 className="text-4xl leading-tight tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]">
                {company.tagline}
              </h1>
            </MotionReveal>
            <MotionReveal delay={0.16}>
              <p className="text-base leading-relaxed text-pretty text-brand-200 sm:text-lg">
                {company.legalName} manufactures and markets bioorganic inputs that improve soil
                health, crop nutrition, and farm productivity - supplied through a trusted dealer
                network across {company.operatingStates.join(" and ")}.
              </p>
            </MotionReveal>
            <MotionReveal delay={0.24}>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/products"
                  className={cn(buttonVariants({ size: "lg" }), "h-11 px-5 text-base")}
                >
                  Explore Products
                  <ArrowRight aria-hidden data-icon="inline-end" />
                </Link>
                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-11 border-white/25 bg-transparent px-5 text-base text-white hover:bg-white/10 hover:text-white",
                  )}
                >
                  Become a Dealer
                </Link>
              </div>
            </MotionReveal>
          </div>

          {heroProduct?.details.imageCutoutUrl ? (
            <MotionReveal delay={0.2} className="hidden lg:block">
              <div className="relative mx-auto flex h-105 w-full max-w-md items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-8">
                <Image
                  src={heroProduct.details.imageCutoutUrl}
                  alt={`${heroProduct.name} product pack`}
                  fill
                  priority
                  className="object-contain p-10 drop-shadow-2xl"
                  sizes="(max-width: 1024px) 0px, 28rem"
                />
                <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-brand-900/80 px-4 py-1.5 text-xs font-medium tracking-wide text-brand-200">
                  {heroProduct.name} · {heroProduct.categoryName}
                </p>
              </div>
            </MotionReveal>
          ) : null}
        </div>
      </section>

      {/* Verifiable facts */}
      <section aria-label="Company facts" className="border-b bg-brand-50">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
          {facts.map((fact, index) => (
            <MotionReveal key={fact.label} delay={index * 0.08}>
              <StatCard
                variant="hero"
                animate
                label={fact.label}
                value={fact.value}
                suffix={fact.suffix}
              />
            </MotionReveal>
          ))}
        </div>
      </section>

      {/* About snapshot */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <MotionReveal>
            <SectionHeading
              align="left"
              eyebrow="Who We Are"
              title="A bioorganics manufacturer built for the dealer network"
              lede="We combine scientific agricultural practice with strong field support - helping dealers, distributors, and the farmers they serve get dependable results from every input."
            />
            <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                From plant growth promoters and organic fertilizers to soil conditioners and
                spray adjuvants, every product is formulated to support sustainable and
                productive farming.
              </p>
              <p>
                Our field teams work alongside dealers in {company.operatingStates.join(" and ")}{" "}
                - demonstrating correct application, collecting feedback, and building the
                long-term relationships this business runs on.
              </p>
            </div>
            <Link
              href="/about"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "mt-8 h-10 px-4")}
            >
              Learn more about us
              <ArrowRight aria-hidden data-icon="inline-end" />
            </Link>
          </MotionReveal>

          <MotionReveal delay={0.12}>
            <div className="grid gap-4 sm:grid-cols-2">
              {whyChooseUs.map((pillar) => (
                <div key={pillar.title} className="rounded-xl border bg-card p-5">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                    <pillar.icon aria-hidden className="size-5" />
                  </div>
                  <h3 className="font-sans text-sm font-semibold">{pillar.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* Categories */}
      <section className="border-y bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <MotionReveal>
            <SectionHeading
              eyebrow="Product Range"
              title="Solutions for every stage of the crop cycle"
              lede="Ten bioorganic categories covering soil preparation, plant nutrition, growth, flowering, and spray performance."
            />
          </MotionReveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories
              .filter((category) => category.productCount > 0)
              .map((category, index) => {
                const Icon = categoryIcons[category.categoryName] ?? DEFAULT_CATEGORY_ICON;
                return (
                  <MotionReveal key={category.categoryId} delay={Math.min(index * 0.05, 0.3)}>
                    <Link
                      href={`/products?category=${category.categoryId}`}
                      className="group flex h-full flex-col rounded-xl border bg-card p-5 transition-[box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                        <Icon aria-hidden className="size-5" />
                      </div>
                      <p className="text-sm leading-snug font-semibold">{category.categoryName}</p>
                      <p className="mt-auto pt-3 text-xs font-medium text-brand-600">
                        {category.productCount} product{category.productCount === 1 ? "" : "s"}
                        <ArrowRight
                          aria-hidden
                          className="ml-1 inline size-3 transition-transform group-hover:translate-x-0.5"
                        />
                      </p>
                    </Link>
                  </MotionReveal>
                );
              })}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <MotionReveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              align="left"
              eyebrow="Featured Products"
              title="From our current range"
            />
            <Link
              href="/products"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-10 px-4")}
            >
              View all products
              <ArrowRight aria-hidden data-icon="inline-end" />
            </Link>
          </div>
        </MotionReveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, index) => (
            <MotionReveal key={product.productId} delay={Math.min(index * 0.06, 0.24)}>
              <ProductCard product={product} />
            </MotionReveal>
          ))}
        </div>
      </section>

      {/* Presence */}
      <section className="border-t bg-brand-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <MotionReveal>
            <SectionHeading
              eyebrow="Where We Operate"
              title={`Serving ${company.operatingStates.join(" and ")}`}
              lede={`Our dealer and distribution network is growing across ${company.operatingStates.join(" and ")}, with our registered office in ${company.registeredState}.`}
            />
          </MotionReveal>
          <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
            {company.operatingStates.map((state, index) => (
              <MotionReveal key={state} delay={index * 0.08}>
                <div className="flex items-center gap-4 rounded-xl border bg-card p-6">
                  <div className="flex size-11 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                    <MapPin aria-hidden className="size-5" />
                  </div>
                  <div>
                    <p className="font-sans text-base font-semibold">{state}</p>
                    <p className="text-sm text-muted-foreground">
                      {state === company.registeredState
                        ? "Registered office & operations"
                        : "Dealer & distribution network"}
                    </p>
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 lg:px-8">
          <MotionReveal>
            <div className="flex size-12 items-center justify-center rounded-full bg-white/10">
              <Handshake aria-hidden className="size-6 text-brand-200" />
            </div>
          </MotionReveal>
          <MotionReveal delay={0.08}>
            <h2 className="max-w-2xl text-3xl tracking-tight text-balance sm:text-4xl">
              Partner with us as a dealer or distributor
            </h2>
          </MotionReveal>
          <MotionReveal delay={0.16}>
            <p className="max-w-xl text-pretty text-brand-200">
              Join our growing network in {company.operatingStates.join(" and ")}. Send an
              inquiry and our team will get in touch to discuss dealership terms, product
              training, and territory support.
            </p>
          </MotionReveal>
          <MotionReveal delay={0.24}>
            <Link
              href="/contact"
              className={cn(buttonVariants({ size: "lg" }), "h-11 px-6 text-base")}
            >
              Send an Inquiry
              <ArrowRight aria-hidden data-icon="inline-end" />
            </Link>
          </MotionReveal>
        </div>
      </section>
    </>
  );
}
