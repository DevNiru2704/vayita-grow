import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import type { SessionUser } from "@/lib/types/user";

/** Dashboard chrome: fixed sidebar on desktop, sheet drawer on mobile (in topbar). */
export function DashboardShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 overflow-y-auto border-r bg-sidebar lg:block">
        <div className="flex h-14 items-center border-b px-6">
          <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Management Portal
          </p>
        </div>
        <DashboardSidebar role={user.role} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar user={user} />
        <main id="main-content" className="flex-1 bg-muted/40 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
