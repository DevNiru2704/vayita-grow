"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { execute } from "@/lib/db/query";
import { isSupabase } from "@/lib/db/source";
import { contactInbox, sendEmail } from "@/lib/email/resend";
import { feedbackEmail, inquiryEmail } from "@/lib/email/templates";
import { rateLimit } from "@/lib/security/rate-limit";
import type { ActionResult } from "@/lib/types/common";

/**
 * Public-site form submissions: validated, rate-limited, persisted (Postgres),
 * and forwarded to the company inbox via Resend. `website` is a honeypot — a
 * hidden field real users never fill; when present we accept silently (bot).
 */

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";
}

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name"),
  organization: z.string().trim().max(150).optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{7,17}$/, "Please enter a valid phone number"),
  email: z.string().trim().email("Please enter a valid email address").or(z.literal("")),
  subject: z.enum(["dealership", "order", "product", "other"]),
  message: z.string().trim().min(10, "Please describe your inquiry (at least 10 characters)"),
  website: z.string().optional(), // honeypot
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export async function submitInquiry(input: InquiryInput): Promise<ActionResult> {
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  if (parsed.data.website) return { ok: true, data: undefined }; // honeypot tripped

  if (!rateLimit(`contact:${await clientIp()}`, 5, 60_000).ok) {
    return { ok: false, error: "Too many submissions. Please try again in a minute." };
  }

  const { name, organization, phone, email, subject, message } = parsed.data;
  if (isSupabase) {
    await execute(
      `INSERT INTO contact_inquiries (name, organization, phone, email, subject, message)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, organization || null, phone, email || null, subject, message],
    );
  }

  const inbox = contactInbox();
  if (inbox) {
    await sendEmail({
      to: inbox,
      subject: `New inquiry (${subject}) — ${name}`,
      html: inquiryEmail(parsed.data),
      replyTo: email || undefined,
    });
  }

  return { ok: true, data: undefined };
}

const publicFeedbackSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  organization: z.string().trim().max(150).optional().or(z.literal("")),
  role: z.enum(["dealer", "distributor", "retailer", "farmer", "other"]),
  message: z.string().trim().min(10, "Please share a few words of feedback"),
  website: z.string().optional(), // honeypot
});

export type PublicFeedbackInput = z.infer<typeof publicFeedbackSchema>;

export async function submitPublicFeedback(input: PublicFeedbackInput): Promise<ActionResult> {
  const parsed = publicFeedbackSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  if (parsed.data.website) return { ok: true, data: undefined };

  if (!rateLimit(`feedback:${await clientIp()}`, 5, 60_000).ok) {
    return { ok: false, error: "Too many submissions. Please try again in a minute." };
  }

  const { name, organization, role, message } = parsed.data;
  if (isSupabase) {
    await execute(
      "INSERT INTO public_feedback (name, role, email, message) VALUES ($1, $2, $3, $4)",
      [name, role, null, message],
    );
  }

  const inbox = contactInbox();
  if (inbox) {
    await sendEmail({
      to: inbox,
      subject: `New feedback (${role}) — ${name}`,
      html: feedbackEmail({ name, organization: organization || undefined, role, message }),
    });
  }

  return { ok: true, data: undefined };
}
