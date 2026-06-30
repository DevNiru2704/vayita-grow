import "server-only";
import type { ActionType, EntityType } from "@/lib/types/database";
import { db, nextId, nowIso } from "./store";

/**
 * Writes a synthetic activity_logs row for demo-session mutations so the
 * Activity Log page reflects what the demo user actually did.
 */
export function recordActivity(
  userId: number,
  actionType: ActionType,
  entityType: EntityType,
  entityId: number | null = null,
): void {
  const logs = db().activityLogs;
  logs.push({
    logId: nextId(logs, "logId"),
    userId,
    actionType,
    entityType,
    entityId,
    ipAddress: null,
    createdAt: nowIso(),
  });
}
