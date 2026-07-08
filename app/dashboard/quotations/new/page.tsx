import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { getSession } from "@/lib/auth/session";
import { getCustomerOptions } from "@/lib/services/customers";
import { getProducts } from "@/lib/services/products";
import { QuotationForm } from "./quotation-form";

export const metadata: Metadata = { title: "New quotation" };

export default async function NewQuotationPage() {
  const session = await getSession();
  if (!session || !ADMIN_ROLES.includes(session.role)) redirect("/dashboard/quotations");

  const [customers, productsPage] = await Promise.all([
    getCustomerOptions(),
    getProducts({ pageSize: 100, sort: "name", dir: "asc" }),
  ]);
  const products = productsPage.items.map((p) => ({
    productId: p.productId,
    name: p.name,
    sku: p.sku,
    basePrice: p.basePrice,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="New quotation"
        description="Build a price quotation. Unit prices are locked from the catalog at creation."
      />
      <QuotationForm customers={customers} products={products} />
    </div>
  );
}
