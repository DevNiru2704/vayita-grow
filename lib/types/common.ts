/** Shared shapes used by every service (reads) and action (mutations). */

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export interface ListParams {
  query?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  dir?: "asc" | "desc";
}

export const DEFAULT_PAGE_SIZE = 10;
