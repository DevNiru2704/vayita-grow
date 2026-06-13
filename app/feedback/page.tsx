"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/shared/SectionHeading";
import TestimonialCard from "@/components/shared/TestimonialCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { testimonials } from "@/lib/data";
import { Send } from "lucide-react";

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const customerTestimonials = testimonials.filter(
    (t) => t.role === "Progressive Farmer" || t.role === "Agricultural Consultant"
  );
  const dealerTestimonials = testimonials.filter(
    (t) =>
      t.role === "Agricultural Dealer" ||
      t.role === "Distributor" ||
      t.role === "District Dealer" ||
      t.role === "Retail Store Owner"
  );

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-dark via-[#1a3a2a] to-brand-dark py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Feedback and Testimonials
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Hear from our partners and share your experience with VayitaGrow
              products.
            </p>
          </div>
        </section>

        {/* Dealer Testimonials */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Dealer and Distributor Testimonials"
              subtitle="What our business partners say about working with VayitaGrow."
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dealerTestimonials.map((t) => (
                <TestimonialCard key={t.name} {...t} />
              ))}
            </div>
          </div>
        </section>

        {/* Customer Testimonials */}
        <section className="py-20 bg-brand-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Customer Testimonials"
              subtitle="Farmers and consultants share their experience with our products."
            />
            <div className="grid sm:grid-cols-2 gap-6">
              {customerTestimonials.map((t) => (
                <TestimonialCard key={t.name} {...t} />
              ))}
            </div>
          </div>
        </section>

        {/* Feedback Form */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Share Your Feedback"
              subtitle="We value your input. Tell us about your experience with our products and services."
            />
            <div className="max-w-xl mx-auto">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl p-8 shadow-sm border border-brand-border space-y-5"
              >
                <div>
                  <label
                    htmlFor="feedback-name"
                    className="block text-sm font-medium text-brand-dark mb-1.5"
                  >
                    Full Name
                  </label>
                  <Input
                    id="feedback-name"
                    placeholder="Enter your full name"
                    required
                    className="rounded-xl h-11"
                  />
                </div>
                <div>
                  <label
                    htmlFor="feedback-company"
                    className="block text-sm font-medium text-brand-dark mb-1.5"
                  >
                    Company Name
                  </label>
                  <Input
                    id="feedback-company"
                    placeholder="Enter your company name"
                    className="rounded-xl h-11"
                  />
                </div>
                <div>
                  <label
                    htmlFor="feedback-phone"
                    className="block text-sm font-medium text-brand-dark mb-1.5"
                  >
                    Phone Number
                  </label>
                  <Input
                    id="feedback-phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    required
                    className="rounded-xl h-11"
                  />
                </div>
                <div>
                  <label
                    htmlFor="feedback-message"
                    className="block text-sm font-medium text-brand-dark mb-1.5"
                  >
                    Your Message
                  </label>
                  <Textarea
                    id="feedback-message"
                    placeholder="Share your experience with VayitaGrow products..."
                    required
                    rows={5}
                    className="rounded-xl resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-brand-primary hover:bg-brand-secondary text-white rounded-xl h-11 text-sm font-medium"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Feedback
                </Button>
                {submitted && (
                  <p className="text-sm text-brand-primary text-center font-medium">
                    Thank you! Your feedback has been submitted successfully.
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
