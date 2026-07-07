import { DEFAULT_PAGE_SIZE, type ListParams, type Paginated } from "@/lib/types/common";
import { query } from "./query";

/**
 * SQL counterpart of lib/services/helpers.ts#applyList: turns a base SELECT +
 * ListParams into a filtered/sorted/paginated result plus a total count. The
 * mock layer filters in JS; here the same logic runs in Postgres.
 *
 * `sort.map` whitelists sortable keys → SQL expressions, so `?sort=` can never
 * inject SQL. `search.columns` are ILIKE-matched against `?query=`.
 */
export interface PgListConfig {
  /** Complete "SELECT … FROM … [JOIN …]" with no WHERE/ORDER/LIMIT. */
  select: string;
  /** Pre-applied filter predicates (e.g. "o.status = $1"). */
  where?: string[];
  /** Positional params backing `where` predicates. */
  params?: unknown[];
  /** Columns/expressions ILIKE-matched against the search term. */
  searchColumns?: string[];
  /** sortKey → SQL expression whitelist. */
  sorters: Record<string, string>;
  defaultSort: string;
  defaultDir?: "asc" | "desc";
}

export async function paginate<T>(
  config: PgListConfig,
  params: ListParams | undefined,
): Promise<Paginated<T>> {
  const conditions = [...(config.where ?? [])];
  const values: unknown[] = [...(config.params ?? [])];

  const term = params?.query?.trim();
  if (term && config.searchColumns?.length) {
    values.push(`%${term}%`);
    const idx = values.length;
    conditions.push(
      `(${config.searchColumns.map((c) => `${c} ILIKE $${idx}`).join(" OR ")})`,
    );
  }

  const whereSql = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const sortKey = params?.sort && config.sorters[params.sort] ? params.sort : config.defaultSort;
  const sortExpr = config.sorters[sortKey];
  const dir = (params?.dir ?? config.defaultDir ?? "asc") === "desc" ? "DESC" : "ASC";

  const pageSize = Math.max(1, params?.pageSize ?? DEFAULT_PAGE_SIZE);

  const countRows = await query<{ count: number }>(
    `SELECT COUNT(*)::int AS count FROM (${config.select} ${whereSql}) sub`,
    values,
  );
  const total = countRows[0]?.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, params?.page ?? 1), pageCount);

  const limitIdx = values.length + 1;
  const offsetIdx = values.length + 2;
  const items = await query<T>(
    `${config.select} ${whereSql} ORDER BY ${sortExpr} ${dir} LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    [...values, pageSize, (page - 1) * pageSize],
  );

  return { items, total, page, pageSize, pageCount };
}
