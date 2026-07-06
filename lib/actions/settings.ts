"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth/guards";
import { recordActivity } from "@/lib/mock/activity";
import { db, latency } from "@/lib/mock/store";
import type { ActionResult } from "@/lib/types/common";

// MOCK IMPLEMENTATION - replace store mutations with Supabase queries.

const settingSchema = z.object({
  settingKey: z.string().trim().min(1).max(100),
  settingValue: z.string().trim().min(1, "Value is required").max(500),
});

export async function updateSetting(
  settingKey: string,
  settingValue: string,
): Promise<ActionResult> {
  const session = await requireRole(["admin", "dev"]);
  await latency();
  const parsed = settingSchema.safeParse({ settingKey, settingValue });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const setting = db().systemSettings.find((s) => s.settingKey === parsed.data.settingKey);
  if (!setting) return { ok: false, error: "Setting not found." };

  setting.settingValue = parsed.data.settingValue;
  recordActivity(session.userId, "UPDATE", "SYSTEM", setting.settingId);
  revalidatePath("/dashboard/settings");
  return { ok: true, data: undefined };
}
