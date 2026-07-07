import { isSupabase } from "@/lib/db/source";
import * as mock from "./feedback.mock";
import * as pg from "./feedback.pg";

/** Source-aware feedback reads. Mutations dispatch from lib/actions/feedback.ts. */
export const getFeedbackTickets = isSupabase ? pg.getFeedbackTickets : mock.getFeedbackTickets;
