"use client";

import { ShieldCheck, ShieldOff } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { FormField, fieldAria } from "@/components/shared/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  begin2faEnrollment,
  confirm2faEnrollment,
  disable2faForCurrentUser,
} from "@/lib/actions/security";

type Mode = "idle" | "enrolling" | "disabling";

export function TwoFactorCard({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [mode, setMode] = useState<Mode>("idle");
  const [enroll, setEnroll] = useState<{ qr: string; secret: string } | null>(null);
  const [code, setCode] = useState("");
  const [pending, start] = useTransition();

  function reset() {
    setMode("idle");
    setEnroll(null);
    setCode("");
  }

  function begin() {
    start(async () => {
      const res = await begin2faEnrollment();
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      if (res.data.alreadyEnabled) {
        setEnabled(true);
        toast.info("Two-factor authentication is already enabled.");
        return;
      }
      setEnroll({ qr: res.data.qr!, secret: res.data.secret! });
      setMode("enrolling");
    });
  }

  function confirm() {
    start(async () => {
      const res = await confirm2faEnrollment(code);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setEnabled(true);
      reset();
      toast.success("Two-factor authentication enabled.");
    });
  }

  function disable() {
    start(async () => {
      const res = await disable2faForCurrentUser(code);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setEnabled(false);
      reset();
      toast.success("Two-factor authentication disabled.");
    });
  }

  return (
    <section aria-labelledby="two-factor" className="rounded-xl border bg-card p-5">
      <h2 id="two-factor" className="mb-1 flex items-center gap-2 font-sans text-base font-semibold">
        {enabled ? (
          <ShieldCheck aria-hidden className="size-4 text-status-success" />
        ) : (
          <ShieldOff aria-hidden className="size-4 text-muted-foreground" />
        )}
        Two-factor authentication
      </h2>

      {enabled ? (
        <>
          <p className="text-sm text-status-success">
            Two-factor authentication is enabled on your account.
          </p>
          {mode === "disabling" ? (
            <div className="mt-4 space-y-3">
              <FormField id="disable-2fa-code" label="Enter a current code to turn off 2FA">
                <Input
                  {...fieldAria("disable-2fa-code")}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="one-time-code"
                />
              </FormField>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={reset} disabled={pending}>
                  Cancel
                </Button>
                <Button type="button" variant="destructive" onClick={disable} disabled={pending}>
                  {pending ? "Disabling…" : "Disable 2FA"}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => setMode("disabling")}
            >
              Disable 2FA
            </Button>
          )}
        </>
      ) : mode === "enrolling" && enroll ? (
        <div className="mt-2 space-y-4">
          <p className="text-sm text-muted-foreground">
            Scan this QR code with Google Authenticator (or any TOTP app), then enter the
            6-digit code to confirm.
          </p>
          <div className="flex justify-center rounded-lg border bg-background p-3">
            <Image src={enroll.qr} alt="Two-factor setup QR code" width={200} height={200} unoptimized />
          </div>
          <p className="text-xs text-muted-foreground">
            Can&apos;t scan? Enter this key manually:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono">{enroll.secret}</code>
          </p>
          <FormField id="confirm-2fa-code" label="6-digit code">
            <Input
              {...fieldAria("confirm-2fa-code")}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
              maxLength={6}
              autoComplete="one-time-code"
              autoFocus
            />
          </FormField>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={reset} disabled={pending}>
              Cancel
            </Button>
            <Button type="button" onClick={confirm} disabled={pending}>
              {pending ? "Confirming…" : "Confirm & enable"}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Add a second layer of security to your admin account with an authenticator app.
          </p>
          <Button type="button" className="mt-4" onClick={begin} disabled={pending}>
            {pending ? "Preparing…" : "Enable 2FA"}
          </Button>
        </>
      )}
    </section>
  );
}
