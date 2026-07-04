"use client";

import { Pencil, Plus } from "lucide-react";
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
import { createSupplier, updateSupplier } from "@/lib/actions/inventory";
import type { Supplier } from "@/lib/types/inventory";
import { cn } from "@/lib/utils";

export function SupplierDialog({ supplier }: { supplier?: Supplier }) {
  const isEdit = !!supplier;
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [values, setValues] = useState({
    companyName: supplier?.companyName ?? "",
    contactEmail: supplier?.contactEmail ?? "",
    phone: supplier?.phone ?? "",
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = isEdit
        ? await updateSupplier(supplier.supplierId, values)
        : await createSupplier(values);

      if (result.ok) {
        toast.success(isEdit ? "Supplier updated" : "Supplier added");
        setOpen(false);
        if (!isEdit) setValues({ companyName: "", contactEmail: "", phone: "" });
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
        className={cn(
          buttonVariants(isEdit ? { variant: "ghost", size: "icon-sm" } : { size: "lg" }),
        )}
        aria-label={isEdit ? `Edit ${supplier.companyName}` : undefined}
      >
        {isEdit ? (
          <Pencil aria-hidden className="size-3.5" />
        ) : (
          <>
            <Plus aria-hidden data-icon="inline-start" />
            New supplier
          </>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? `Edit ${supplier.companyName}` : "New supplier"}</DialogTitle>
          <DialogDescription>
            Raw material and packaging suppliers linked to inventory records.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormField id="sup-name" label="Company name" errors={fieldErrors.companyName}>
            <Input
              {...fieldAria("sup-name", fieldErrors.companyName)}
              value={values.companyName}
              onChange={(e) => setValues((v) => ({ ...v, companyName: e.target.value }))}
              required
            />
          </FormField>
          <FormField id="sup-email" label="Contact email" optional errors={fieldErrors.contactEmail}>
            <Input
              {...fieldAria("sup-email", fieldErrors.contactEmail)}
              type="email"
              value={values.contactEmail}
              onChange={(e) => setValues((v) => ({ ...v, contactEmail: e.target.value }))}
            />
          </FormField>
          <FormField id="sup-phone" label="Phone" optional errors={fieldErrors.phone}>
            <Input
              {...fieldAria("sup-phone", fieldErrors.phone)}
              type="tel"
              value={values.phone}
              onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
            />
          </FormField>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" disabled={pending} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : isEdit ? "Save changes" : "Add supplier"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
