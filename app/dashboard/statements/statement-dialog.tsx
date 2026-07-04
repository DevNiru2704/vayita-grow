"use client";

import { FilePlus2 } from "lucide-react";
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
import { createStatement } from "@/lib/actions/statements";
import { cn } from "@/lib/utils";

interface CustomerOption {
  customerId: number;
  fullName: string;
}

export function StatementDialog({ customers }: { customers: CustomerOption[] }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [customerId, setCustomerId] = useState<number>(customers[0]?.customerId ?? 0);
  const [periodLabel, setPeriodLabel] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await createStatement({ customerId, periodLabel });
      if (result.ok) {
        toast.success("Statement uploaded");
        setOpen(false);
        setPeriodLabel("");
        setFieldErrors({});
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(buttonVariants({ size: "lg" }))}>
        <FilePlus2 aria-hidden data-icon="inline-start" />
        Upload statement
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload statement</DialogTitle>
          <DialogDescription>
            Records a statement entry for a client. PDF file upload arrives with the backend
            phase (file storage per the database design).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormField id="stm-customer" label="Client" errors={fieldErrors.customerId}>
            <select
              {...fieldAria("stm-customer", fieldErrors.customerId)}
              value={customerId}
              onChange={(e) => setCustomerId(Number(e.target.value))}
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {customers.map((customer) => (
                <option key={customer.customerId} value={customer.customerId}>
                  {customer.fullName}
                </option>
              ))}
            </select>
          </FormField>
          <FormField
            id="stm-period"
            label="Statement period"
            hint='e.g. "Q1 FY26-27 (Apr-Jun 2026)" or "Jul 2026"'
            errors={fieldErrors.periodLabel}
          >
            <Input
              {...fieldAria("stm-period", fieldErrors.periodLabel)}
              value={periodLabel}
              onChange={(e) => setPeriodLabel(e.target.value)}
              required
            />
          </FormField>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" disabled={pending} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Uploading…" : "Upload statement"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
