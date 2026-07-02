import Link from "next/link";
import { withParams, paramString, type SearchParamsRecord } from "@/lib/url";
import { cn } from "@/lib/utils";

/**
 * Link-driven filter pills bound to a single search param (URL as state).
 * Includes an "All" pill that clears the param.
 */
export function FilterPills({
  param,
  options,
  pathname,
  searchParams,
  allLabel = "All",
}: {
  param: string;
  options: { value: string; label: string }[];
  pathname: string;
  searchParams: SearchParamsRecord;
  allLabel?: string;
}) {
  const active = paramString(searchParams, param);

  const pillClass = (isActive: boolean) =>
    cn(
      "inline-flex h-8 items-center rounded-full border px-3.5 text-sm font-medium transition-colors",
      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
      isActive
        ? "border-transparent bg-primary text-primary-foreground"
        : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
    );

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filters">
      <Link
        href={withParams(pathname, searchParams, { [param]: undefined })}
        className={pillClass(!active)}
        aria-current={!active ? "true" : undefined}
      >
        {allLabel}
      </Link>
      {options.map((option) => {
        const isActive = active === option.value;
        return (
          <Link
            key={option.value}
            href={withParams(pathname, searchParams, { [param]: option.value })}
            className={pillClass(isActive)}
            aria-current={isActive ? "true" : undefined}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
