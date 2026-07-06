"use client";

import { PackagePlus } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { FormField, fieldAria } from "@/components/shared/FormField";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { adjustStock } from "@/lib/actions/inventory";
import { cn } from "@/lib/utils";

export function AdjustStockDialog({
  inventoryId,
  productName,
  currentQuantity,
}: {
  inventoryId: number;
  productName: string;
  currentQuantity: number;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [changeAmount, setChangeAmount] = useState("");
  const [reason, setReason] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await adjustStock({
        inventoryId,
        changeAmount: Number(changeAmount),
        reason,
      });
      if (result.ok) {
        toast.success(`Stock updated for ${productName}`);
        setOpen(false);
        setChangeAmount("");
        setReason("");
        setFieldErrors({});
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        aria-label={`Adjust stock for ${productName}`}
      >
        <PackagePlus aria-hidden data-icon="inline-start" />
        Adjust
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust stock - {productName}</DialogTitle>
          <DialogDescription>
            Current stock: {currentQuantity} units. Use a positive number for intake and a
            negative number for outgoing or damaged stock.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormField
            id={`adj-amount-${inventoryId}`}
            label="Change amount"
            hint="e.g. 200 for intake, -50 for dispatch"
            errors={fieldErrors.changeAmount}
          >
            <Input
              {...fieldAria(`adj-amount-${inventoryId}`, fieldErrors.changeAmount)}
              type="number"
              step="1"
              value={changeAmount}
              onChange={(e) => setChangeAmount(e.target.value)}
              required
            />
          </FormField>
          <FormField id={`adj-reason-${inventoryId}`} label="Reason" errors={fieldErrors.reason}>
            <Input
              {...fieldAria(`adj-reason-${inventoryId}`, fieldErrors.reason)}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="New production batch, dispatch, damage…"
              required
            />
          </FormField>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" disabled={pending} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Apply adjustment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
