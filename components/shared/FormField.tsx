import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Label + control + accessible error wiring. The control must set
 * `id={id}` and `aria-describedby={fieldErrorId(id)}` when `errors` exist -
 * use `fieldAria(id, errors)` to spread both.
 */

export function fieldErrorId(id: string): string {
  return `${id}-error`;
}

export function fieldAria(
  id: string,
  errors?: string[],
): { id: string; "aria-invalid": boolean | undefined; "aria-describedby": string | undefined } {
  const hasError = !!errors?.length;
  return {
    id,
    "aria-invalid": hasError || undefined,
    "aria-describedby": hasError ? fieldErrorId(id) : undefined,
  };
}

export function FormField({
  id,
  label,
  errors,
  hint,
  optional,
  className,
  children,
}: {
  id: string;
  label: string;
  errors?: string[];
  hint?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {optional ? (
          <span className="font-normal text-muted-foreground">(optional)</span>
        ) : null}
      </Label>
      {children}
      {hint && !errors?.length ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
      {errors?.length ? (
        <p id={fieldErrorId(id)} className="text-xs font-medium text-status-danger">
          {errors[0]}
        </p>
      ) : null}
    </div>
  );
}
