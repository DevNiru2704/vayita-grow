import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { cn } from "@/lib/utils";

/**
 * Single stat card implementation for the whole app (home facts, login
 * panel, dashboard overview) - variants via CVA, never reimplemented inline.
 */

const statCardVariants = cva("rounded-xl border bg-card p-5", {
  variants: {
    variant: {
      default: "",
      hero: "text-center",
    },
  },
  defaultVariants: { variant: "default" },
});

export function StatCard({
  label,
  value,
  suffix = "",
  hint,
  icon: Icon,
  animate = false,
  variant,
  className,
}: {
  label: string;
  value: number | string;
  /** Rendered after the number, e.g. "+" for open-ended counts. */
  suffix?: string;
  hint?: string;
  icon?: LucideIcon;
  /** Count-up on first view (falls back to static for reduced motion). */
  animate?: boolean;
  className?: string;
} & VariantProps<typeof statCardVariants>) {
  const valueNode =
    animate && typeof value === "number" ? (
      <AnimatedNumber value={value} suffix={suffix} />
    ) : (
      <>
        {value}
        {suffix}
      </>
    );

  if (variant === "hero") {
    return (
      <div className={cn(statCardVariants({ variant }), className)}>
        <p className="font-display text-3xl text-brand-600 sm:text-4xl">{valueNode}</p>
        <p className="mt-1 text-sm font-medium text-muted-foreground">{label}</p>
      </div>
    );
  }

  return (
    <div className={cn(statCardVariants({ variant }), className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="font-sans text-2xl font-semibold tracking-tight">{valueNode}</p>
          {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        {Icon ? (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
            <Icon aria-hidden className="size-5" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
