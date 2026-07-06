import "server-only";
import { db, latency } from "@/lib/mock/store";
import type { SystemSetting } from "@/lib/types/settings";

// MOCK IMPLEMENTATION - replace bodies with Supabase queries. Signatures are the contract.

export async function getSettings(): Promise<SystemSetting[]> {
  await latency();
  return [...db().systemSettings].sort((a, b) => a.settingKey.localeCompare(b.settingKey));
}

export async function getSettingNumber(key: string, fallback: number): Promise<number> {
  const setting = db().systemSettings.find((s) => s.settingKey === key);
  const parsed = setting ? Number(setting.settingValue) : NaN;
  return Number.isFinite(parsed) ? parsed : fallback;
}
