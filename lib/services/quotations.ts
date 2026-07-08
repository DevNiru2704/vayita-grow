import { isSupabase } from "@/lib/db/source";
import * as mock from "./quotations.mock";
import * as pg from "./quotations.pg";

/** Source-aware quotation reads. Mutations dispatch from lib/actions/quotations.ts. */
export const getQuotations = isSupabase ? pg.getQuotations : mock.getQuotations;
export const getQuotationById = isSupabase ? pg.getQuotationById : mock.getQuotationById;
