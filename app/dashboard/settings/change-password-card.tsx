"use client";

import { KeyRound } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { FormField, fieldAria } from "@/components/shared/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changeOwnPassword } from "@/lib/actions/account";

export function ChangePasswordCard() {
  const [pending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [values, setValues] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  function update(key: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await changeOwnPassword(values);
      if (result.ok) {
        setValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setFieldErrors({});
        toast.success("Password changed");
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.error);
      }
    });
  }

  return (
    <section aria-labelledby="change-password" className="rounded-xl border bg-card p-5">
      <h2 id="change-password" className="mb-1 flex items-center gap-2 font-sans text-base font-semibold">
        <KeyRound aria-hidden className="size-4 text-brand-600" />
        Change your password
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Use this after signing in with a temporary password.
      </p>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField id="cp-current" label="Current password" errors={fieldErrors.currentPassword}>
          <Input
            {...fieldAria("cp-current", fieldErrors.currentPassword)}
            type="password"
            value={values.currentPassword}
            onChange={(e) => update("currentPassword", e.target.value)}
            autoComplete="current-password"
            required
          />
        </FormField>
        <FormField
          id="cp-new"
          label="New password"
          errors={fieldErrors.newPassword}
          hint="Min 8 chars with an uppercase, lowercase, digit, and special symbol."
        >
          <Input
            {...fieldAria("cp-new", fieldErrors.newPassword)}
            type="password"
            value={values.newPassword}
            onChange={(e) => update("newPassword", e.target.value)}
            autoComplete="new-password"
            required
          />
        </FormField>
        <FormField id="cp-confirm" label="Confirm new password" errors={fieldErrors.confirmPassword}>
          <Input
            {...fieldAria("cp-confirm", fieldErrors.confirmPassword)}
            type="password"
            value={values.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
            autoComplete="new-password"
            required
          />
        </FormField>
        <div className="flex justify-end">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Change password"}
          </Button>
        </div>
      </form>
    </section>
  );
}
