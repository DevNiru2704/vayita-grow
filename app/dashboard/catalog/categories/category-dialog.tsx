"use client";

import { Pencil, Plus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { createCategory, updateCategory } from "@/lib/actions/categories";
import type { ProductCategory } from "@/lib/types/catalog";
import { cn } from "@/lib/utils";

/** Create/edit dialog for product categories. */
export function CategoryDialog({ category }: { category?: ProductCategory }) {
  const isEdit = !!category;
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [values, setValues] = useState({
    categoryName: category?.categoryName ?? "",
    description: category?.description ?? "",
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = isEdit
        ? await updateCategory(category.categoryId, values)
        : await createCategory(values);

      if (result.ok) {
        toast.success(isEdit ? "Category updated" : "Category created");
        setOpen(false);
        if (!isEdit) setValues({ categoryName: "", description: "" });
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
        className={cn(
          buttonVariants(isEdit ? { variant: "ghost", size: "icon-sm" } : { size: "lg" }),
        )}
        aria-label={isEdit ? `Edit ${category.categoryName}` : undefined}
      >
        {isEdit ? (
          <Pencil aria-hidden className="size-3.5" />
        ) : (
          <>
            <Plus aria-hidden data-icon="inline-start" />
            New category
          </>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? `Edit ${category.categoryName}` : "New category"}</DialogTitle>
          <DialogDescription>
            Categories organize the public product catalog and the CMS.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormField id="cat-name" label="Category name" errors={fieldErrors.categoryName}>
            <Input
              {...fieldAria("cat-name", fieldErrors.categoryName)}
              value={values.categoryName}
              onChange={(e) => setValues((v) => ({ ...v, categoryName: e.target.value }))}
              required
            />
          </FormField>
          <FormField id="cat-desc" label="Description" errors={fieldErrors.description}>
            <Textarea
              {...fieldAria("cat-desc", fieldErrors.description)}
              value={values.description}
              onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
              rows={3}
              required
            />
          </FormField>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : isEdit ? "Save changes" : "Create category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
