import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { enumLabel } from "@/lib/types/database";

/**
 * Single source of truth for status → color mapping across every module
 * (orders, payments, deliveries, feedback, clients, field reports).
 */

const statusBadgeVariants = cva(
  "inline-flex h-5 w-fit shrink-0 items-center gap-1.5 rounded-full px-2 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      tone: {
        success: "bg-status-success-soft text-status-success",
        warning: "bg-status-warning-soft text-status-warning",
        danger: "bg-status-danger-soft text-status-danger",
        info: "bg-status-info-soft text-status-info",
        neutral: "bg-status-neutral-soft text-status-neutral",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

type Tone = NonNullable<VariantProps<typeof statusBadgeVariants>["tone"]>;

const TONE_BY_STATUS: Record<string, Tone> = {
  // success
  Delivered: "success",
  Completed: "success",
  Active: "success",
  Resolved: "success",
  Accepted: "success",
  // warning
  Pending: "warning",
  Follow_Up_Required: "warning",
  Open: "warning",
  Expired: "warning",
  // danger
  Cancelled: "danger",
  Failed: "danger",
  Returned: "danger",
  Refunded: "danger",
  Inactive: "danger",
  Rejected: "danger",
  // info
  Processing: "info",
  Shipped: "info",
  Dispatching: "info",
  In_Transit: "info",
  In_Progress: "info",
  New: "info",
  Sent: "info",
  // neutral
  Closed: "neutral",
  Draft: "neutral",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = TONE_BY_STATUS[status] ?? "neutral";
  return (
    <span className={cn(statusBadgeVariants({ tone }), className)}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {enumLabel(status)}
    </span>
  );
}
