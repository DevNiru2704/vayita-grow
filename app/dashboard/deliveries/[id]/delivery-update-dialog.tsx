"use client";

import { PlusCircle } from "lucide-react";
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
import { addDeliveryUpdate } from "@/lib/actions/deliveries";
import { DELIVERY_STATUSES, enumLabel, type DeliveryStatus } from "@/lib/types/database";
import { cn } from "@/lib/utils";

export function DeliveryUpdateDialog({ deliveryId }: { deliveryId: number }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [status, setStatus] = useState<DeliveryStatus>("In_Transit");
  const [location, setLocation] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await addDeliveryUpdate({ deliveryId, status, location });
      if (result.ok) {
        toast.success("Transit update added");
        setOpen(false);
        setLocation("");
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
        <PlusCircle aria-hidden data-icon="inline-start" />
        Add update
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add transit update</DialogTitle>
          <DialogDescription>
            Marking a delivery as Delivered also completes the linked order.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormField id="upd-status" label="Status" errors={fieldErrors.status}>
            <select
              {...fieldAria("upd-status", fieldErrors.status)}
              value={status}
              onChange={(e) => setStatus(e.target.value as DeliveryStatus)}
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {DELIVERY_STATUSES.map((option) => (
                <option key={option} value={option}>
                  {enumLabel(option)}
                </option>
              ))}
            </select>
          </FormField>
          <FormField id="upd-location" label="Location" errors={fieldErrors.location}>
            <Input
              {...fieldAria("upd-location", fieldErrors.location)}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Asansol Hub"
              required
            />
          </FormField>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" disabled={pending} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Add update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
