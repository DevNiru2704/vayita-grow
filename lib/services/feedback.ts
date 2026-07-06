import "server-only";
import { db, latency } from "@/lib/mock/store";
import type { ListParams, Paginated } from "@/lib/types/common";
import type { FeedbackStatus } from "@/lib/types/database";
import type { FeedbackWithUser } from "@/lib/types/feedback";
import { applyList } from "./helpers";

// MOCK IMPLEMENTATION - replace bodies with Supabase queries. Signatures are the contract.

export async function getFeedbackTickets(
  params?: ListParams & { status?: FeedbackStatus },
): Promise<Paginated<FeedbackWithUser>> {
  await latency();
  const data = db();
  let rows = data.feedback;
  if (params?.status) rows = rows.filter((f) => f.status === params.status);

  const enriched: FeedbackWithUser[] = rows.map((ticket) => ({
    ...ticket,
    username: data.users.find((u) => u.userId === ticket.userId)?.username ?? "unknown",
  }));

  return applyList(enriched, params, {
    search: (f) => `${f.subject} ${f.message} ${f.username}`,
    sorters: { createdAt: (f) => f.createdAt, status: (f) => f.status },
    defaultSort: "createdAt",
    defaultDir: "desc",
  });
}
