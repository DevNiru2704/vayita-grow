import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { withParams, paramString, type SearchParamsRecord } from "@/lib/url";

/**
 * Column header link that toggles `?sort=<field>&dir=` in the URL.
 * Server-rendered; the page re-fetches through its service.
 */
export function SortableHeader({
  field,
  pathname,
  searchParams,
  children,
}: {
  field: string;
  pathname: string;
  searchParams: SearchParamsRecord;
  children: ReactNode;
}) {
  const activeSort = paramString(searchParams, "sort");
  const activeDir = paramString(searchParams, "dir") === "desc" ? "desc" : "asc";
  const isActive = activeSort === field;
  const nextDir = isActive && activeDir === "asc" ? "desc" : "asc";

  const Icon = isActive ? (activeDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;

  return (
    <Link
      href={withParams(pathname, searchParams, { sort: field, dir: nextDir })}
      className="inline-flex items-center gap-1 rounded-sm font-medium hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      aria-label={`Sort by ${typeof children === "string" ? children : field}, ${nextDir}ending`}
    >
      {children}
      <Icon aria-hidden className="size-3.5" />
    </Link>
  );
}
