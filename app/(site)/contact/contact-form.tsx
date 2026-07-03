"use client";

import { CheckCircle2, Send } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { FormField, fieldAria } from "@/components/shared/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitInquiry, type InquiryInput } from "@/lib/actions/contact";

const SUBJECT_OPTIONS = [
  { value: "dealership", label: "Dealership / distribution inquiry" },
  { value: "order", label: "Order / purchase inquiry" },
  { value: "product", label: "Product question" },
  { value: "other", label: "Something else" },
] as const;

type Subject = InquiryInput["subject"];

export function ContactForm({
  initialSubject,
  productName,
}: {
  initialSubject?: string;
  productName?: string;
}) {
  const validSubject = SUBJECT_OPTIONS.some((o) => o.value === initialSubject)
    ? (initialSubject as Subject)
    : "dealership";

  const [values, setValues] = useState<InquiryInput>({
    name: "",
    organization: "",
    phone: "",
    email: "",
    subject: validSubject,
    message: productName ? `I would like to know more about ${productName}. ` : "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  function update<K extends keyof InquiryInput>(key: K, value: InquiryInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await submitInquiry(values);
      if (result.ok) {
        setFieldErrors({});
        setSubmitted(true);
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.error);
      }
    });
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-4 rounded-xl border bg-brand-50 px-6 py-14 text-center"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          <CheckCircle2 aria-hidden className="size-6" />
        </span>
        <div className="space-y-1">
          <h3 className="font-sans text-lg font-semibold">Inquiry received</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            Thank you, {values.name.split(" ")[0]}. Our team will contact you on the phone
            number or email you provided.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setSubmitted(false);
            setValues((prev) => ({ ...prev, message: "" }));
          }}
        >
          Send another inquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="contact-name" label="Full name" errors={fieldErrors.name}>
          <Input
            {...fieldAria("contact-name", fieldErrors.name)}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            autoComplete="name"
            required
          />
        </FormField>
        <FormField
          id="contact-org"
          label="Business / organization"
          optional
          errors={fieldErrors.organization}
        >
          <Input
            {...fieldAria("contact-org", fieldErrors.organization)}
            value={values.organization}
            onChange={(e) => update("organization", e.target.value)}
            autoComplete="organization"
          />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="contact-phone" label="Phone number" errors={fieldErrors.phone}>
          <Input
            {...fieldAria("contact-phone", fieldErrors.phone)}
            type="tel"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            autoComplete="tel"
            required
          />
        </FormField>
        <FormField id="contact-email" label="Email" optional errors={fieldErrors.email}>
          <Input
            {...fieldAria("contact-email", fieldErrors.email)}
            type="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            autoComplete="email"
          />
        </FormField>
      </div>

      <FormField id="contact-subject" label="I am contacting about" errors={fieldErrors.subject}>
        <select
          {...fieldAria("contact-subject", fieldErrors.subject)}
          value={values.subject}
          onChange={(e) => update("subject", e.target.value as Subject)}
          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {SUBJECT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField id="contact-message" label="Message" errors={fieldErrors.message}>
        <Textarea
          {...fieldAria("contact-message", fieldErrors.message)}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          rows={5}
          required
        />
      </FormField>

      <Button type="submit" size="lg" className="h-11 px-5" disabled={pending}>
        <Send aria-hidden data-icon="inline-start" />
        {pending ? "Sending…" : "Send inquiry"}
      </Button>
    </form>
  );
}
