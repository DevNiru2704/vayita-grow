import "server-only";
import { db, latency } from "@/lib/mock/store";
import type { ActivityLogWithUser } from "@/lib/types/activity";
import type { ListParams, Paginated } from "@/lib/types/common";
import type { ActionType, EntityType } from "@/lib/types/database";
import { applyList } from "./helpers";

// MOCK IMPLEMENTATION - replace bodies with Supabase queries. Signatures are the contract.

const ACTION_VERBS: Record<ActionType, string> = {
  CREATE: "created",
  UPDATE: "updated",
  DELETE: "deleted",
  LOGIN: "logged in",
  LOGOUT: "logged out",
};

export async function getActivityLogs(
  params?: ListParams & { actionType?: ActionType; entityType?: EntityType },
): Promise<Paginated<ActivityLogWithUser>> {
  await latency();
  const data = db();
  let rows = data.activityLogs;
  if (params?.actionType) rows = rows.filter((l) => l.actionType === params.actionType);
  if (params?.entityType) rows = rows.filter((l) => l.entityType === params.entityType);

  const enriched: ActivityLogWithUser[] = rows.map((log) => {
    const username = data.users.find((u) => u.userId === log.userId)?.username ?? "unknown";
    const target =
      log.entityType === "SYSTEM"
        ? ""
        : ` ${log.entityType.toLowerCase()}${log.entityId ? ` #${log.entityId}` : ""}`;
    return { ...log, username, summary: `${username} ${ACTION_VERBS[log.actionType]}${target}` };
  });

  return applyList(enriched, params, {
    search: (l) => l.summary,
    sorters: { createdAt: (l) => l.createdAt },
    defaultSort: "createdAt",
    defaultDir: "desc",
  });
}
