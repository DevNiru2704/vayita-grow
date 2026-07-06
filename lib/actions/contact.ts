"use server";

import { z } from "zod";
import { latency } from "@/lib/mock/store";
import type { ActionResult } from "@/lib/types/common";

/**
 * Public-site form submissions. MOCK IMPLEMENTATION - the backend phase
 * will persist these (and likely notify staff by email). The validation
 * contract and return shape are final.
 */

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
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export async function submitInquiry(input: InquiryInput): Promise<ActionResult> {
  await latency();
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  // Simulated persistence only in the frontend-only phase.
  return { ok: true, data: undefined };
}

const publicFeedbackSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  organization: z.string().trim().max(150).optional().or(z.literal("")),
  role: z.enum(["dealer", "distributor", "retailer", "farmer", "other"]),
  message: z.string().trim().min(10, "Please share a few words of feedback"),
});

export type PublicFeedbackInput = z.infer<typeof publicFeedbackSchema>;

export async function submitPublicFeedback(input: PublicFeedbackInput): Promise<ActionResult> {
  await latency();
  const parsed = publicFeedbackSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  return { ok: true, data: undefined };
}
