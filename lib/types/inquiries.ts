/** Public-site submissions surfaced in the dashboard (read-only inboxes). */

export interface ContactInquiry {
  inquiryId: number;
  name: string;
  organization: string | null;
  phone: string;
  email: string | null;
  subject: string;
  message: string;
  createdAt: string;
}

export interface PublicFeedbackEntry {
  feedbackId: number;
  name: string;
  role: string;
  email: string | null;
  message: string;
  createdAt: string;
}

/** Stored value → human label for the contact form's subject select. */
export const CONTACT_SUBJECT_LABELS: Record<string, string> = {
  dealership: "Dealership / distribution",
  order: "Order / purchase",
  product: "Product question",
  other: "Something else",
};

/** Stored value → human label for the public feedback role select. */
export const PUBLIC_FEEDBACK_ROLE_LABELS: Record<string, string> = {
  dealer: "Dealer",
  distributor: "Distributor",
  retailer: "Retailer",
  farmer: "Farmer",
  other: "Other",
};

export const CONTACT_SUBJECTS = Object.keys(CONTACT_SUBJECT_LABELS);
export const PUBLIC_FEEDBACK_ROLES = Object.keys(PUBLIC_FEEDBACK_ROLE_LABELS);
