import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { MotionReveal } from "@/components/shared/MotionReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { company } from "@/lib/config/company";
import { getProductBySlug } from "@/lib/services/products";
import { paramString } from "@/lib/url";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact & Orders",
  description: `Contact ${company.shortName} Bioorganics for dealership, distribution, and product inquiries across ${company.operatingStates.join(" and ")}.`,
};

export default async function ContactPage(props: PageProps<"/contact">) {
  const searchParams = await props.searchParams;
  const subject = paramString(searchParams, "subject");
  const productSlug = paramString(searchParams, "product");
  const product = productSlug ? await getProductBySlug(productSlug) : null;

  const contactCards = [
    {
      icon: MapPin,
      title: "Registered Office",
      lines: company.contact.addressLines,
    },
    {
      icon: Phone,
      title: "Phone",
      lines: [`Landline: ${company.contact.landline}`, `Mobile: ${company.contact.mobile}`],
    },
    {
      icon: Mail,
      title: "Email",
      lines: [company.contact.email],
    },
    {
      icon: Clock,
      title: "Office Hours",
      lines: [company.contact.hours],
    },
  ];

  return (
    <>
      <section className="border-b bg-brand-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <MotionReveal>
            <SectionHeading
              align="left"
              eyebrow="Contact & Orders"
              title="Talk to our team"
              lede="Whether you want to join the dealer network, place an order inquiry, or ask about a product - send a message and we will get back to you."
            />
          </MotionReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <MotionReveal>
            <div className="space-y-4">
              {contactCards.map((card) => (
                <div key={card.title} className="flex gap-4 rounded-xl border bg-card p-5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                    <card.icon aria-hidden className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-sans text-sm font-semibold">{card.title}</h2>
                    {card.lines.map((line) => (
                      <p key={line} className="mt-1 text-sm text-muted-foreground">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              <p className="rounded-xl border border-dashed bg-muted/50 p-4 text-xs leading-relaxed text-muted-foreground">
                We operate across {company.operatingStates.join(" and ")}. For dealership
                inquiries, please mention your district and the territory you can serve.
              </p>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.1}>
            <div className="rounded-2xl border bg-card p-6 sm:p-8">
              <h2 className="font-sans text-lg font-semibold">Send an inquiry</h2>
              <p className="mt-1 mb-6 text-sm text-muted-foreground">
                {product
                  ? `Asking about ${product.name} - we have pre-filled part of the message for you.`
                  : "Fill in the form and our team will respond within working hours."}
              </p>
              <ContactForm initialSubject={subject} productName={product?.name} />
            </div>
          </MotionReveal>
        </div>
      </section>
    </>
  );
}
