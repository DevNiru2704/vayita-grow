import { isSupabase } from "@/lib/db/source";
import * as mock from "./customers.mock";
import * as pg from "./customers.pg";

/** Source-aware customer reads. Mutations dispatch from lib/actions/customers.ts. */
export const getCustomers = isSupabase ? pg.getCustomers : mock.getCustomers;
export const getCustomerById = isSupabase ? pg.getCustomerById : mock.getCustomerById;
export const getCustomerNotes = isSupabase ? pg.getCustomerNotes : mock.getCustomerNotes;
export const getCustomerOptions = isSupabase ? pg.getCustomerOptions : mock.getCustomerOptions;
