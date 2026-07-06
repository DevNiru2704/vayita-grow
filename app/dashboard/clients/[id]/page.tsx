import { ArrowLeft, Mail, MapPin, Phone, ShoppingCart } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import { formatDate, formatDateTime, formatINR } from "@/lib/format";
import { getCustomerById } from "@/lib/services/customers";
import { getOrders } from "@/lib/services/orders";
import { ClientDialog } from "../client-dialog";
import { AddNoteForm } from "./add-note-form";

export const metadata: Metadata = { title: "Client detail" };

export default async function ClientDetailPage(props: PageProps<"/dashboard/clients/[id]">) {
  const { id } = await props.params;
  const customerId = Number(id);
  if (!Number.isInteger(customerId)) notFound();

  const customer = await getCustomerById(customerId);
  if (!customer) notFound();

  const orders = await getOrders({ customerId, pageSize: 8 });

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/clients"
        className="inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <ArrowLeft aria-hidden className="size-4" />
        All clients
      </Link>

      <PageHeader
        title={customer.fullName}
        description={`Client since ${formatDate(customer.createdAt)}`}
        actions={<ClientDialog customer={customer} />}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <section aria-label="Client information" className="space-y-4 rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-base font-semibold">Details</h2>
            <StatusBadge status={customer.status} />
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span>
                {customer.address}, {customer.state}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone aria-hidden className="size-4 shrink-0 text-muted-foreground" />
              <a
                href={`tel:${customer.phone.replaceAll(" ", "")}`}
                className="rounded-sm hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {customer.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail aria-hidden className="size-4 shrink-0 text-muted-foreground" />
              {customer.email ? (
                <a
                  href={`mailto:${customer.email}`}
                  className="rounded-sm hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {customer.email}
                </a>
              ) : (
                <span className="text-muted-foreground">No email on record</span>
              )}
            </li>
          </ul>
          <div className="rounded-lg bg-muted/60 p-3 text-sm">
            <p className="font-medium">{customer.orderCount} orders</p>
            <p className="text-xs text-muted-foreground">
              {customer.lastOrderAt
                ? `Most recent on ${formatDate(customer.lastOrderAt)}`
                : "No orders yet"}
            </p>
          </div>
        </section>

        <section aria-labelledby="client-orders" className="rounded-xl border bg-card lg:col-span-2">
          <div className="flex items-center justify-between gap-3 border-b p-5 pb-4">
            <h2 id="client-orders" className="font-sans text-base font-semibold">
              Orders
            </h2>
            <Link
              href={`/dashboard/orders/new?customer=${customer.customerId}`}
              className={buttonVariants({ variant: "secondary", size: "sm" })}
            >
              <ShoppingCart aria-hidden data-icon="inline-start" />
              New order
            </Link>
          </div>
          {orders.items.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              No orders recorded for this client yet.
            </p>
          ) : (
            <ul className="divide-y">
              {orders.items.map((order) => (
                <li key={order.orderId}>
                  <Link
                    href={`/dashboard/orders/${order.orderId}`}
                    className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none"
                  >
                    <div>
                      <p className="text-sm font-medium">Order #{order.orderId}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)} · {order.itemCount} item
                        {order.itemCount === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium tabular-nums">
                        {formatINR(order.totalAmount)}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section aria-labelledby="client-notes" className="rounded-xl border bg-card p-5">
        <h2 id="client-notes" className="mb-4 font-sans text-base font-semibold">
          Internal notes
        </h2>
        <div className="grid gap-8 lg:grid-cols-2">
          <AddNoteForm customerId={customer.customerId} />
          {customer.notes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notes yet - add the first one.</p>
          ) : (
            <ul className="space-y-4">
              {customer.notes.map((note) => (
                <li key={note.noteId} className="rounded-lg border bg-muted/40 p-4">
                  <p className="text-sm leading-relaxed">{note.noteText}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {note.createdByUsername} · {formatDateTime(note.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
