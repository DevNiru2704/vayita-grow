import "server-only";
import { execute } from "@/lib/db/query";
import { isSupabase } from "@/lib/db/source";
import { recordActivity as recordActivityMock } from "@/lib/mock/activity";
import type { ActionType, EntityType } from "@/lib/types/database";

/**
 * Source-aware activity logger for cross-cutting events (login/logout, 2FA)
 * that don't belong to a single domain module. Domain mutations record their
 * own activity inline within their transaction.
 */
export async function recordActivity(
  userId: number,
  actionType: ActionType,
  entityType: EntityType,
  entityId: number | null = null,
): Promise<void> {
  if (isSupabase) {
    await execute(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, $2, $3, $4)",
      [userId, actionType, entityType, entityId],
    );
    return;
  }
  recordActivityMock(userId, actionType, entityType, entityId);
}
