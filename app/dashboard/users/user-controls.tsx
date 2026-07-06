"use client";

import { Copy, KeyRound, UserPlus } from "lucide-react";
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
import { createStaffUser, resetUserPassword } from "@/lib/actions/users";
import { cn } from "@/lib/utils";

/**
 * Shows the generated temp password exactly once after create/reset -
 * mirrors the agreed workflow where the admin hands credentials to staff.
 */
function TempPasswordPanel({ username, password }: { username: string; password: string }) {
  return (
    <div className="space-y-3 rounded-lg border border-dashed bg-brand-50 p-4">
      <p className="text-sm">
        Temporary password for <span className="font-semibold">{username}</span>:
      </p>
      <div className="flex items-center gap-2">
        <code className="flex-1 rounded-md border bg-background px-3 py-2 font-mono text-sm">
          {password}
        </code>
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          aria-label="Copy password"
          onClick={() => {
            void navigator.clipboard.writeText(password);
            toast.success("Password copied");
          }}
        >
          <Copy aria-hidden className="size-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Share it with the staff member directly. It is shown only once - passwords can only be
        reset by an administrator (no self-service).
      </p>
    </div>
  );
}

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"admin" | "sub_admin">("sub_admin");
  const [created, setCreated] = useState<{ username: string; password: string } | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await createStaffUser({ username, role });
      if (result.ok) {
        setCreated({ username, password: result.data.tempPassword });
        setFieldErrors({});
        toast.success("Staff account created");
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.error);
      }
    });
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setCreated(null);
      setUsername("");
      setRole("sub_admin");
      setFieldErrors({});
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className={cn(buttonVariants({ size: "lg" }))}>
        <UserPlus aria-hidden data-icon="inline-start" />
        Create account
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create staff account</DialogTitle>
          <DialogDescription>
            Only administrators create accounts and reset passwords - staff have no
            self-service access.
          </DialogDescription>
        </DialogHeader>
        {created ? (
          <div className="space-y-4">
            <TempPasswordPanel username={created.username} password={created.password} />
            <div className="flex justify-end">
              <Button onClick={() => handleOpenChange(false)}>Done</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <FormField id="user-name" label="Username" errors={fieldErrors.username}>
              <Input
                {...fieldAria("user-name", fieldErrors.username)}
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                autoComplete="off"
                required
              />
            </FormField>
            <FormField id="user-role" label="Role" errors={fieldErrors.role}>
              <select
                {...fieldAria("user-role", fieldErrors.role)}
                value={role}
                onChange={(e) => setRole(e.target.value as "admin" | "sub_admin")}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <option value="sub_admin">Sub admin (field staff)</option>
                <option value="admin">Admin (full control)</option>
              </select>
            </FormField>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Creating…" : "Create account"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function ResetPasswordDialog({
  userId,
  username,
}: {
  userId: number;
  username: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [password, setPassword] = useState<string | null>(null);

  function handleReset() {
    startTransition(async () => {
      const result = await resetUserPassword(userId);
      if (result.ok) {
        setPassword(result.data.tempPassword);
        toast.success(`Password reset for ${username}`);
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setPassword(null);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        aria-label={`Reset password for ${username}`}
      >
        <KeyRound aria-hidden data-icon="inline-start" />
        Reset password
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset password - {username}</DialogTitle>
          <DialogDescription>
            Generates a new temporary password. The old password stops working immediately.
          </DialogDescription>
        </DialogHeader>
        {password ? (
          <div className="space-y-4">
            <TempPasswordPanel username={username} password={password} />
            <div className="flex justify-end">
              <Button onClick={() => handleOpenChange(false)}>Done</Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" disabled={pending} onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" disabled={pending} onClick={handleReset}>
              {pending ? "Resetting…" : "Reset password"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
