import type { LoginHistoryEntry, User } from "@/lib/types/user";
import type { RoleName } from "@/lib/types/database";

/**
 * DEMO operational data - staff accounts for the internal portal.
 * Role model per the client call: admin (Manish) manages all accounts and
 * passwords; staff are field staff with no self-service.
 */

export const ROLE_BY_ID: Record<number, RoleName> = {
  1: "dev",
  2: "admin",
  3: "staff",
};

export const ROLE_ID_BY_NAME: Record<RoleName, number> = {
  dev: 1,
  admin: 2,
  staff: 3,
};

export const seedUsers: User[] = [
  { userId: 1, username: "nirmalya", roleId: 1, createdBy: null, updatedBy: null, createdAt: "2025-11-01T09:00:00.000Z" },
  { userId: 2, username: "manish", roleId: 2, createdBy: 1, updatedBy: null, createdAt: "2025-11-05T09:00:00.000Z" },
  { userId: 3, username: "sourav.field", roleId: 3, createdBy: 2, updatedBy: null, createdAt: "2026-01-10T09:00:00.000Z" },
  { userId: 4, username: "prakash.field", roleId: 3, createdBy: 2, updatedBy: null, createdAt: "2026-02-02T09:00:00.000Z" },
];

export interface DemoCredential {
  userId: number;
  password: string;
}

/**
 * DEMO AUTHENTICATION ONLY - plaintext passwords for the investor demo.
 * The real system uses Argon2 hashes + optional 2FA per the DB design.
 * Kept in a separate table so user rows can never leak a password to the UI.
 */
export const seedCredentials: DemoCredential[] = [
  { userId: 1, password: "dev@vayita2026" },
  { userId: 2, password: "admin@vayita2026" },
  { userId: 3, password: "field@vayita2026" },
  { userId: 4, password: "field@vayita2026" },
];

export const seedLoginHistory: LoginHistoryEntry[] = [
  { historyId: 1, userId: 2, loginTime: "2026-06-28T04:12:00.000Z", ipAddress: "103.87.24.11", deviceInfo: "Chrome 137 / Windows" },
  { historyId: 2, userId: 3, loginTime: "2026-06-29T06:40:00.000Z", ipAddress: "45.118.62.30", deviceInfo: "Chrome 137 / Android" },
  { historyId: 3, userId: 2, loginTime: "2026-07-01T03:55:00.000Z", ipAddress: "103.87.24.11", deviceInfo: "Chrome 137 / Windows" },
  { historyId: 4, userId: 4, loginTime: "2026-07-02T08:20:00.000Z", ipAddress: "45.118.70.92", deviceInfo: "Chrome 136 / Android" },
];
