import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { withParams, type SearchParamsRecord } from "@/lib/url";
import { cn } from "@/lib/utils";
import type { Paginated } from "@/lib/types/common";

/** Link-based pagination bound to `?page=`; hidden when a single page. */
export function DataTablePagination({
  page,
  pathname,
  searchParams,
  itemNoun = "records",
}: {
  page: Pick<Paginated<unknown>, "page" | "pageCount" | "total">;
  pathname: string;
  searchParams: SearchParamsRecord;
  itemNoun?: string;
}) {
  if (page.pageCount <= 1) {
    return (
      <p className="text-sm text-muted-foreground">
        {page.total} {itemNoun}
      </p>
    );
  }

  const prevDisabled = page.page <= 1;
  const nextDisabled = page.page >= page.pageCount;
  const linkClass = buttonVariants({ variant: "outline", size: "sm" });
  const disabledClass = "pointer-events-none opacity-50";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        Page {page.page} of {page.pageCount} · {page.total} {itemNoun}
      </p>
      <div className="flex items-center gap-2">
        <Link
          href={withParams(pathname, searchParams, { page: page.page - 1 })}
          aria-disabled={prevDisabled}
          tabIndex={prevDisabled ? -1 : undefined}
          className={cn(linkClass, prevDisabled && disabledClass)}
        >
          <ChevronLeft aria-hidden data-icon="inline-start" />
          Previous
        </Link>
        <Link
          href={withParams(pathname, searchParams, { page: page.page + 1 })}
          aria-disabled={nextDisabled}
          tabIndex={nextDisabled ? -1 : undefined}
          className={cn(linkClass, nextDisabled && disabledClass)}
        >
          Next
          <ChevronRight aria-hidden data-icon="inline-end" />
        </Link>
      </div>
    </nav>
  );
}
