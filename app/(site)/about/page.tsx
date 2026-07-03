import { ArrowRight, Eye, Factory, Target, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { MotionReveal } from "@/components/shared/MotionReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { company } from "@/lib/config/company";
import { coreValues } from "@/lib/config/marketing";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us",
  description: `${company.legalName} - an agricultural inputs manufacturer focused on sustainable farming, operating across ${company.operatingStates.join(" and ")}.`,
};

const operations = [
  {
    title: "Manufacturing",
    description:
      "Bioorganic inputs - growth promoters, organic fertilizers, soil conditioners, enzymes, and spray adjuvants - produced under careful quality control.",
    icon: Factory,
  },
  {
    title: "Marketing & Distribution",
    description: `Products reach farmers through a dealer and distributor network across ${company.operatingStates.join(" and ")}, supported by planned dispatch and delivery tracking.`,
    icon: Target,
  },
  {
    title: "Field Support",
    description:
      "Field teams conduct dealer visits, application demonstrations, and farmer meetings - turning ground-level feedback into better products and better guidance.",
    icon: Users,
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Page header */}
      <section className="border-b bg-brand-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <MotionReveal>
            <SectionHeading
              align="left"
              eyebrow="About Us"
              title={company.legalName}
              lede={`A ${company.businessModel} agricultural solutions company manufacturing and marketing bioorganic inputs for sustainable, productive farming.`}
            />
          </MotionReveal>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2">
          <MotionReveal>
            <SectionHeading
              align="left"
              eyebrow="Our Story"
              title="Rooted in soil health, grown through partnership"
            />
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                {company.shortName} Bioorganics was founded to bring dependable, science-led
                bioorganic inputs to the farmers of {company.operatingStates.join(" and ")}. We
                focus on products that improve soil health, crop nutrition, and overall farm
                efficiency - the foundations of long-term productivity.
              </p>
              <p>
                We work business-to-business: dealers, distributors, retailers, and
                institutional buyers are our partners on the ground. Their counters and
                godowns are where our products meet the farmer, so we invest in the network -
                fair terms, reliable supply, and field support that shows up.
              </p>
              <p>
                With our registered office in {company.registeredState}, and operations across
                both states, we are building the organization, product range, and digital
                systems of a company preparing for wider expansion.
              </p>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.12}>
            <div className="space-y-4">
              <div className="rounded-xl border bg-card p-6">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                  <Eye aria-hidden className="size-5" />
                </div>
                <h3 className="font-sans text-base font-semibold">Our Vision</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  To be a trusted name in sustainable agriculture - known for products that
                  restore soil, support farmers, and prove that productive farming and
                  responsible farming are the same thing.
                </p>
              </div>
              <div className="rounded-xl border bg-card p-6">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                  <Target aria-hidden className="size-5" />
                </div>
                <h3 className="font-sans text-base font-semibold">Our Mission</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Deliver quality bioorganic inputs through a strong dealer network, backed by
                  technical field support and honest, transparent business practices.
                </p>
              </div>
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* What we do */}
      <section className="border-y bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <MotionReveal>
            <SectionHeading
              eyebrow="What We Do"
              title="Manufacturing, marketing, and field support"
              lede="Three connected capabilities that carry a product from formulation to a farmer's field."
            />
          </MotionReveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {operations.map((item, index) => (
              <MotionReveal key={item.title} delay={index * 0.08}>
                <div className="h-full rounded-xl border bg-card p-6">
                  <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                    <item.icon aria-hidden className="size-5" />
                  </div>
                  <h3 className="font-sans text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <MotionReveal>
          <SectionHeading
            eyebrow="Core Values"
            title="The principles behind every decision"
          />
        </MotionReveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {coreValues.map((value, index) => (
            <MotionReveal key={value.title} delay={Math.min(index * 0.06, 0.24)}>
              <div className="h-full rounded-xl border bg-card p-6">
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                  <value.icon aria-hidden className="size-5" />
                </div>
                <h3 className="font-sans text-sm font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-brand-50">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-16 text-center sm:px-6 lg:px-8">
          <MotionReveal>
            <h2 className="max-w-2xl text-2xl tracking-tight text-balance sm:text-3xl">
              See the products behind the company
            </h2>
          </MotionReveal>
          <MotionReveal delay={0.1}>
            <Link href="/products" className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}>
              Explore the product range
              <ArrowRight aria-hidden data-icon="inline-end" />
            </Link>
          </MotionReveal>
        </div>
      </section>
    </>
  );
}
