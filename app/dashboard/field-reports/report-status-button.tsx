"use client";

import { CheckCircle2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateFieldReportStatus } from "@/lib/actions/field-reports";

/** One-click resolution for reports awaiting follow-up. */
export function ReportStatusButton({ reportId }: { reportId: number }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await updateFieldReportStatus(reportId, "Completed");
          if (result.ok) {
            toast.success("Follow-up marked complete");
          } else {
            toast.error(result.error);
          }
        })
      }
    >
      <CheckCircle2 aria-hidden data-icon="inline-start" />
      {pending ? "Saving…" : "Mark completed"}
    </Button>
  );
}
