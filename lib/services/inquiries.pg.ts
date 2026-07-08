import "server-only";
import { paginate } from "@/lib/db/list";
import type { ListParams, Paginated } from "@/lib/types/common";
import type { ContactInquiry, PublicFeedbackEntry } from "@/lib/types/inquiries";

export async function getContactInquiries(
  params?: ListParams & { subject?: string },
): Promise<Paginated<ContactInquiry>> {
  return paginate<ContactInquiry>(
    {
      select: `
        SELECT inquiry_id, name, organization, phone, email, subject, message, created_at
        FROM contact_inquiries`,
      where: params?.subject ? ["subject = $1"] : [],
      params: params?.subject ? [params.subject] : [],
      searchColumns: ["name", "organization", "email", "phone", "message"],
      sorters: { createdAt: "created_at", name: "name" },
      defaultSort: "createdAt",
      defaultDir: "desc",
    },
    params,
  );
}

export async function getPublicFeedback(
  params?: ListParams & { role?: string },
): Promise<Paginated<PublicFeedbackEntry>> {
  return paginate<PublicFeedbackEntry>(
    {
      select: `
        SELECT feedback_id, name, role, email, message, created_at
        FROM public_feedback`,
      where: params?.role ? ["role = $1"] : [],
      params: params?.role ? [params.role] : [],
      searchColumns: ["name", "email", "message"],
      sorters: { createdAt: "created_at", name: "name" },
      defaultSort: "createdAt",
      defaultDir: "desc",
    },
    params,
  );
}
