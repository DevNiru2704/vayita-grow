"use client";

import { Send } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { sendQuotationToStaff, updateQuotationStatus } from "@/lib/actions/quotations";
import { QUOTATION_STATUSES, type QuotationStatus } from "@/lib/types/database";
import { cn } from "@/lib/utils";

const selectClass =
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

export function QuotationStatusSelect({
  quotationId,
  status,
}: {
  quotationId: number;
  status: QuotationStatus;
}) {
  const [pending, startTransition] = useTransition();

  function onChange(next: QuotationStatus) {
    startTransition(async () => {
      const result = await updateQuotationStatus(quotationId, next);
      if (result.ok) toast.success(`Status set to ${next}`);
      else toast.error(result.error);
    });
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">Status</span>
      <select
        value={status}
        disabled={pending}
        onChange={(e) => onChange(e.target.value as QuotationStatus)}
        className={cn(selectClass, "h-9 w-40")}
        aria-label="Quotation status"
      >
        {QUOTATION_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SendToStaffDialog({
  quotationId,
  staff,
  assignedStaffId,
}: {
  quotationId: number;
  staff: { userId: number; username: string }[];
  assignedStaffId: number | null;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [staffId, setStaffId] = useState<number>(assignedStaffId ?? staff[0]?.userId ?? 0);

  function handleSend() {
    startTransition(async () => {
      const result = await sendQuotationToStaff(quotationId, staffId);
      if (result.ok) {
        toast.success("Quotation sent to staff");
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(buttonVariants({ size: "lg" }))}>
        <Send aria-hidden data-icon="inline-start" />
        Send to staff
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send quotation to staff</DialogTitle>
          <DialogDescription>
            Assign this quotation to a field staff member. It appears in their queue and the
            company inbox is notified by email.
          </DialogDescription>
        </DialogHeader>
        {staff.length === 0 ? (
          <p className="text-sm text-muted-foreground">No staff accounts available to assign.</p>
        ) : (
          <div className="space-y-4">
            <select
              value={staffId}
              onChange={(e) => setStaffId(Number(e.target.value))}
              className={selectClass}
              aria-label="Staff member"
            >
              {staff.map((s) => (
                <option key={s.userId} value={s.userId}>
                  {s.username}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" disabled={pending} onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="button" disabled={pending} onClick={handleSend}>
                {pending ? "Sending…" : "Send quotation"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
