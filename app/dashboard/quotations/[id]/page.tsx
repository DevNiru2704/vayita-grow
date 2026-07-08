import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { getSession } from "@/lib/auth/session";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatINR, formatNumber } from "@/lib/format";
import { getQuotationById } from "@/lib/services/quotations";
import { getUsers } from "@/lib/services/users";
import { QuotationStatusSelect, SendToStaffDialog } from "./quotation-actions";
import { QuotationPdfButton } from "./quotation-pdf-button";

export const metadata: Metadata = { title: "Quotation detail" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function QuotationDetailPage({ params }: Props) {
  const { id } = await params;
  const quotationId = Number(id);
  if (!Number.isInteger(quotationId)) notFound();

  const [quotation, session] = await Promise.all([getQuotationById(quotationId), getSession()]);
  if (!quotation) notFound();
  const canManage = session ? ADMIN_ROLES.includes(session.role) : false;

  const staffPage = canManage ? await getUsers({ role: "staff", pageSize: 100 }) : null;
  const staff = staffPage ? staffPage.items.map((u) => ({ userId: u.userId, username: u.username })) : [];

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/quotations"
        className="inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <ArrowLeft aria-hidden className="size-4" />
        All quotations
      </Link>

      <PageHeader
        title={quotation.quotationNumber}
        description={`${quotation.customerName} · created ${formatDate(quotation.createdAt)} by ${quotation.createdByUsername}`}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {canManage ? (
              <QuotationStatusSelect quotationId={quotation.quotationId} status={quotation.status} />
            ) : null}
            <QuotationPdfButton
              quotation={{
                quotationNumber: quotation.quotationNumber,
                customerName: quotation.customerName,
                status: quotation.status,
                createdAt: quotation.createdAt,
                validUntil: quotation.validUntil,
                createdByUsername: quotation.createdByUsername,
                assignedStaffName: quotation.assignedStaffName,
                notes: quotation.notes,
                totalAmount: quotation.totalAmount,
                items: quotation.items.map((it) => ({
                  productName: it.productName,
                  sku: it.sku,
                  quantity: it.quantity,
                  unitPrice: it.unitPrice,
                })),
              }}
            />
            {canManage ? (
              <SendToStaffDialog
                quotationId={quotation.quotationId}
                staff={staff}
                assignedStaffId={quotation.assignedStaffId}
              />
            ) : null}
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <section aria-labelledby="q-items" className="rounded-xl border bg-card lg:col-span-2">
          <h2 id="q-items" className="border-b p-5 pb-4 font-sans text-base font-semibold">
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
                {quotation.items.map((item) => (
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
            <span className="text-muted-foreground">Quotation total</span>
            <span className="text-base font-semibold tabular-nums">
              {formatINR(quotation.totalAmount)}
            </span>
          </p>
        </section>

        <section aria-labelledby="q-meta" className="h-fit rounded-xl border bg-card p-5">
          <h2 id="q-meta" className="mb-4 font-sans text-base font-semibold">
            Details
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Status</dt>
              <dd>
                <StatusBadge status={quotation.status} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Assigned to</dt>
              <dd className="font-medium">{quotation.assignedStaffName ?? "Unassigned"}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Valid until</dt>
              <dd className="font-medium">
                {quotation.validUntil ? formatDate(quotation.validUntil) : "—"}
              </dd>
            </div>
            {quotation.notes ? (
              <div className="border-t pt-3">
                <dt className="mb-1 text-xs text-muted-foreground">Notes</dt>
                <dd className="text-sm leading-relaxed">{quotation.notes}</dd>
              </div>
            ) : null}
          </dl>
        </section>
      </div>
    </div>
  );
}
