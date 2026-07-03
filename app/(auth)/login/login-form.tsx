"use client";

import { Eye, EyeOff, LogIn } from "lucide-react";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginDemo, type LoginFormState } from "@/lib/actions/auth";

const initialState: LoginFormState = { error: null };

export function LoginForm({ from }: { from?: string }) {
  const [state, formAction, pending] = useActionState(loginDemo, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} noValidate className="space-y-5">
      {from ? <input type="hidden" name="from" value={from} /> : null}

      <div className="space-y-2">
        <Label htmlFor="login-username">Username</Label>
        <Input
          id="login-username"
          name="username"
          autoComplete="username"
          required
          aria-describedby={state.error ? "login-error" : undefined}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password">Password</Label>
        <div className="relative">
          <Input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="pr-10"
            aria-describedby={state.error ? "login-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {showPassword ? (
              <EyeOff aria-hidden className="size-4" />
            ) : (
              <Eye aria-hidden className="size-4" />
            )}
          </button>
        </div>
      </div>

      {state.error ? (
        <p id="login-error" role="alert" className="text-sm font-medium text-status-danger">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="h-11 w-full" disabled={pending}>
        <LogIn aria-hidden data-icon="inline-start" />
        {pending ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Access is provided by your administrator. Contact the admin if you have trouble
        signing in.
      </p>
    </form>
  );
}
