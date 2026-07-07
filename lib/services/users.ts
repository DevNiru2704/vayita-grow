import { isSupabase } from "@/lib/db/source";
import * as mock from "./users.mock";
import * as pg from "./users.pg";

/** Source-aware user reads. Mutations dispatch from lib/actions/users.ts. */
export const getUsers = isSupabase ? pg.getUsers : mock.getUsers;
export const getLoginHistory = isSupabase ? pg.getLoginHistory : mock.getLoginHistory;
