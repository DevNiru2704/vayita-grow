import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { getCustomerOptions } from "@/lib/services/customers";
import { getProducts } from "@/lib/services/products";
import { paramNumber } from "@/lib/url";
import { OrderForm } from "./order-form";

export const metadata: Metadata = { title: "New order" };

export default async function NewOrderPage(props: PageProps<"/dashboard/orders/new">) {
  const searchParams = await props.searchParams;
  const [customers, products] = await Promise.all([
    getCustomerOptions(),
    getProducts({ pageSize: 100 }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="New order"
        description="Record a client order. Unit prices are taken from the catalog and locked."
      />
      <OrderForm
        customers={customers}
        products={products.items.map((p) => ({
          productId: p.productId,
          name: p.name,
          sku: p.sku,
          basePrice: p.basePrice,
        }))}
        initialCustomerId={paramNumber(searchParams, "customer")}
      />
    </div>
  );
}
