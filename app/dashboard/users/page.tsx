import { UserCog } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { ExportButton } from "@/components/shared/ExportButton";
import { PageHeader } from "@/components/shared/PageHeader";
import { getSession } from "@/lib/auth/session";
import { formatDate, formatDateTime } from "@/lib/format";
import { getLoginHistory, getUsers } from "@/lib/services/users";
import { enumLabel } from "@/lib/types/database";
import type { UserWithRole } from "@/lib/types/user";
import { CreateUserDialog, RecoverAccountDialog, ResetStaffPasswordDialog } from "./user-controls";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage() {
  // Authoritative role gate - nav hiding alone is not access control.
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "dev")) {
    redirect("/dashboard");
  }

  const [page, recentLogins] = await Promise.all([
    getUsers({ pageSize: 50 }),
    getLoginHistory(),
  ]);

  const columns: DataTableColumn<UserWithRole>[] = [
    {
      key: "username",
      header: "User",
      cell: (user) => (
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 uppercase">
            {user.username.slice(0, 2)}
          </span>
          <div>
            <p className="font-medium">{user.username}</p>
            <p className="text-xs text-muted-foreground capitalize">{enumLabel(user.roleName)}</p>
          </div>
        </div>
      ),
    },
    {
      key: "createdBy",
      header: "Created by",
      cell: (user) => (
        <span className="text-muted-foreground">{user.createdByUsername ?? "-"}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      cell: (user) => <span className="text-muted-foreground">{formatDate(user.createdAt)}</span>,
    },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      cell: (user) => {
        if (user.userId === session.userId) {
          return <span className="text-xs text-muted-foreground">This is you</span>;
        }
        // dev recovers any account; admin may only reset staff passwords.
        if (session.role === "dev") {
          return <RecoverAccountDialog userId={user.userId} username={user.username} />;
        }
        if (user.roleName === "staff") {
          return <ResetStaffPasswordDialog userId={user.userId} username={user.username} />;
        }
        return <span className="text-xs text-muted-foreground">—</span>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Staff accounts for the portal. Only administrators manage accounts and passwords."
        actions={
          <>
            <ExportButton entity="users" />
            <CreateUserDialog creatorRole={session.role} />
          </>
        }
      />

      <DataTable
        columns={columns}
        rows={page.items}
        rowKey={(user) => user.userId}
        empty={{
          icon: UserCog,
          title: "No users",
          hint: "Create the first staff account.",
          action: <CreateUserDialog creatorRole={session.role} />,
        }}
      />

      <section aria-labelledby="login-history" className="rounded-xl border bg-card">
        <h2 id="login-history" className="border-b p-5 pb-4 font-sans text-base font-semibold">
          Recent logins
        </h2>
        <ul className="divide-y">
          {recentLogins.slice(0, 8).map((entry) => {
            const user = page.items.find((u) => u.userId === entry.userId);
            return (
              <li key={entry.historyId} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                <div>
                  <p className="font-medium">{user?.username ?? `user #${entry.userId}`}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.deviceInfo ?? "Unknown device"}
                    {entry.ipAddress ? ` · ${entry.ipAddress}` : ""}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDateTime(entry.loginTime)}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
