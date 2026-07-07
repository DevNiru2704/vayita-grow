import { isSupabase } from "@/lib/db/source";
import * as mock from "./deliveries.mock";
import * as pg from "./deliveries.pg";

/** Source-aware delivery reads. Mutations dispatch from lib/actions/deliveries.ts. */
export const getDeliveries = isSupabase ? pg.getDeliveries : mock.getDeliveries;
export const getDeliveryById = isSupabase ? pg.getDeliveryById : mock.getDeliveryById;
export const getDeliveryByOrderId = isSupabase ? pg.getDeliveryByOrderId : mock.getDeliveryByOrderId;
