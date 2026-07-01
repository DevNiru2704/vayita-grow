import "server-only";
import { DEFAULT_PAGE_SIZE, type ListParams, type Paginated } from "@/lib/types/common";

interface ListOptions<T> {
  /** Text extracted per row for case-insensitive `query` matching. */
  search?: (row: T) => string;
  /** Sortable fields exposed to `?sort=`; values compared with < / >. */
  sorters?: Record<string, (row: T) => string | number>;
  defaultSort?: string;
  defaultDir?: "asc" | "desc";
}

/**
 * Shared filter → sort → paginate pipeline for list services.
 * MOCK IMPLEMENTATION - with Supabase this logic moves into SQL.
 */
export function applyList<T>(
  rows: T[],
  params: ListParams | undefined,
  options: ListOptions<T> = {},
): Paginated<T> {
  let result = rows;

  const query = params?.query?.trim().toLowerCase();
  if (query && options.search) {
    result = result.filter((row) => options.search!(row).toLowerCase().includes(query));
  }

  const sortKey = params?.sort ?? options.defaultSort;
  const sorter = sortKey ? options.sorters?.[sortKey] : undefined;
  if (sorter) {
    const dir = params?.dir ?? options.defaultDir ?? "asc";
    const factor = dir === "desc" ? -1 : 1;
    result = [...result].sort((a, b) => {
      const va = sorter(a);
      const vb = sorter(b);
      if (va < vb) return -1 * factor;
      if (va > vb) return 1 * factor;
      return 0;
    });
  }

  const pageSize = Math.max(1, params?.pageSize ?? DEFAULT_PAGE_SIZE);
  const total = result.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, params?.page ?? 1), pageCount);
  const items = result.slice((page - 1) * pageSize, page * pageSize);

  return { items, total, page, pageSize, pageCount };
}
