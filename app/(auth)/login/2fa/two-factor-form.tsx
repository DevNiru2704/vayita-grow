"use client";

import { ShieldCheck, Timer } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyTwoFactor, type TwoFactorFormState } from "@/lib/actions/auth";

const initialState: TwoFactorFormState = { error: null };

function secondsLeft(expiresAt: number): number {
  return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
}

export function TwoFactorForm({ expiresAt, from }: { expiresAt: number; from?: string }) {
  const [state, formAction, pending] = useActionState(verifyTwoFactor, initialState);
  const [remaining, setRemaining] = useState(() => secondsLeft(expiresAt));

  useEffect(() => {
    const id = setInterval(() => setRemaining(secondsLeft(expiresAt)), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const expired = remaining <= 0;
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <form action={formAction} noValidate className="space-y-5">
      {from ? <input type="hidden" name="from" value={from} /> : null}

      <div className="space-y-2">
        <Label htmlFor="code">Authentication code</Label>
        <Input
          id="code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          pattern="\d{6}"
          required
          autoFocus
          disabled={expired}
          className="text-center text-lg tracking-[0.5em]"
          aria-describedby="code-timer"
        />
      </div>

      <p
        id="code-timer"
        aria-live="polite"
        className={`flex items-center gap-1.5 text-sm ${expired ? "text-status-danger" : "text-muted-foreground"}`}
      >
        <Timer aria-hidden className="size-4" />
        {expired ? "This code request has expired." : `Expires in ${mm}:${ss}`}
      </p>

      {state.error ? (
        <p role="alert" className="text-sm font-medium text-status-danger">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="h-11 w-full" disabled={pending || expired}>
        <ShieldCheck aria-hidden data-icon="inline-start" />
        {pending ? "Verifying…" : "Verify & sign in"}
      </Button>
    </form>
  );
}
