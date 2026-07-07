import { isSupabase } from "@/lib/db/source";
import * as mock from "./settings.mock";
import * as pg from "./settings.pg";

/** Source-aware settings reads. Mutations dispatch from lib/actions/settings.ts. */
export const getSettings = isSupabase ? pg.getSettings : mock.getSettings;
export const getSettingNumber = isSupabase ? pg.getSettingNumber : mock.getSettingNumber;
