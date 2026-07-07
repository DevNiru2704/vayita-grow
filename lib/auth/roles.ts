import type { RoleName } from "@/lib/types/database";

/**
 * Single source of truth for role-gated access. Used by server actions
 * (`requireRole`) and nav visibility so route access and the sidebar never
 * drift apart.
 */

/** Full-access roles that manage accounts, settings, and can enable 2FA. */
export const ADMIN_ROLES: RoleName[] = ["admin", "dev"];

/** Roles for which two-factor authentication is offered. */
export const TWO_FA_ROLES: RoleName[] = ["admin", "dev"];
