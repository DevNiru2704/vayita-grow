import "server-only";
import { ROLE_BY_ID } from "@/lib/mock/seed/users";
import { db, latency } from "@/lib/mock/store";
import type { ListParams, Paginated } from "@/lib/types/common";
import type { RoleName } from "@/lib/types/database";
import type { LoginHistoryEntry, UserWithRole } from "@/lib/types/user";
import { applyList } from "./helpers";

// MOCK IMPLEMENTATION - replace bodies with Supabase queries. Signatures are the contract.

function toWithRole(user: (ReturnType<typeof db>["users"])[number]): UserWithRole {
  const data = db();
  return {
    ...user,
    roleName: ROLE_BY_ID[user.roleId] ?? "staff",
    createdByUsername: user.createdBy
      ? (data.users.find((u) => u.userId === user.createdBy)?.username ?? null)
      : null,
  };
}

export async function getUsers(
  params?: ListParams & { role?: RoleName },
): Promise<Paginated<UserWithRole>> {
  await latency();
  let rows = db().users.map(toWithRole);
  if (params?.role) rows = rows.filter((u) => u.roleName === params.role);

  return applyList(rows, params, {
    search: (u) => `${u.username} ${u.roleName}`,
    sorters: {
      username: (u) => u.username,
      roleName: (u) => u.roleName,
      createdAt: (u) => u.createdAt,
    },
    defaultSort: "createdAt",
  });
}

export async function getLoginHistory(userId?: number): Promise<LoginHistoryEntry[]> {
  await latency();
  let rows = db().loginHistory;
  if (userId) rows = rows.filter((h) => h.userId === userId);
  return [...rows].sort((a, b) => b.loginTime.localeCompare(a.loginTime)).slice(0, 20);
}
