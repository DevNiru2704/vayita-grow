import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Leaf,
  Sprout,
  Mountain,
  Factory,
  FlaskConical,
  Users,
  Truck,
  MapPin,
  // New icons for the official catalog
  Flower2,
  Wheat,
  Scale,
  Activity,
  Maximize,
  Waves,
  HelpCircle // Fallback icon
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/shared/SectionHeading";
import StatCard from "@/components/shared/StatCard";
import TestimonialCard from "@/components/shared/TestimonialCard";
import { Button } from "@/components/ui/button";
import { companyStats, productCategories, whyChooseUs, testimonials } from "@/lib/data";

// Updated to match your exact Vayitagrow catalog data
const categoryIconMap: Record<string, React.ElementType> = {
  Leaf,
  FlaskConical,
  Sprout,
  Flower2,
  Wheat,
  Scale,
  Mountain,
  Activity,
  Maximize,
  Waves,
};

// Kept exactly as you had it for the "Why Choose Us" section
const whyIconMap: Record<string, React.ElementType> = {
  Factory,
  FlaskConical,
  Users,
  Truck,
};
export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* ===== HERO SECTION ===== */}
        <section className="relative bg-gradient-to-br from-brand-dark via-[#1a3a2a] to-brand-dark overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-secondary rounded-full blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
                <Leaf className="w-4 h-4 text-brand-secondary" />
                <span className="text-sm font-medium text-gray-300">
                  Agricultural Solutions Provider
                </span>
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Sustainable Agricultural Solutions for Modern Farming
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-2xl">
                Manufacturing and marketing agricultural inputs that help farmers
                improve productivity while supporting long-term soil health.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/products">
                  <Button className="bg-brand-primary hover:bg-brand-secondary text-white rounded-xl px-7 h-12 text-sm font-medium w-full sm:w-auto">
                    Explore Products
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl px-7 h-12 text-sm font-medium w-full sm:w-auto">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
              {companyStats.map((stat) => (
                <StatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  variant="hero"
                />
              ))}
            </div>
          </div>
        </section>

        {/* ===== ABOUT SNAPSHOT ===== */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image placeholder */}
              <div className="relative">
                <div className="rounded-2xl bg-brand-light h-80 lg:h-96 flex items-center justify-center overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1710666184386-9f42d0227237?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="VayitaGrow BioOrganics Manufacturing Facility"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-brand-gold/10 rounded-2xl -z-10" />
              </div>

              {/* Content */}
              <div>
                <SectionHeading
                  title="About VayitaGrow BioOrganics"
                  subtitle=""
                  center={false}
                />
                <p className="text-brand-body leading-relaxed mb-4">
                  VAYITAGROW BIOORGANICS PRIVATE LIMITED is a forward-thinking
                  agricultural solutions company dedicated to the manufacturing and
                  marketing of high-quality agricultural inputs. We focus on products
                  that support sustainable and productive farming practices across
                  India.
                </p>
                <p className="text-brand-body leading-relaxed mb-6">
                  Our product range spans bio fertilizers, organic fertilizers,
                  plant growth promoters, micronutrients, soil conditioners, and
                  crop protection solutions, all developed with scientific rigor
                  and field-tested performance.
                </p>
                <Link href="/about">
                  <Button className="bg-brand-primary hover:bg-brand-secondary text-white rounded-xl px-6 h-10 text-sm font-medium">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PRODUCT CATEGORIES ===== */}
        <section className="py-20 bg-brand-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Our Product Categories"
              subtitle="A comprehensive range of agricultural inputs designed for modern farming needs."
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productCategories.map((category) => {
                const Icon = categoryIconMap[category.icon];
                return (
                  <div
                    key={category.name}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-brand-border group hover:shadow-md hover:border-brand-primary/20 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center mb-4 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                      {Icon && (
                        <Icon className="w-6 h-6 text-brand-primary group-hover:text-white transition-colors" />
                      )}
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-brand-dark mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-brand-body leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== WHY CHOOSE US ===== */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Why Choose VayitaGrow"
              subtitle="Built on quality, driven by research, and committed to farmer success."
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChooseUs.map((item) => {
                const Icon = whyIconMap[item.icon];
                return (
                  <div
                    key={item.title}
                    className="text-center p-6 rounded-2xl border border-brand-border hover:border-brand-primary/20 hover:shadow-md transition-all"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-brand-light flex items-center justify-center mx-auto mb-4">
                      {Icon && <Icon className="w-7 h-7 text-brand-primary" />}
                    </div>
                    <h3 className="font-heading text-base font-semibold text-brand-dark mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-brand-body leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== BUSINESS PRESENCE ===== */}
        <section className="py-20 bg-brand-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Map image */}
              <div className="relative rounded-2xl bg-brand-light h-80 lg:h-96 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80"
                  alt="Pan-India Presence"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-8">
                  <MapPin className="w-12 h-12 text-white mb-4" />
                  <h3 className="font-heading text-xl font-bold text-white mb-2 text-center">
                    Pan-India Presence
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    {[
                      "Gujarat",
                      "Maharashtra",
                      "Rajasthan",
                      "MP",
                      "UP",
                      "Punjab",
                      "West Bengal",
                      "AP",
                      "Karnataka",
                      "Tamil Nadu",
                    ].map((state) => (
                      <span
                        key={state}
                        className="text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full font-medium border border-white/30"
                      >
                        {state}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div>
                <SectionHeading
                  title="Growing Across India"
                  subtitle="Our expanding network brings quality agricultural inputs closer to farmers in every region."
                  center={false}
                />
                <div className="grid grid-cols-2 gap-4">
                  {companyStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white rounded-2xl p-5 border border-brand-border"
                    >
                      <p className="font-heading text-2xl font-bold text-brand-primary">
                        {stat.value}
                      </p>
                      <p className="text-sm font-medium text-brand-body mt-1">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="What Our Partners Say"
              subtitle="Trusted by dealers, distributors, and farmers across the country."
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((t) => (
                <TestimonialCard key={t.name} {...t} />
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-20 bg-brand-primary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Partner With Us?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Join our growing network of dealers and distributors. Together, we
              can bring sustainable agricultural solutions to every farmer.
            </p>
            <Link href="/contact">
              <Button className="bg-white text-brand-primary hover:bg-gray-100 rounded-xl px-8 h-12 text-sm font-semibold">
                Contact Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
