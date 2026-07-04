import { ArrowLeft, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatDateTime, formatINR, formatNumber } from "@/lib/format";
import { getOrderById } from "@/lib/services/orders";
import { enumLabel } from "@/lib/types/database";
import { CreateDeliveryDialog, OrderStatusSelect, RecordPaymentDialog } from "./order-actions";

export const metadata: Metadata = { title: "Order detail" };

export default async function OrderDetailPage(props: PageProps<"/dashboard/orders/[id]">) {
  const { id } = await props.params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId)) notFound();

  const order = await getOrderById(orderId);
  if (!order) notFound();

  const paid = order.payments
    .filter((p) => p.paymentStatus === "Completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const outstanding = order.totalAmount - paid;

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/orders"
        className="inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <ArrowLeft aria-hidden className="size-4" />
        All orders
      </Link>

      <PageHeader
        title={`Order #${order.orderId}`}
        description={`${order.customerName} · placed ${formatDate(order.createdAt)} by ${order.createdByUsername}`}
        actions={<OrderStatusSelect orderId={order.orderId} status={order.status} />}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <section aria-labelledby="order-items" className="rounded-xl border bg-card lg:col-span-2">
          <h2 id="order-items" className="border-b p-5 pb-4 font-sans text-base font-semibold">
            Items
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit price</TableHead>
                  <TableHead className="text-right">Line total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.itemId}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(item.quantity)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatINR(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatINR(item.unitPrice * item.quantity)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="flex items-center justify-between border-t p-5 py-4 text-sm">
            <span className="text-muted-foreground">Order total</span>
            <span className="text-base font-semibold tabular-nums">
              {formatINR(order.totalAmount)}
            </span>
          </p>
        </section>

        <div className="space-y-4">
          <section aria-labelledby="order-payments" className="rounded-xl border bg-card">
            <div className="flex items-center justify-between gap-3 border-b p-5 pb-4">
              <h2 id="order-payments" className="font-sans text-base font-semibold">
                Payments
              </h2>
              <RecordPaymentDialog orderId={order.orderId} outstanding={outstanding} />
            </div>
            <div className="p-5 pt-4">
              <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-muted/60 p-3">
                  <p className="text-xs text-muted-foreground">Paid</p>
                  <p className="font-semibold tabular-nums">{formatINR(paid)}</p>
                </div>
                <div className="rounded-lg bg-muted/60 p-3">
                  <p className="text-xs text-muted-foreground">Outstanding</p>
                  <p
                    className={
                      outstanding > 0
                        ? "font-semibold text-status-warning tabular-nums"
                        : "font-semibold text-status-success tabular-nums"
                    }
                  >
                    {formatINR(outstanding)}
                  </p>
                </div>
              </div>
              {order.payments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No payments recorded yet.</p>
              ) : (
                <ul className="space-y-3">
                  {order.payments.map((payment) => (
                    <li
                      key={payment.paymentId}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <div>
                        <p className="font-medium tabular-nums">{formatINR(payment.amount)}</p>
                        <p className="text-xs text-muted-foreground">
                          {enumLabel(payment.paymentMethod)}
                          {payment.processedAt ? ` · ${formatDate(payment.processedAt)}` : ""}
                        </p>
                      </div>
                      <StatusBadge status={payment.paymentStatus} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section aria-labelledby="order-delivery" className="rounded-xl border bg-card">
            <div className="flex items-center justify-between gap-3 border-b p-5 pb-4">
              <h2 id="order-delivery" className="font-sans text-base font-semibold">
                Delivery
              </h2>
              {!order.delivery && order.status !== "Cancelled" ? (
                <CreateDeliveryDialog orderId={order.orderId} />
              ) : null}
            </div>
            <div className="p-5 pt-4">
              {order.delivery ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <div>
                      <p className="font-medium">{order.delivery.courierName ?? "Courier TBD"}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.delivery.trackingNum ?? "No tracking number"}
                      </p>
                    </div>
                    <StatusBadge status={order.delivery.status} />
                  </div>
                  <ol className="space-y-3 border-l pl-4">
                    {order.delivery.updates.map((update) => (
                      <li key={update.updateId} className="relative text-sm">
                        <span
                          aria-hidden
                          className="absolute top-1.5 left-[-1.32rem] size-2 rounded-full bg-brand-500"
                        />
                        <p className="font-medium">{enumLabel(update.status)}</p>
                        <p className="text-xs text-muted-foreground">
                          {update.location ? (
                            <>
                              <MapPin aria-hidden className="mr-1 inline size-3" />
                              {update.location} ·{" "}
                            </>
                          ) : null}
                          {formatDateTime(update.updatedAt)}
                        </p>
                      </li>
                    ))}
                  </ol>
                  <Link
                    href={`/dashboard/deliveries/${order.delivery.deliveryId}`}
                    className="inline-block rounded-sm text-sm font-medium text-brand-600 hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    Manage delivery
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {order.status === "Cancelled"
                    ? "Order was cancelled - no delivery."
                    : "No delivery created for this order yet."}
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
