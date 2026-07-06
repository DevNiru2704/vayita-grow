/**
 * URL-as-state helpers for list pages (filters, sorting, pagination live in
 * search params so state is shareable and server-rendered).
 */

export type SearchParamsRecord = Record<string, string | string[] | undefined>;

/** First value of a possibly-repeated search param. */
export function paramString(params: SearchParamsRecord, key: string): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export function paramNumber(params: SearchParamsRecord, key: string): number | undefined {
  const raw = paramString(params, key);
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

/**
 * Builds an href from the current params plus overrides. `undefined`/empty
 * override values remove the key. Changing any non-`page` key resets `page`.
 */
export function withParams(
  pathname: string,
  current: SearchParamsRecord,
  overrides: Record<string, string | number | undefined>,
): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(current)) {
    const first = Array.isArray(value) ? value[0] : value;
    if (first) query.set(key, first);
  }
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined || value === "") {
      query.delete(key);
    } else {
      query.set(key, String(value));
    }
    if (key !== "page") query.delete("page");
  }
  // Re-apply an explicit page override (deleted above when other keys changed).
  if (overrides.page !== undefined && overrides.page !== "") {
    query.set("page", String(overrides.page));
  }
  const qs = query.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
