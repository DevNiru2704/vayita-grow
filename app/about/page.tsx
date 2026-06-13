import Image from "next/image";
import type { Metadata } from "next";
import { Award, Leaf, Lightbulb, Heart, Shield, Handshake, CheckCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/shared/SectionHeading";
import TeamCard from "@/components/shared/TeamCard";
import { coreValues, leadership } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us - VayitaGrow BioOrganics",
  description:
    "Learn about VAYITAGROW BIOORGANICS PRIVATE LIMITED, our mission, vision, values, and leadership team driving sustainable agricultural solutions.",
};

const valueIconMap: Record<string, React.ElementType> = {
  Award,
  Leaf,
  Lightbulb,
  Heart,
  Shield,
  Handshake,
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-dark via-[#1a3a2a] to-brand-dark py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              About VayitaGrow BioOrganics
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Building sustainable agricultural solutions through innovation,
              quality, and strong field partnerships.
            </p>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <SectionHeading title="Our Story" center={false} />
                <p className="text-brand-body leading-relaxed mb-4">
                  VAYITAGROW BIOORGANICS PRIVATE LIMITED was founded with a clear
                  vision: to provide Indian farmers with high-quality, scientifically
                  formulated agricultural inputs that enhance productivity while
                  preserving soil health for future generations.
                </p>
                <p className="text-brand-body leading-relaxed mb-4">
                  Starting with a focused product range and a small team of
                  agronomists and business professionals, we have steadily built a
                  reputation for product quality, technical support, and reliable
                  business practices. Our manufacturing processes follow strict
                  quality protocols, and our field teams work directly with farmers
                  and dealers to ensure product effectiveness.
                </p>
                <p className="text-brand-body leading-relaxed">
                  Today, VayitaGrow serves a growing network of 150+ dealers across
                  10+ states, with a product portfolio spanning bio fertilizers,
                  organic fertilizers, growth promoters, micronutrients, soil
                  conditioners, and crop protection solutions.
                </p>
              </div>
              <div className="relative rounded-2xl bg-brand-light h-80 lg:h-96 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1655130944329-b3a63166f6b5?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Our Manufacturing Facility"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Vision and Mission */}
        <section className="py-20 bg-brand-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-brand-border">
                <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center mb-5">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-brand-dark mb-3">
                  Our Vision
                </h3>
                <p className="text-brand-body leading-relaxed">
                  To become a leading agricultural inputs company recognized for
                  quality, innovation, and contribution to sustainable farming
                  across India. We envision a future where every farmer has access
                  to scientifically formulated products that improve crop
                  productivity while maintaining ecological balance.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-brand-border">
                <div className="w-12 h-12 rounded-xl bg-brand-gold flex items-center justify-center mb-5">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-brand-dark mb-3">
                  Our Mission
                </h3>
                <p className="text-brand-body leading-relaxed">
                  To manufacture and market high-quality agricultural inputs
                  through a strong dealer and distribution network, supported by
                  field-level technical guidance. We are committed to building
                  lasting partnerships with dealers, distributors, and farmers
                  through reliability, transparency, and genuine value creation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Our Core Values"
              subtitle="The principles that guide every decision and action at VayitaGrow."
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.map((value) => {
                const Icon = valueIconMap[value.icon];
                return (
                  <div
                    key={value.title}
                    className="p-6 rounded-2xl border border-brand-border hover:border-brand-primary/20 hover:shadow-md transition-all"
                  >
                    <div className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center mb-4">
                      {Icon && <Icon className="w-5 h-5 text-brand-primary" />}
                    </div>
                    <h3 className="font-heading text-base font-semibold text-brand-dark mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-brand-body leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Infrastructure */}
        <section className="py-20 bg-brand-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Manufacturing Infrastructure"
              subtitle="Modern facilities equipped for consistent, high-quality production."
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Production Facility",
                  description:
                    "State-of-the-art manufacturing unit with automated production lines for consistent product quality and efficiency.",
                },
                {
                  title: "Quality Testing Lab",
                  description:
                    "In-house testing laboratory equipped with modern instruments for raw material and finished product quality analysis.",
                },
                {
                  title: "Research Center",
                  description:
                    "Dedicated research facility for product development, formulation improvement, and field trial management.",
                },
                {
                  title: "Packaging Unit",
                  description:
                    "Automated packaging lines with multiple format capabilities for retail packs to bulk institutional packaging.",
                },
                {
                  title: "Warehousing",
                  description:
                    "Climate-controlled storage facilities ensuring product stability and quality throughout the supply chain.",
                },
                {
                  title: "Distribution Hub",
                  description:
                    "Centralized logistics center for efficient order processing, dispatch, and delivery tracking across states.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-brand-border"
                >
                  <h3 className="font-heading text-base font-semibold text-brand-dark mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-brand-body leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quality Assurance */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <SectionHeading
                  title="Quality Assurance"
                  subtitle=""
                  center={false}
                />
                <p className="text-brand-body leading-relaxed mb-6">
                  At VayitaGrow, quality is not an afterthought. Every product goes
                  through a rigorous multi-stage quality assurance process, from raw
                  material sourcing to final dispatch.
                </p>
                <div className="space-y-3">
                  {[
                    "Raw material quality verification",
                    "In-process quality checks at every production stage",
                    "Finished product testing for efficacy and safety",
                    "Packaging integrity verification",
                    "Batch-wise documentation and traceability",
                    "Regulatory compliance at all stages",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-primary mt-0.5 shrink-0" />
                      <span className="text-sm text-brand-body">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative rounded-2xl bg-brand-light h-72 lg:h-80 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80"
                  alt="Quality Testing Lab"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="py-20 bg-brand-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Leadership Team"
              subtitle="Experienced professionals driving VayitaGrow's vision and growth."
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {leadership.map((member) => (
                <TeamCard key={member.name} {...member} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
