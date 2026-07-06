import { Info } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { getSession } from "@/lib/auth/session";
import { company } from "@/lib/config/company";
import { getSettings } from "@/lib/services/settings";
import { enumLabel } from "@/lib/types/database";
import { SettingRow } from "./setting-row";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const [session, settings] = await Promise.all([getSession(), getSettings()]);
  const canEdit = session?.role === "admin" || session?.role === "dev";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description={
          canEdit
            ? "System configuration values used across the portal."
            : "System configuration (read-only - only administrators can edit)."
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <section aria-labelledby="system-settings" className="rounded-xl border bg-card lg:col-span-2">
          <h2 id="system-settings" className="border-b p-5 pb-4 font-sans text-base font-semibold">
            System settings
          </h2>
          <ul className="divide-y">
            {settings.map((setting) => (
              <SettingRow
                key={setting.settingKey}
                settingKey={setting.settingKey}
                settingValue={setting.settingValue}
                canEdit={canEdit}
              />
            ))}
          </ul>
        </section>

        <div className="space-y-4">
          <section aria-labelledby="account-info" className="rounded-xl border bg-card p-5">
            <h2 id="account-info" className="mb-4 font-sans text-base font-semibold">
              Your account
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Username</dt>
                <dd className="font-medium">{session?.username}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Role</dt>
                <dd className="font-medium capitalize">
                  {session ? enumLabel(session.role) : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Organization</dt>
                <dd className="font-medium">{company.legalName}</dd>
              </div>
            </dl>
            <p className="mt-4 border-t pt-3 text-xs leading-relaxed text-muted-foreground">
              Passwords are managed by the administrator - contact them for a reset. There is
              no self-service password change, by design.
            </p>
          </section>

          <section
            aria-labelledby="demo-note"
            className="rounded-xl border border-dashed bg-muted/50 p-5"
          >
            <h2 id="demo-note" className="mb-2 flex items-center gap-2 font-sans text-sm font-semibold">
              <Info aria-hidden className="size-4 text-brand-600" />
              About this environment
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              This portal currently runs on an in-memory demonstration data layer. All changes
              behave like production but reset when the server restarts. The production
              database design (PostgreSQL with full audit, 2FA-ready authentication, and file
              storage) is documented and ready for the backend phase.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
