"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNav } from "@/lib/config/navigation";
import type { RoleName } from "@/lib/types/database";
import { cn } from "@/lib/utils";

/**
 * Grouped dashboard navigation. Rendered inside the desktop aside and the
 * mobile sheet (via DashboardTopbar). Role-gated links are filtered here
 * for display; pages enforce access authoritatively on the server.
 */
export function DashboardSidebar({
  role,
  onNavigate,
}: {
  role: RoleName;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <nav aria-label="Dashboard" className="flex flex-col gap-6 p-4">
      {dashboardNav.map((group) => {
        const links = group.links.filter((link) => !link.roles || link.roles.includes(role));
        if (links.length === 0) return null;
        return (
          <div key={group.label}>
            <p className="px-3 pb-2 text-[0.68rem] font-semibold tracking-wider text-muted-foreground uppercase">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                      isActive(link.href)
                        ? "bg-brand-100 text-brand-700"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <link.icon aria-hidden className="size-4 shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
