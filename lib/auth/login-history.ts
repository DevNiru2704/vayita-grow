import "server-only";
import { execute } from "@/lib/db/query";
import { isSupabase } from "@/lib/db/source";
import { db, nextId, nowIso } from "@/lib/mock/store";

/** Records a successful login for the security audit trail (source-aware). */
export async function recordLogin(
  userId: number,
  ipAddress: string | null,
  deviceInfo: string | null,
): Promise<void> {
  if (isSupabase) {
    await execute(
      "INSERT INTO login_history (user_id, ip_address, device_info) VALUES ($1, $2, $3)",
      [userId, ipAddress, deviceInfo],
    );
    return;
  }
  const history = db().loginHistory;
  history.push({
    historyId: nextId(history, "historyId"),
    userId,
    loginTime: nowIso(),
    ipAddress,
    deviceInfo,
  });
}
