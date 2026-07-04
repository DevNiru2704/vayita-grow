"use client";

import { CreditCard, Truck } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { recordPayment, updateOrderStatus } from "@/lib/actions/orders";
import { createDelivery } from "@/lib/actions/deliveries";
import { formatINR } from "@/lib/format";
import { enumLabel, ORDER_STATUSES, PAYMENT_METHODS, type OrderStatus, type PaymentMethod } from "@/lib/types/database";
import { cn } from "@/lib/utils";

const selectClass =
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

/** Inline status control on the order detail page. */
export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: number;
  status: OrderStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={`order-status-${orderId}`} className="text-muted-foreground">
        Status
      </Label>
      <select
        id={`order-status-${orderId}`}
        aria-label="Order status"
        value={status}
        disabled={pending}
        onChange={(event) => {
          const next = event.target.value as OrderStatus;
          startTransition(async () => {
            const result = await updateOrderStatus(orderId, next);
            if (result.ok) {
              toast.success(`Order marked ${enumLabel(next)}`);
            } else {
              toast.error(result.error);
            }
          });
        }}
        className={cn(selectClass, "w-40")}
      >
        {ORDER_STATUSES.map((option) => (
          <option key={option} value={option}>
            {enumLabel(option)}
          </option>
        ))}
      </select>
    </div>
  );
}

export function RecordPaymentDialog({
  orderId,
  outstanding,
}: {
  orderId: number;
  outstanding: number;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [amount, setAmount] = useState(String(outstanding));
  const [method, setMethod] = useState<PaymentMethod>("Bank_Transfer");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await recordPayment({
        orderId,
        amount: Number(amount),
        paymentMethod: method,
      });
      if (result.ok) {
        toast.success("Payment recorded");
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
        className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
        disabled={outstanding <= 0}
      >
        <CreditCard aria-hidden data-icon="inline-start" />
        Record payment
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record payment - order #{orderId}</DialogTitle>
          <DialogDescription>Outstanding balance: {formatINR(outstanding)}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormField id="pay-amount" label="Amount (₹)" errors={fieldErrors.amount}>
            <Input
              {...fieldAria("pay-amount", fieldErrors.amount)}
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </FormField>
          <FormField id="pay-method" label="Payment method" errors={fieldErrors.paymentMethod}>
            <select
              {...fieldAria("pay-method", fieldErrors.paymentMethod)}
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              className={selectClass}
            >
              {PAYMENT_METHODS.map((option) => (
                <option key={option} value={option}>
                  {enumLabel(option)}
                </option>
              ))}
            </select>
          </FormField>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" disabled={pending} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Record payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CreateDeliveryDialog({ orderId }: { orderId: number }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [courierName, setCourierName] = useState("");
  const [trackingNum, setTrackingNum] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await createDelivery({ orderId, courierName, trackingNum });
      if (result.ok) {
        toast.success("Delivery created - order marked Shipped");
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
      <DialogTrigger className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}>
        <Truck aria-hidden data-icon="inline-start" />
        Create delivery
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create delivery - order #{orderId}</DialogTitle>
          <DialogDescription>
            Dispatching a delivery moves the order to Shipped.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormField id="del-courier" label="Courier" errors={fieldErrors.courierName}>
            <Input
              {...fieldAria("del-courier", fieldErrors.courierName)}
              value={courierName}
              onChange={(e) => setCourierName(e.target.value)}
              placeholder="Eastern Roadways"
              required
            />
          </FormField>
          <FormField id="del-tracking" label="Tracking number" errors={fieldErrors.trackingNum}>
            <Input
              {...fieldAria("del-tracking", fieldErrors.trackingNum)}
              value={trackingNum}
              onChange={(e) => setTrackingNum(e.target.value)}
              required
            />
          </FormField>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" disabled={pending} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating…" : "Create delivery"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
