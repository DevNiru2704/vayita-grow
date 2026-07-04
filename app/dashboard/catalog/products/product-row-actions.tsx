"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { buttonVariants } from "@/components/ui/button";
import { deleteProduct } from "@/lib/actions/products";
import { cn } from "@/lib/utils";

export function ProductRowActions({
  productId,
  productName,
}: {
  productId: number;
  productName: string;
}) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <Link
        href={`/dashboard/catalog/products/${productId}`}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
        aria-label={`Edit ${productName}`}
      >
        <Pencil aria-hidden className="size-3.5" />
      </Link>
      <ConfirmDialog
        trigger={<Trash2 aria-hidden className="size-3.5" />}
        triggerClassName={cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "text-status-danger",
        )}
        triggerAriaLabel={`Delete ${productName}`}
        title={`Delete ${productName}?`}
        description="This removes the product from the public site and the catalog. Products that appear in existing orders cannot be deleted."
        confirmLabel="Delete product"
        successMessage={`${productName} deleted`}
        action={() => deleteProduct(productId)}
      />
    </div>
  );
}
