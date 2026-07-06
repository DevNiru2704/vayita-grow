import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s · VayitaGrow Portal",
  },
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  // Authoritative session check (proxy.ts only does the optimistic redirect).
  const session = await getSession();
  if (!session) redirect("/login");

  return <DashboardShell user={session}>{children}</DashboardShell>;
}
