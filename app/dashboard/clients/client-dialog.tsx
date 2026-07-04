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
import { createCustomer, updateCustomer } from "@/lib/actions/customers";
import { company } from "@/lib/config/company";
import { CUSTOMER_STATUSES, type CustomerStatus } from "@/lib/types/database";
import type { Customer, CustomerInput } from "@/lib/types/customer";
import { cn } from "@/lib/utils";

const selectClass =
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

export function ClientDialog({ customer }: { customer?: Customer }) {
  const isEdit = !!customer;
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [values, setValues] = useState<CustomerInput>({
    fullName: customer?.fullName ?? "",
    email: customer?.email ?? "",
    phone: customer?.phone ?? "",
    address: customer?.address ?? "",
    state: customer?.state ?? company.operatingStates[0],
    status: customer?.status ?? "New",
  });

  function update<K extends keyof CustomerInput>(key: K, value: CustomerInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = isEdit
        ? await updateCustomer(customer.customerId, values)
        : await createCustomer(values);

      if (result.ok) {
        toast.success(isEdit ? "Client updated" : "Client added");
        setOpen(false);
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
          buttonVariants(isEdit ? { variant: "outline", size: "sm" } : { size: "lg" }),
        )}
      >
        {isEdit ? (
          <>
            <Pencil aria-hidden data-icon="inline-start" />
            Edit
          </>
        ) : (
          <>
            <Plus aria-hidden data-icon="inline-start" />
            New client
          </>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? `Edit ${customer.fullName}` : "New client"}</DialogTitle>
          <DialogDescription>
            Dealer, distributor, retailer, or institutional buyer record.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormField id="cl-name" label="Business name" errors={fieldErrors.fullName}>
            <Input
              {...fieldAria("cl-name", fieldErrors.fullName)}
              value={values.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              required
            />
          </FormField>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="cl-phone" label="Phone" errors={fieldErrors.phone}>
              <Input
                {...fieldAria("cl-phone", fieldErrors.phone)}
                type="tel"
                value={values.phone}
                onChange={(e) => update("phone", e.target.value)}
                required
              />
            </FormField>
            <FormField id="cl-email" label="Email" optional errors={fieldErrors.email}>
              <Input
                {...fieldAria("cl-email", fieldErrors.email)}
                type="email"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </FormField>
          </div>
          <FormField id="cl-address" label="Address / locality" errors={fieldErrors.address}>
            <Input
              {...fieldAria("cl-address", fieldErrors.address)}
              value={values.address}
              onChange={(e) => update("address", e.target.value)}
              required
            />
          </FormField>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="cl-state" label="State" errors={fieldErrors.state}>
              <select
                {...fieldAria("cl-state", fieldErrors.state)}
                value={values.state}
                onChange={(e) => update("state", e.target.value)}
                className={selectClass}
              >
                {company.operatingStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField id="cl-status" label="Status" errors={fieldErrors.status}>
              <select
                {...fieldAria("cl-status", fieldErrors.status)}
                value={values.status}
                onChange={(e) => update("status", e.target.value as CustomerStatus)}
                className={selectClass}
              >
                {CUSTOMER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" disabled={pending} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : isEdit ? "Save changes" : "Add client"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
