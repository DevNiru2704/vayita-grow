"use client";

import { ClipboardPlus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { createFieldReport } from "@/lib/actions/field-reports";
import { FIELD_REPORT_STATUSES, enumLabel, type FieldReportStatus } from "@/lib/types/database";
import { cn } from "@/lib/utils";

interface CustomerOption {
  customerId: number;
  fullName: string;
}

const selectClass =
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

export function ReportDialog({ customers }: { customers: CustomerOption[] }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [values, setValues] = useState({
    visitDate: new Date().toISOString().slice(0, 10),
    customerId: 0,
    dealerName: "",
    location: "",
    summary: "",
    status: "Completed" as FieldReportStatus,
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const linked = customers.find((c) => c.customerId === values.customerId);
      const result = await createFieldReport({
        visitDate: values.visitDate,
        customerId: values.customerId || null,
        dealerName: values.dealerName || linked?.fullName || "",
        location: values.location,
        summary: values.summary,
        status: values.status,
      });
      if (result.ok) {
        toast.success("Field report submitted");
        setOpen(false);
        setValues((v) => ({ ...v, dealerName: "", location: "", summary: "" }));
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
        <ClipboardPlus aria-hidden data-icon="inline-start" />
        New report
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New field report</DialogTitle>
          <DialogDescription>
            Record a dealer visit, demonstration, or farmer meeting.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="fr-date" label="Visit date" errors={fieldErrors.visitDate}>
              <Input
                {...fieldAria("fr-date", fieldErrors.visitDate)}
                type="date"
                value={values.visitDate}
                onChange={(e) => setValues((v) => ({ ...v, visitDate: e.target.value }))}
                required
              />
            </FormField>
            <FormField id="fr-status" label="Outcome" errors={fieldErrors.status}>
              <select
                {...fieldAria("fr-status", fieldErrors.status)}
                value={values.status}
                onChange={(e) =>
                  setValues((v) => ({ ...v, status: e.target.value as FieldReportStatus }))
                }
                className={selectClass}
              >
                {FIELD_REPORT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {enumLabel(status)}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
          <FormField
            id="fr-customer"
            label="Linked client"
            optional
            hint="Linking fills the dealer name automatically."
            errors={fieldErrors.customerId}
          >
            <select
              {...fieldAria("fr-customer", fieldErrors.customerId)}
              value={values.customerId}
              onChange={(e) => {
                const customerId = Number(e.target.value);
                const linked = customers.find((c) => c.customerId === customerId);
                setValues((v) => ({
                  ...v,
                  customerId,
                  dealerName: linked?.fullName ?? v.dealerName,
                }));
              }}
              className={selectClass}
            >
              <option value={0}>Not linked</option>
              {customers.map((customer) => (
                <option key={customer.customerId} value={customer.customerId}>
                  {customer.fullName}
                </option>
              ))}
            </select>
          </FormField>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="fr-dealer" label="Dealer / party name" errors={fieldErrors.dealerName}>
              <Input
                {...fieldAria("fr-dealer", fieldErrors.dealerName)}
                value={values.dealerName}
                onChange={(e) => setValues((v) => ({ ...v, dealerName: e.target.value }))}
                required
              />
            </FormField>
            <FormField id="fr-location" label="Location" errors={fieldErrors.location}>
              <Input
                {...fieldAria("fr-location", fieldErrors.location)}
                value={values.location}
                onChange={(e) => setValues((v) => ({ ...v, location: e.target.value }))}
                placeholder="Malda, West Bengal"
                required
              />
            </FormField>
          </div>
          <FormField id="fr-summary" label="Visit summary" errors={fieldErrors.summary}>
            <Textarea
              {...fieldAria("fr-summary", fieldErrors.summary)}
              value={values.summary}
              onChange={(e) => setValues((v) => ({ ...v, summary: e.target.value }))}
              rows={4}
              required
            />
          </FormField>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" disabled={pending} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Submitting…" : "Submit report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
