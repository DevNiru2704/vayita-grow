import { Download } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { SearchParamsRecord } from "@/lib/url";
import { cn } from "@/lib/utils";

/**
 * Links to the server-side .xlsx export route for a module, carrying the
 * current filters/search/sort (but not pagination) so the download matches the
 * on-screen view. A plain anchor so the browser handles the file download.
 */
export function ExportButton({
  entity,
  searchParams,
  label = "Export",
}: {
  entity: string;
  searchParams?: SearchParamsRecord;
  label?: string;
}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams ?? {})) {
    const first = Array.isArray(value) ? value[0] : value;
    if (first && key !== "page") params.set(key, first);
  }
  const qs = params.toString();

  return (
    <a
      href={`/dashboard/export/${entity}${qs ? `?${qs}` : ""}`}
      className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
    >
      <Download aria-hidden data-icon="inline-start" />
      {label}
    </a>
  );
}
