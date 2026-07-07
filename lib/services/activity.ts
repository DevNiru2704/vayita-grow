import { isSupabase } from "@/lib/db/source";
import * as mock from "./activity.mock";
import * as pg from "./activity.pg";

/** Source-aware activity-log reads. Writes happen via lib/audit or inline SQL. */
export const getActivityLogs = isSupabase ? pg.getActivityLogs : mock.getActivityLogs;
