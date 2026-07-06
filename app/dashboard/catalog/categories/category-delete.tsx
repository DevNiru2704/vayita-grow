"use client";

import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { buttonVariants } from "@/components/ui/button";
import { deleteCategory } from "@/lib/actions/categories";
import { cn } from "@/lib/utils";

export function CategoryDelete({
  categoryId,
  categoryName,
}: {
  categoryId: number;
  categoryName: string;
}) {
  return (
    <ConfirmDialog
      trigger={<Trash2 aria-hidden className="size-3.5" />}
      triggerClassName={cn(
        buttonVariants({ variant: "ghost", size: "icon-sm" }),
        "text-status-danger",
      )}
      triggerAriaLabel={`Delete ${categoryName}`}
      title={`Delete ${categoryName}?`}
      description="Categories with products attached cannot be deleted - move the products first."
      confirmLabel="Delete category"
      successMessage={`${categoryName} deleted`}
      action={() => deleteCategory(categoryId)}
    />
  );
}
