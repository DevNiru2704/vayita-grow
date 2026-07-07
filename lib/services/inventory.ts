import { isSupabase } from "@/lib/db/source";
import * as mock from "./inventory.mock";
import * as pg from "./inventory.pg";

/** Source-aware inventory reads. Mutations dispatch from lib/actions/inventory.ts. */
export const getInventory = isSupabase ? pg.getInventory : mock.getInventory;
export const getInventoryLogs = isSupabase ? pg.getInventoryLogs : mock.getInventoryLogs;
export const getSuppliers = isSupabase ? pg.getSuppliers : mock.getSuppliers;
export const getLowStockThreshold = isSupabase ? pg.getLowStockThreshold : mock.getLowStockThreshold;
