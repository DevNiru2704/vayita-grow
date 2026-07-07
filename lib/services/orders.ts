import { isSupabase } from "@/lib/db/source";
import * as mock from "./orders.mock";
import * as pg from "./orders.pg";

/** Source-aware order reads. Mutations dispatch from lib/actions/orders.ts. */
export const getOrders = isSupabase ? pg.getOrders : mock.getOrders;
export const getOrderById = isSupabase ? pg.getOrderById : mock.getOrderById;
export const getOrderStats = isSupabase ? pg.getOrderStats : mock.getOrderStats;
