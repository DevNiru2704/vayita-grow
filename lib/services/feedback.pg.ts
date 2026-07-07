import "server-only";
import { revalidatePath } from "next/cache";
import { paginate } from "@/lib/db/list";
import { queryOne, withActor } from "@/lib/db/query";
import type { ActionResult, ListParams, Paginated } from "@/lib/types/common";
import type { FeedbackStatus } from "@/lib/types/database";
import type { FeedbackInput, FeedbackWithUser } from "@/lib/types/feedback";
import type { SessionUser } from "@/lib/types/user";

const SELECT = `
  SELECT f.feedback_id, f.user_id, f.subject, f.message, f.status, f.created_at,
         u.username
  FROM feedback f
  JOIN users u ON u.user_id = f.user_id`;

export async function getFeedbackTickets(
  params?: ListParams & { status?: FeedbackStatus },
): Promise<Paginated<FeedbackWithUser>> {
  return paginate<FeedbackWithUser>(
    {
      select: SELECT,
      where: params?.status ? ["f.status = $1"] : [],
      params: params?.status ? [params.status] : [],
      searchColumns: ["f.subject", "f.message", "u.username"],
      sorters: { createdAt: "f.created_at", status: "f.status" },
      defaultSort: "createdAt",
      defaultDir: "desc",
    },
    params,
  );
}

export async function createFeedbackTicket(
  data: FeedbackInput,
  session: SessionUser,
): Promise<ActionResult<{ id: number }>> {
  const id = await withActor(session.userId, async (c) => {
    const { rows } = await c.query(
      `INSERT INTO feedback (user_id, subject, message, status)
       VALUES ($1, $2, $3, 'Open') RETURNING feedback_id`,
      [session.userId, data.subject, data.message],
    );
    const feedbackId = rows[0].feedback_id as number;
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'CREATE', 'SYSTEM', $2)",
      [session.userId, feedbackId],
    );
    return feedbackId;
  });
  revalidatePath("/dashboard/feedback");
  return { ok: true, data: { id } };
}

export async function updateFeedbackStatus(
  feedbackId: number,
  status: FeedbackStatus,
  session: SessionUser,
): Promise<ActionResult> {
  const ticket = await queryOne<{ feedbackId: number }>(
    "SELECT feedback_id FROM feedback WHERE feedback_id = $1",
    [feedbackId],
  );
  if (!ticket) return { ok: false, error: "Ticket not found." };

  await withActor(session.userId, async (c) => {
    await c.query("UPDATE feedback SET status = $1 WHERE feedback_id = $2", [status, feedbackId]);
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'UPDATE', 'SYSTEM', $2)",
      [session.userId, feedbackId],
    );
  });
  revalidatePath("/dashboard/feedback");
  return { ok: true, data: undefined };
}
