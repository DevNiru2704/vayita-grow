"use client";

import { useState, useTransition, type ReactNode } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { ActionResult } from "@/lib/types/common";

/**
 * Confirmation gate for destructive/irreversible actions. `action` is a
 * server action returning ActionResult; success/failure is announced via
 * toast and the dialog closes only on success.
 *
 * The trigger renders as a native <button> (Base UI requirement) - style it
 * via `triggerClassName` and pass the visible content as `trigger`.
 */
export function ConfirmDialog({
  trigger,
  triggerClassName,
  triggerAriaLabel,
  title,
  description,
  confirmLabel = "Confirm",
  successMessage,
  action,
}: {
  trigger: ReactNode;
  triggerClassName?: string;
  triggerAriaLabel?: string;
  title: string;
  description: string;
  confirmLabel?: string;
  successMessage: string;
  action: () => Promise<ActionResult<unknown>>;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        toast.success(successMessage);
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className={triggerClassName} aria-label={triggerAriaLabel}>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            onClick={handleConfirm}
          >
            {pending ? "Working…" : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
