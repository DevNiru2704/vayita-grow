"use client";

import { MessageSquarePlus } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { FormField, fieldAria } from "@/components/shared/FormField";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addCustomerNote } from "@/lib/actions/customers";

export function AddNoteForm({ customerId }: { customerId: number }) {
  const [noteText, setNoteText] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await addCustomerNote(customerId, noteText);
      if (result.ok) {
        toast.success("Note added");
        setNoteText("");
        setFieldErrors({});
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <FormField id="note-text" label="Add an internal note" errors={fieldErrors.noteText}>
        <Textarea
          {...fieldAria("note-text", fieldErrors.noteText)}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          rows={3}
          placeholder="Visit outcome, credit terms, follow-up reminders…"
          required
        />
      </FormField>
      <Button type="submit" size="sm" disabled={pending}>
        <MessageSquarePlus aria-hidden data-icon="inline-start" />
        {pending ? "Adding…" : "Add note"}
      </Button>
    </form>
  );
}
