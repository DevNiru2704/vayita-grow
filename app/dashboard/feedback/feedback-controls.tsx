"use client";

import { MessageSquarePlus } from "lucide-react";
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
import { createFeedbackTicket, updateFeedbackStatus } from "@/lib/actions/feedback";
import { FEEDBACK_STATUSES, enumLabel, type FeedbackStatus } from "@/lib/types/database";
import { cn } from "@/lib/utils";

export function NewTicketDialog() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await createFeedbackTicket({ subject, message });
      if (result.ok) {
        toast.success("Ticket created");
        setOpen(false);
        setSubject("");
        setMessage("");
        setFieldErrors({});
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(buttonVariants({ size: "lg" }))}>
        <MessageSquarePlus aria-hidden data-icon="inline-start" />
        New ticket
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New internal ticket</DialogTitle>
          <DialogDescription>
            Operational issues, suggestions, and requests from the team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormField id="fb-subject" label="Subject" errors={fieldErrors.subject}>
            <Input
              {...fieldAria("fb-subject", fieldErrors.subject)}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </FormField>
          <FormField id="fb-message" label="Details" errors={fieldErrors.message}>
            <Textarea
              {...fieldAria("fb-message", fieldErrors.message)}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
            />
          </FormField>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" disabled={pending} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating…" : "Create ticket"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function TicketStatusSelect({
  feedbackId,
  status,
}: {
  feedbackId: number;
  status: FeedbackStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      aria-label={`Status for ticket #${feedbackId}`}
      onChange={(event) => {
        const next = event.target.value as FeedbackStatus;
        startTransition(async () => {
          const result = await updateFeedbackStatus(feedbackId, next);
          if (result.ok) {
            toast.success(`Ticket marked ${enumLabel(next)}`);
          } else {
            toast.error(result.error);
          }
        });
      }}
      className="flex h-8 w-32 rounded-lg border border-input bg-background px-2 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      {FEEDBACK_STATUSES.map((option) => (
        <option key={option} value={option}>
          {enumLabel(option)}
        </option>
      ))}
    </select>
  );
}
