import { isSupabase } from "@/lib/db/source";
import * as mock from "./field-reports.mock";
import * as pg from "./field-reports.pg";

/** Source-aware field-report reads. Mutations dispatch from lib/actions/field-reports.ts. */
export const getFieldReports = isSupabase ? pg.getFieldReports : mock.getFieldReports;
export const getFieldReportById = isSupabase ? pg.getFieldReportById : mock.getFieldReportById;
