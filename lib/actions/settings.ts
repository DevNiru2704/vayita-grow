"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth/guards";
import { isSupabase } from "@/lib/db/source";
import { recordActivity } from "@/lib/mock/activity";
import { db, latency } from "@/lib/mock/store";
import * as settingsPg from "@/lib/services/settings.pg";
import type { ActionResult } from "@/lib/types/common";

// Validation + auth run here; data access dispatches to mock or Postgres
// (lib/services/settings.pg.ts) based on DATA_SOURCE.

const settingSchema = z.object({
  settingKey: z.string().trim().min(1).max(100),
  settingValue: z.string().trim().min(1, "Value is required").max(500),
});

export async function updateSetting(
  settingKey: string,
  settingValue: string,
): Promise<ActionResult> {
  const session = await requireRole(["admin", "dev"]);
  const parsed = settingSchema.safeParse({ settingKey, settingValue });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  if (isSupabase) return settingsPg.updateSetting(parsed.data, session);
  await latency();

  const setting = db().systemSettings.find((s) => s.settingKey === parsed.data.settingKey);
  if (!setting) return { ok: false, error: "Setting not found." };

  setting.settingValue = parsed.data.settingValue;
  recordActivity(session.userId, "UPDATE", "SYSTEM", setting.settingId);
  revalidatePath("/dashboard/settings");
  return { ok: true, data: undefined };
}
