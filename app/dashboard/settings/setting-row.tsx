"use client";

import { Check, Pencil, X } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateSetting } from "@/lib/actions/settings";

/** Inline-editable system setting (edit is admin/dev only, enforced server-side). */
export function SettingRow({
  settingKey,
  settingValue,
  canEdit,
}: {
  settingKey: string;
  settingValue: string;
  canEdit: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(settingValue);
  const [pending, startTransition] = useTransition();

  const label = settingKey.replaceAll("_", " ");

  function handleSave() {
    startTransition(async () => {
      const result = await updateSetting(settingKey, value);
      if (result.ok) {
        toast.success(`Updated ${label}`);
        setEditing(false);
      } else {
        toast.error(result.fieldErrors?.settingValue?.[0] ?? result.error);
      }
    });
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium capitalize">{label}</p>
        <p className="text-xs text-muted-foreground">{settingKey}</p>
      </div>
      {editing ? (
        <form
          className="flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            handleSave();
          }}
        >
          <label htmlFor={`setting-${settingKey}`} className="sr-only">
            Value for {label}
          </label>
          <Input
            id={`setting-${settingKey}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-8 w-52"
            disabled={pending}
          />
          <Button type="submit" size="icon-sm" disabled={pending} aria-label={`Save ${label}`}>
            <Check aria-hidden className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={pending}
            aria-label="Cancel"
            onClick={() => {
              setEditing(false);
              setValue(settingValue);
            }}
          >
            <X aria-hidden className="size-3.5" />
          </Button>
        </form>
      ) : (
        <div className="flex items-center gap-2">
          <code className="rounded-md bg-muted px-2.5 py-1 text-sm">{settingValue}</code>
          {canEdit ? (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Edit ${label}`}
              onClick={() => setEditing(true)}
            >
              <Pencil aria-hidden className="size-3.5" />
            </Button>
          ) : null}
        </div>
      )}
    </li>
  );
}
