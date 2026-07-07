import "server-only";
import { revalidatePath } from "next/cache";
import { query, queryOne, withActor } from "@/lib/db/query";
import type { ActionResult } from "@/lib/types/common";
import type { SystemSetting } from "@/lib/types/settings";
import type { SessionUser } from "@/lib/types/user";

// Postgres implementation of the settings read/write contract.

export async function getSettings(): Promise<SystemSetting[]> {
  return query<SystemSetting>(
    "SELECT setting_id, setting_key, setting_value FROM system_settings ORDER BY setting_key ASC",
  );
}

export async function getSettingNumber(key: string, fallback: number): Promise<number> {
  const row = await queryOne<{ settingValue: string }>(
    "SELECT setting_value FROM system_settings WHERE setting_key = $1",
    [key],
  );
  const parsed = row ? Number(row.settingValue) : NaN;
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function updateSetting(
  data: { settingKey: string; settingValue: string },
  session: SessionUser,
): Promise<ActionResult> {
  const setting = await queryOne<{ settingId: number }>(
    "SELECT setting_id FROM system_settings WHERE setting_key = $1",
    [data.settingKey],
  );
  if (!setting) return { ok: false, error: "Setting not found." };

  await withActor(session.userId, async (c) => {
    await c.query("UPDATE system_settings SET setting_value = $1 WHERE setting_key = $2", [
      data.settingValue,
      data.settingKey,
    ]);
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'UPDATE', 'SYSTEM', $2)",
      [session.userId, setting.settingId],
    );
  });

  revalidatePath("/dashboard/settings");
  return { ok: true, data: undefined };
}
