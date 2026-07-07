import { isSupabase } from "@/lib/db/source";
import * as mock from "./statements.mock";
import * as pg from "./statements.pg";

/** Source-aware statement reads. Mutations dispatch from lib/actions/statements.ts. */
export const getStatements = isSupabase ? pg.getStatements : mock.getStatements;
