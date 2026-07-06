import type { RoleName } from "./database";

/** Mirrors `roles`, `users`, `login_history` (ERD v1.2.0). */

export interface User {
  userId: number;
  username: string;
  roleId: number;
  createdBy: number | null;
  updatedBy: number | null;
  createdAt: string;
}

export interface UserWithRole extends User {
  roleName: RoleName;
  createdByUsername: string | null;
}

export interface LoginHistoryEntry {
  historyId: number;
  userId: number;
  loginTime: string;
  ipAddress: string | null;
  deviceInfo: string | null;
}

/** Minimal identity carried in the demo session cookie. */
export interface SessionUser {
  userId: number;
  username: string;
  role: RoleName;
}

export interface CreateStaffInput {
  username: string;
  role: Exclude<RoleName, "dev">;
}
