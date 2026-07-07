import { isSupabase } from "@/lib/db/source";
import * as mock from "./products.mock";
import * as pg from "./products.pg";

/** Source-aware catalog reads. Mutations dispatch from lib/actions/{products,categories}.ts. */
export const getProducts = isSupabase ? pg.getProducts : mock.getProducts;
export const getPublicProducts = isSupabase ? pg.getPublicProducts : mock.getPublicProducts;
export const getProductBySlug = isSupabase ? pg.getProductBySlug : mock.getProductBySlug;
export const getProductById = isSupabase ? pg.getProductById : mock.getProductById;
export const getCategories = isSupabase ? pg.getCategories : mock.getCategories;
