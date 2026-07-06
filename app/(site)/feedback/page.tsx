import { MessageSquareHeart, Sprout, Users } from "lucide-react";
import type { Metadata } from "next";
import { MotionReveal } from "@/components/shared/MotionReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { company } from "@/lib/config/company";
import { FeedbackForm } from "./feedback-form";

export const metadata: Metadata = {
  title: "Feedback",
  description: `Share your experience with ${company.shortName} Bioorganics products and service - feedback from dealers, retailers, and farmers shapes what we build next.`,
};

const reasons = [
  {
    icon: Sprout,
    title: "Product performance",
    description:
      "Tell us how our products perform on real crops and soils - results, dosage experience, and anything that could work better.",
  },
  {
    icon: Users,
    title: "Dealer & service experience",
    description:
      "Supply timelines, packaging, field support, business terms - we want to know how working with us feels on the ground.",
  },
  {
    icon: MessageSquareHeart,
    title: "Suggestions",
    description:
      "Ideas for new products, pack sizes, or regional needs we should be covering. The best suggestions come from the field.",
  },
];

export default function FeedbackPage() {
  return (
    <>
      <section className="border-b bg-brand-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <MotionReveal>
            <SectionHeading
              align="left"
              eyebrow="Feedback"
              title="Your experience shapes our products"
              lede="We are building this company together with our dealer network and the farmers they serve. Honest feedback - good or critical - is always welcome."
            />
          </MotionReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <MotionReveal>
            <div className="space-y-4">
              {reasons.map((reason) => (
                <div key={reason.title} className="flex gap-4 rounded-xl border bg-card p-5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                    <reason.icon aria-hidden className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-sans text-sm font-semibold">{reason.title}</h2>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </MotionReveal>

          <MotionReveal delay={0.1}>
            <div className="rounded-2xl border bg-card p-6 sm:p-8">
              <h2 className="font-sans text-lg font-semibold">Share your feedback</h2>
              <p className="mt-1 mb-6 text-sm text-muted-foreground">
                A few honest lines are more valuable than a long form.
              </p>
              <FeedbackForm />
            </div>
          </MotionReveal>
        </div>
      </section>
    </>
  );
}
