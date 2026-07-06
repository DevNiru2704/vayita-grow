import type { FeedbackStatus } from "./database";

/** Mirrors `feedback` (ERD v1.2.0) - internal support/feedback tickets. */

export interface FeedbackTicket {
  feedbackId: number;
  userId: number;
  subject: string;
  message: string;
  status: FeedbackStatus;
  createdAt: string;
}

export interface FeedbackWithUser extends FeedbackTicket {
  username: string;
}

export interface FeedbackInput {
  subject: string;
  message: string;
}
