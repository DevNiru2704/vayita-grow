"use client";

import { CheckCircle2, Send } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { FormField, fieldAria } from "@/components/shared/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitPublicFeedback, type PublicFeedbackInput } from "@/lib/actions/contact";

const ROLE_OPTIONS = [
  { value: "dealer", label: "Dealer" },
  { value: "distributor", label: "Distributor" },
  { value: "retailer", label: "Retailer" },
  { value: "farmer", label: "Farmer" },
  { value: "other", label: "Other" },
] as const;

type Role = PublicFeedbackInput["role"];

export function FeedbackForm() {
  const [values, setValues] = useState<PublicFeedbackInput>({
    name: "",
    organization: "",
    role: "dealer",
    message: "",
    website: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  function update<K extends keyof PublicFeedbackInput>(key: K, value: PublicFeedbackInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await submitPublicFeedback(values);
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
          <h3 className="font-sans text-lg font-semibold">Feedback received</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            Thank you for taking the time - feedback from the field directly shapes our
            products and service.
          </p>
        </div>
        <Button variant="outline" onClick={() => setSubmitted(false)}>
          Share more feedback
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot: hidden from users; bots that fill it are silently dropped. */}
      <div aria-hidden className="hidden">
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={values.website ?? ""}
            onChange={(e) => update("website", e.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="feedback-name" label="Your name" errors={fieldErrors.name}>
          <Input
            {...fieldAria("feedback-name", fieldErrors.name)}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            autoComplete="name"
            required
          />
        </FormField>
        <FormField
          id="feedback-org"
          label="Business / organization"
          optional
          errors={fieldErrors.organization}
        >
          <Input
            {...fieldAria("feedback-org", fieldErrors.organization)}
            value={values.organization}
            onChange={(e) => update("organization", e.target.value)}
            autoComplete="organization"
          />
        </FormField>
      </div>

      <FormField id="feedback-role" label="You are a" errors={fieldErrors.role}>
        <select
          {...fieldAria("feedback-role", fieldErrors.role)}
          value={values.role}
          onChange={(e) => update("role", e.target.value as Role)}
          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {ROLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField id="feedback-message" label="Your feedback" errors={fieldErrors.message}>
        <Textarea
          {...fieldAria("feedback-message", fieldErrors.message)}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          rows={5}
          required
        />
      </FormField>

      <Button type="submit" size="lg" className="h-11 px-5" disabled={pending}>
        <Send aria-hidden data-icon="inline-start" />
        {pending ? "Sending…" : "Submit feedback"}
      </Button>
    </form>
  );
}
