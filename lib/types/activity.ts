import type { ActionType, EntityType } from "./database";

/** Mirrors `activity_logs` (ERD v1.2.0). */

export interface ActivityLog {
  logId: number;
  userId: number;
  actionType: ActionType;
  entityType: EntityType;
  entityId: number | null;
  ipAddress: string | null;
  createdAt: string;
}

export interface ActivityLogWithUser extends ActivityLog {
  username: string;
  /** Short human-readable summary composed by the mock layer for display. */
  summary: string;
}
