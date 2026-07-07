import "server-only";
import { paginate } from "@/lib/db/list";
import { query } from "@/lib/db/query";
import type { ListParams, Paginated } from "@/lib/types/common";
import type { RoleName } from "@/lib/types/database";
import type { LoginHistoryEntry, UserWithRole } from "@/lib/types/user";

// Postgres reads for the users module. Account mutations (create / reset /
// recover / change-own) live in lib/actions/{users,account}.ts via the
// source-aware lib/auth/user-admin + user-passwords helpers.

const SELECT = `
  SELECT u.user_id, u.username, u.role_id, u.created_by, u.updated_by, u.created_at,
         r.role_name, cb.username AS created_by_username
  FROM users u
  JOIN roles r ON r.role_id = u.role_id
  LEFT JOIN users cb ON cb.user_id = u.created_by`;

export async function getUsers(
  params?: ListParams & { role?: RoleName },
): Promise<Paginated<UserWithRole>> {
  return paginate<UserWithRole>(
    {
      select: SELECT,
      where: params?.role ? ["r.role_name = $1"] : [],
      params: params?.role ? [params.role] : [],
      searchColumns: ["u.username", "r.role_name::text"],
      sorters: { username: "u.username", roleName: "r.role_name", createdAt: "u.created_at" },
      defaultSort: "createdAt",
    },
    params,
  );
}

export async function getLoginHistory(userId?: number): Promise<LoginHistoryEntry[]> {
  return query<LoginHistoryEntry>(
    `SELECT history_id, user_id, login_time, ip_address, device_info
     FROM login_history ${userId ? "WHERE user_id = $1" : ""}
     ORDER BY login_time DESC LIMIT 20`,
    userId ? [userId] : [],
  );
}
