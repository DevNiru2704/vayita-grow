import { ArrowLeft, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateTime, formatINR } from "@/lib/format";
import { getDeliveryById } from "@/lib/services/deliveries";
import { enumLabel } from "@/lib/types/database";
import { DeliveryUpdateDialog } from "./delivery-update-dialog";

export const metadata: Metadata = { title: "Delivery detail" };

export default async function DeliveryDetailPage(
  props: PageProps<"/dashboard/deliveries/[id]">,
) {
  const { id } = await props.params;
  const deliveryId = Number(id);
  if (!Number.isInteger(deliveryId)) notFound();

  const delivery = await getDeliveryById(deliveryId);
  if (!delivery) notFound();

  const isFinal = delivery.status === "Delivered" || delivery.status === "Returned";

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/deliveries"
        className="inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <ArrowLeft aria-hidden className="size-4" />
        All deliveries
      </Link>

      <PageHeader
        title={`Delivery #${delivery.deliveryId}`}
        description={`${delivery.customerName} · order #${delivery.orderId} (${formatINR(delivery.orderTotal)})`}
        actions={!isFinal ? <DeliveryUpdateDialog deliveryId={delivery.deliveryId} /> : undefined}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <section aria-label="Delivery summary" className="rounded-xl border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-sans text-base font-semibold">Summary</h2>
            <StatusBadge status={delivery.status} />
          </div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Courier</dt>
              <dd className="font-medium">{delivery.courierName ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Tracking number</dt>
              <dd className="font-medium">{delivery.trackingNum ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Delivered at</dt>
              <dd className="font-medium">
                {delivery.deliveredAt ? formatDateTime(delivery.deliveredAt) : "Not delivered yet"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Linked order</dt>
              <dd>
                <Link
                  href={`/dashboard/orders/${delivery.orderId}`}
                  className="rounded-sm font-medium text-brand-600 hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  Order #{delivery.orderId}
                </Link>
              </dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="transit-timeline" className="rounded-xl border bg-card p-5 lg:col-span-2">
          <h2 id="transit-timeline" className="mb-5 font-sans text-base font-semibold">
            Transit timeline
          </h2>
          {delivery.updates.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transit updates recorded yet.</p>
          ) : (
            <ol className="space-y-5 border-l pl-5">
              {delivery.updates.map((update, index) => (
                <li key={update.updateId} className="relative">
                  <span
                    aria-hidden
                    className={
                      index === 0
                        ? "absolute top-1 left-[-1.63rem] size-3 rounded-full bg-brand-600 ring-4 ring-brand-100"
                        : "absolute top-1.5 left-[-1.5rem] size-2 rounded-full bg-brand-300"
                    }
                  />
                  <p className="text-sm font-medium">{enumLabel(update.status)}</p>
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
          )}
        </section>
      </div>
    </div>
  );
}
