"use client";

import { FileText, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { FormField, fieldAria } from "@/components/shared/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createQuotation } from "@/lib/actions/quotations";
import { formatINR } from "@/lib/format";

interface CustomerOption {
  customerId: number;
  fullName: string;
}
interface ProductOption {
  productId: number;
  name: string;
  sku: string;
  basePrice: number;
}
interface Line {
  productId: number;
  quantity: number;
}

const selectClass =
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

export function QuotationForm({
  customers,
  products,
}: {
  customers: CustomerOption[];
  products: ProductOption[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [customerId, setCustomerId] = useState<number>(customers[0]?.customerId ?? 0);
  const [validUntil, setValidUntil] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<Line[]>([
    { productId: products[0]?.productId ?? 0, quantity: 10 },
  ]);

  const priceOf = (productId: number) =>
    products.find((p) => p.productId === productId)?.basePrice ?? 0;
  const total = lines.reduce((sum, line) => sum + priceOf(line.productId) * line.quantity, 0);

  function updateLine(index: number, patch: Partial<Line>) {
    setLines((prev) => prev.map((line, i) => (i === index ? { ...line, ...patch } : line)));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await createQuotation({
        customerId,
        validUntil: validUntil || null,
        notes: notes.trim() || null,
        items: lines,
      });
      if (result.ok) {
        toast.success("Quotation created");
        router.push(`/dashboard/quotations/${result.data.id}`);
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-3xl space-y-6">
      <div className="grid gap-5 rounded-xl border bg-card p-5 sm:grid-cols-2">
        <FormField id="q-customer" label="Client" errors={fieldErrors.customerId}>
          <select
            {...fieldAria("q-customer", fieldErrors.customerId)}
            value={customerId}
            onChange={(e) => setCustomerId(Number(e.target.value))}
            className={selectClass}
          >
            {customers.map((customer) => (
              <option key={customer.customerId} value={customer.customerId}>
                {customer.fullName}
              </option>
            ))}
          </select>
        </FormField>
        <FormField id="q-valid" label="Valid until" optional errors={fieldErrors.validUntil}>
          <Input
            {...fieldAria("q-valid", fieldErrors.validUntil)}
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
          />
        </FormField>
        <div className="sm:col-span-2">
          <FormField id="q-notes" label="Notes" optional errors={fieldErrors.notes}>
            <Textarea
              {...fieldAria("q-notes", fieldErrors.notes)}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </FormField>
        </div>
      </div>

      <fieldset className="rounded-xl border bg-card p-5">
        <legend className="sr-only">Quotation items</legend>
        <div className="mb-4 flex items-center justify-between">
          <p className="font-sans text-sm font-semibold">Items</p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              setLines((prev) => [...prev, { productId: products[0]?.productId ?? 0, quantity: 10 }])
            }
          >
            <Plus aria-hidden data-icon="inline-start" />
            Add item
          </Button>
        </div>

        {fieldErrors.items?.length ? (
          <p className="mb-3 text-xs font-medium text-status-danger">{fieldErrors.items[0]}</p>
        ) : null}

        <ul className="space-y-3">
          {lines.map((line, index) => {
            const lineTotal = priceOf(line.productId) * line.quantity;
            return (
              <li
                key={index}
                className="grid items-end gap-3 rounded-lg border bg-muted/40 p-3 sm:grid-cols-[1fr_7rem_7rem_auto]"
              >
                <div className="space-y-1.5">
                  <Label htmlFor={`q-line-product-${index}`}>Product</Label>
                  <select
                    id={`q-line-product-${index}`}
                    aria-label={`Product for item ${index + 1}`}
                    value={line.productId}
                    onChange={(e) => updateLine(index, { productId: Number(e.target.value) })}
                    className={selectClass}
                  >
                    {products.map((product) => (
                      <option key={product.productId} value={product.productId}>
                        {product.name} · {formatINR(product.basePrice)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`q-line-qty-${index}`}>Quantity</Label>
                  <Input
                    id={`q-line-qty-${index}`}
                    type="number"
                    min={1}
                    max={10000}
                    value={line.quantity}
                    onChange={(e) =>
                      updateLine(index, { quantity: Math.max(1, Number(e.target.value) || 1) })
                    }
                  />
                </div>
                <p className="pb-2 text-sm font-medium tabular-nums">{formatINR(lineTotal)}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="mb-1 text-status-danger"
                  aria-label={`Remove item ${index + 1}`}
                  disabled={lines.length === 1}
                  onClick={() => setLines((prev) => prev.filter((_, i) => i !== index))}
                >
                  <Trash2 aria-hidden className="size-3.5" />
                </Button>
              </li>
            );
          })}
        </ul>

        <p className="mt-5 flex items-center justify-between border-t pt-4 text-sm">
          <span className="text-muted-foreground">Unit prices are locked at creation.</span>
          <span className="text-base font-semibold tabular-nums">{formatINR(total)}</span>
        </p>
      </fieldset>

      <div className="flex gap-3">
        <Button type="submit" size="lg" className="h-10" disabled={pending || customers.length === 0}>
          <FileText aria-hidden data-icon="inline-start" />
          {pending ? "Creating…" : "Create quotation"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-10"
          disabled={pending}
          onClick={() => router.push("/dashboard/quotations")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
