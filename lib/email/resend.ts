import "server-only";
import { Resend } from "resend";

/**
 * Resend email client. Degrades gracefully: when RESEND_API_KEY is unset (e.g.
 * the zero-infra mock demo), sends are skipped and logged rather than throwing,
 * so public forms keep working. Never expose the API key to the client.
 */

let client: Resend | null = null;

function resendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  client ??= new Resend(key);
  return client;
}

export function contactInbox(): string | null {
  return process.env.CONTACT_INBOX ?? null;
}

interface SendOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(options: SendOptions): Promise<boolean> {
  const resend = resendClient();
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not set — skipped: "${options.subject}"`);
    return false;
  }
  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    });
    if (error) {
      console.error("[email] send failed:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] send threw:", err);
    return false;
  }
}
