import { isSupabase } from "@/lib/db/source";
import * as mock from "./dashboard.mock";
import * as pg from "./dashboard.pg";

export type { DashboardStat, MonthlyOrderPoint } from "./dashboard.mock";

/** Source-aware dashboard aggregates. */
export const getDashboardStats = isSupabase ? pg.getDashboardStats : mock.getDashboardStats;
export const getAvailableYears = isSupabase ? pg.getAvailableYears : mock.getAvailableYears;
export const getMonthlyOrderSeries = isSupabase ? pg.getMonthlyOrderSeries : mock.getMonthlyOrderSeries;
export const getRecentOrders = isSupabase ? pg.getRecentOrders : mock.getRecentOrders;
export const getLowStockItems = isSupabase ? pg.getLowStockItems : mock.getLowStockItems;

