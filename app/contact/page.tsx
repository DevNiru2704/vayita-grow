"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-dark via-[#1a3a2a] to-brand-dark py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Get in touch with us for product inquiries, dealership
              opportunities, or any business-related questions.
            </p>
          </div>
        </section>

        {/* Contact Info + Form */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Left - Contact Info */}
              <div className="lg:col-span-2 space-y-6">
                <SectionHeading
                  title="Get In Touch"
                  subtitle=""
                  center={false}
                />
                <p className="text-brand-body leading-relaxed">
                  We welcome inquiries from potential dealers, distributors,
                  retailers, and agricultural partners. Our team is ready to
                  discuss how we can work together.
                </p>

                {/* Contact Cards */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-brand-section border border-brand-border">
                    <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-brand-dark mb-1">
                        Address
                      </h4>
                      <p className="text-sm text-brand-body">
                        Kolkata, West Bengal, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-brand-section border border-brand-border">
                    <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-brand-dark mb-1">
                        Phone
                      </h4>
                      <p className="text-sm text-brand-body">+91 9876543210</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-brand-section border border-brand-border">
                    <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-brand-dark mb-1">
                        Email
                      </h4>
                      <p className="text-sm text-brand-body">
                        info@vayitagrow.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-brand-section border border-brand-border">
                    <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-brand-dark mb-1">
                        Business Hours
                      </h4>
                      <p className="text-sm text-brand-body">
                        Monday to Saturday
                      </p>
                      <p className="text-sm text-brand-body">
                        9:00 AM to 6:00 PM IST
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Form */}
              <div className="lg:col-span-3">
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-brand-border space-y-5"
                >
                  <h3 className="font-heading text-xl font-semibold text-brand-dark mb-2">
                    Send Us a Message
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-sm font-medium text-brand-dark mb-1.5"
                      >
                        Full Name
                      </label>
                      <Input
                        id="contact-name"
                        placeholder="Your full name"
                        required
                        className="rounded-xl h-11"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-company"
                        className="block text-sm font-medium text-brand-dark mb-1.5"
                      >
                        Company
                      </label>
                      <Input
                        id="contact-company"
                        placeholder="Your company name"
                        className="rounded-xl h-11"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-sm font-medium text-brand-dark mb-1.5"
                      >
                        Email
                      </label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="your@email.com"
                        required
                        className="rounded-xl h-11"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-sm font-medium text-brand-dark mb-1.5"
                      >
                        Phone
                      </label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        placeholder="+91 9876543210"
                        required
                        className="rounded-xl h-11"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-sm font-medium text-brand-dark mb-1.5"
                    >
                      Subject
                    </label>
                    <Input
                      id="contact-subject"
                      placeholder="Dealership inquiry, product query, etc."
                      required
                      className="rounded-xl h-11"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-medium text-brand-dark mb-1.5"
                    >
                      Message
                    </label>
                    <Textarea
                      id="contact-message"
                      placeholder="Tell us about your requirements..."
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
                    Send Message
                  </Button>
                  {submitted && (
                    <p className="text-sm text-brand-primary text-center font-medium">
                      Thank you! Your message has been sent successfully.
                    </p>
                  )}
                </form>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-16 rounded-2xl bg-brand-section border border-brand-border h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-10 h-10 text-brand-primary/30 mx-auto mb-3" />
                <p className="text-sm font-medium text-brand-body">
                  Kolkata, West Bengal, India
                </p>
                <p className="text-xs text-brand-body mt-1">Map Location</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
