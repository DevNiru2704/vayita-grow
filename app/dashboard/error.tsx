"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-card px-6 py-20 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-status-danger-soft text-status-danger">
        <AlertTriangle aria-hidden className="size-6" />
      </span>
      <div className="space-y-1">
        <h2 className="font-sans text-lg font-semibold">Something went wrong</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          This section failed to load. Try again - if the problem persists, contact the
          administrator.
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
