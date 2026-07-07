"use client";

import { Copy, KeyRound, LifeBuoy, UserPlus } from "lucide-react";
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
import { createUser, recoverAccount, resetStaffPassword } from "@/lib/actions/users";
import type { RoleName } from "@/lib/types/database";
import { cn } from "@/lib/utils";

const selectClass =
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

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
        Share it with the account holder directly. It is shown only once — they should change it
        after signing in.
      </p>
    </div>
  );
}

export function CreateUserDialog({ creatorRole }: { creatorRole: RoleName }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<RoleName>("staff");
  const [created, setCreated] = useState<{ username: string; password: string } | null>(null);

  const roleOptions =
    creatorRole === "dev"
      ? [
          { value: "staff", label: "Staff (field staff)" },
          { value: "admin", label: "Admin (full control)" },
          { value: "dev", label: "Developer" },
        ]
      : [{ value: "staff", label: "Staff (field staff)" }];

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await createUser({ username, role });
      if (result.ok) {
        setCreated({ username, password: result.data.tempPassword });
        setFieldErrors({});
        toast.success("Account created");
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
      setRole("staff");
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
          <DialogTitle>Create account</DialogTitle>
          <DialogDescription>
            {creatorRole === "dev"
              ? "Developers can create staff, admin, and developer accounts."
              : "Administrators can create staff accounts."}
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
                onChange={(e) => setRole(e.target.value as RoleName)}
                disabled={roleOptions.length === 1}
                className={selectClass}
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" disabled={pending} onClick={() => handleOpenChange(false)}>
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

/** Admin/dev resets a STAFF password by supplying the staff's current password. */
export function ResetStaffPasswordDialog({ userId, username }: { userId: number; username: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function reset() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setFieldErrors({});
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await resetStaffPassword({ userId, currentPassword, newPassword, confirmPassword });
      if (result.ok) {
        toast.success(`Password updated for ${username}`);
        setOpen(false);
        reset();
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }))} aria-label={`Reset password for ${username}`}>
        <KeyRound aria-hidden data-icon="inline-start" />
        Reset password
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset password — {username}</DialogTitle>
          <DialogDescription>
            Enter this staff member&apos;s current password and choose a new one.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormField id="reset-current" label="Current staff password" errors={fieldErrors.currentPassword}>
            <Input
              {...fieldAria("reset-current", fieldErrors.currentPassword)}
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="off"
              required
            />
          </FormField>
          <FormField id="reset-new" label="New password" errors={fieldErrors.newPassword} hint="Min 8 chars with upper, lower, digit, and symbol.">
            <Input
              {...fieldAria("reset-new", fieldErrors.newPassword)}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </FormField>
          <FormField id="reset-confirm" label="Confirm new password" errors={fieldErrors.confirmPassword}>
            <Input
              {...fieldAria("reset-confirm", fieldErrors.confirmPassword)}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </FormField>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" disabled={pending} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Updating…" : "Update password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** dev-only account recovery: issues a fresh temporary password. */
export function RecoverAccountDialog({ userId, username }: { userId: number; username: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [password, setPassword] = useState<string | null>(null);

  function handleRecover() {
    startTransition(async () => {
      const result = await recoverAccount(userId);
      if (result.ok) {
        setPassword(result.data.tempPassword);
        toast.success(`Recovery password issued for ${username}`);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setPassword(null);
      }}
    >
      <DialogTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }))} aria-label={`Recover account for ${username}`}>
        <LifeBuoy aria-hidden data-icon="inline-start" />
        Recover
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recover account — {username}</DialogTitle>
          <DialogDescription>
            Issues a new temporary password. The old password stops working immediately.
          </DialogDescription>
        </DialogHeader>
        {password ? (
          <div className="space-y-4">
            <TempPasswordPanel username={username} password={password} />
            <div className="flex justify-end">
              <Button onClick={() => setOpen(false)}>Done</Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" disabled={pending} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" disabled={pending} onClick={handleRecover}>
              {pending ? "Issuing…" : "Issue recovery password"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
