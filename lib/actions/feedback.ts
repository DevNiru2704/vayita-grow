"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { recordActivity } from "@/lib/mock/activity";
import { db, latency, nextId, nowIso } from "@/lib/mock/store";
import type { ActionResult } from "@/lib/types/common";
import { FEEDBACK_STATUSES, type FeedbackStatus } from "@/lib/types/database";
import type { FeedbackInput } from "@/lib/types/feedback";

// MOCK IMPLEMENTATION - replace store mutations with Supabase queries.

const ticketSchema = z.object({
  subject: z.string().trim().min(5, "Subject must be at least 5 characters").max(150),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

export async function createFeedbackTicket(
  input: FeedbackInput,
): Promise<ActionResult<{ id: number }>> {
  const session = await requireSession();
  await latency();
  const parsed = ticketSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const store = db();
  const feedbackId = nextId(store.feedback, "feedbackId");
  store.feedback.push({
    feedbackId,
    userId: session.userId,
    subject: parsed.data.subject,
    message: parsed.data.message,
    status: "Open",
    createdAt: nowIso(),
  });

  recordActivity(session.userId, "CREATE", "SYSTEM", feedbackId);
  revalidatePath("/dashboard/feedback");
  return { ok: true, data: { id: feedbackId } };
}

export async function updateFeedbackStatus(
  feedbackId: number,
  status: FeedbackStatus,
): Promise<ActionResult> {
  const session = await requireSession();
  await latency();
  if (!FEEDBACK_STATUSES.includes(status)) {
    return { ok: false, error: "Invalid status." };
  }

  const ticket = db().feedback.find((f) => f.feedbackId === feedbackId);
  if (!ticket) return { ok: false, error: "Ticket not found." };

  ticket.status = status;
  recordActivity(session.userId, "UPDATE", "SYSTEM", feedbackId);
  revalidatePath("/dashboard/feedback");
  return { ok: true, data: undefined };
}
