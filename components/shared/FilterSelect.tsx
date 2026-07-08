"use client";

import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Compact, URL-driven dropdown filter — the space-efficient replacement for
 * long rows of filter pills. Reads/writes its own search param and resets
 * pagination on change. Scales cleanly from 2 options to many (e.g. product
 * categories), unlike wrapping pills.
 */
export function FilterSelect({
  param,
  label,
  options,
  allLabel = "All",
}: {
  param: string;
  label: string;
  options: { value: string; label: string }[];
  allLabel?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get(param) ?? "";
  const active = current !== "";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(param, value);
    else params.delete(param);
    params.delete("page"); // any filter change resets pagination
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="relative">
        <select
          value={current}
          aria-label={label}
          onChange={(e) => handleChange(e.target.value)}
          className={cn(
            "h-8 cursor-pointer appearance-none rounded-full border pr-8 pl-3.5 text-sm font-medium transition-colors",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
            active
              ? "border-transparent bg-primary text-primary-foreground"
              : "border-border bg-background text-foreground hover:bg-muted",
          )}
        >
          <option value="">{allLabel}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2",
            active ? "text-primary-foreground" : "text-muted-foreground",
          )}
        />
      </div>
    </div>
  );
}
