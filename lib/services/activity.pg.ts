import "server-only";
import { paginate } from "@/lib/db/list";
import type { ActivityLogWithUser } from "@/lib/types/activity";
import type { ListParams, Paginated } from "@/lib/types/common";
import type { ActionType, EntityType } from "@/lib/types/database";

// Human-readable summary composed in SQL to mirror the mock layer's output.
const SUMMARY = `
  u.username || ' ' ||
  CASE a.action_type
    WHEN 'CREATE' THEN 'created' WHEN 'UPDATE' THEN 'updated'
    WHEN 'DELETE' THEN 'deleted' WHEN 'LOGIN' THEN 'logged in'
    WHEN 'LOGOUT' THEN 'logged out'
  END ||
  CASE WHEN a.entity_type = 'SYSTEM' THEN ''
       ELSE ' ' || lower(a.entity_type::text) ||
            CASE WHEN a.entity_id IS NOT NULL THEN ' #' || a.entity_id ELSE '' END
  END`;

const SELECT = `
  SELECT a.log_id, a.user_id, a.action_type, a.entity_type, a.entity_id,
         a.ip_address, a.created_at, u.username, ${SUMMARY} AS summary
  FROM activity_logs a
  JOIN users u ON u.user_id = a.user_id`;

export async function getActivityLogs(
  params?: ListParams & { actionType?: ActionType; entityType?: EntityType },
): Promise<Paginated<ActivityLogWithUser>> {
  const where: string[] = [];
  const values: unknown[] = [];
  if (params?.actionType) {
    values.push(params.actionType);
    where.push(`a.action_type = $${values.length}`);
  }
  if (params?.entityType) {
    values.push(params.entityType);
    where.push(`a.entity_type = $${values.length}`);
  }

  return paginate<ActivityLogWithUser>(
    {
      select: SELECT,
      where,
      params: values,
      searchColumns: ["u.username", "a.action_type::text", "a.entity_type::text"],
      sorters: { createdAt: "a.created_at" },
      defaultSort: "createdAt",
      defaultDir: "desc",
    },
    params,
  );
}
