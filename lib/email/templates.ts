import "server-only";
import { company } from "@/lib/config/company";

/**
 * Minimal, inline-styled transactional email templates (email clients ignore
 * external CSS). All user-provided values are HTML-escaped to prevent injection.
 */

function esc(value: string | null | undefined): string {
  return (value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function row(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:6px 12px;color:#5b6b5f;font-size:13px;white-space:nowrap;vertical-align:top">${esc(label)}</td>
    <td style="padding:6px 12px;color:#14231a;font-size:14px">${esc(value)}</td>
  </tr>`;
}

function shell(title: string, body: string): string {
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto">
    <div style="background:#14833b;color:#fff;padding:16px 20px;border-radius:10px 10px 0 0;font-size:15px;font-weight:600">
      ${esc(company.displayName)} — ${esc(title)}
    </div>
    <div style="border:1px solid #e3e8e4;border-top:none;border-radius:0 0 10px 10px;padding:16px 8px">
      <table style="width:100%;border-collapse:collapse">${body}</table>
    </div>
  </div>`;
}

export interface InquiryEmailData {
  name: string;
  organization?: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
}

export function inquiryEmail(data: InquiryEmailData): string {
  return shell(
    "New website inquiry",
    row("Name", data.name) +
      row("Organization", data.organization) +
      row("Phone", data.phone) +
      row("Email", data.email) +
      row("Subject", data.subject) +
      row("Message", data.message),
  );
}

export interface FeedbackEmailData {
  name: string;
  organization?: string;
  role: string;
  message: string;
}

export function feedbackEmail(data: FeedbackEmailData): string {
  return shell(
    "New website feedback",
    row("Name", data.name) +
      row("Organization", data.organization) +
      row("Role", data.role) +
      row("Feedback", data.message),
  );
}

export interface QuotationEmailData {
  quotationNumber: string;
  customerName: string;
  total: string;
  validUntil: string | null;
  assignedBy: string;
  notes: string | null;
}

export function quotationEmail(data: QuotationEmailData): string {
  return shell(
    "Quotation assigned to you",
    row("Quotation", data.quotationNumber) +
      row("Client", data.customerName) +
      row("Total", data.total) +
      row("Valid until", data.validUntil) +
      row("Assigned by", data.assignedBy) +
      row("Notes", data.notes),
  );
}
