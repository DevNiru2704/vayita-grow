"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  FileText,
  ClipboardList,
  Settings,
  Leaf,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  ShoppingCart,
  FileText,
  ClipboardList,
  Settings,
};

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Clients", href: "/dashboard/clients", icon: "Users" },
  { label: "Orders", href: "/dashboard/orders", icon: "ShoppingCart" },
  { label: "Statements", href: "/dashboard/statements", icon: "FileText" },
  { label: "Field Reports", href: "/dashboard/field-reports", icon: "ClipboardList" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-brand-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-primary text-white">
          <Leaf className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-heading text-sm font-bold text-brand-dark leading-tight">
            VayitaGrow
          </span>
          <span className="text-[9px] text-brand-body leading-tight tracking-wider uppercase">
            Management Portal
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {sidebarLinks.map((link) => {
          const Icon = iconMap[link.icon];
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-light text-brand-primary"
                  : "text-brand-body hover:bg-brand-section hover:text-brand-dark"
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-brand-border">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-body hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Back to Website
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-brand-section">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-brand-border min-h-screen fixed top-0 left-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-brand-border flex flex-col transform transition-transform lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-brand-border h-14 flex items-center px-4 sm:px-6 lg:px-8">
          <button
            className="lg:hidden p-2 rounded-lg text-brand-body hover:bg-brand-light transition-colors mr-3"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center">
              <span className="text-xs font-semibold text-brand-primary">AD</span>
            </div>
            <div>
              <p className="text-sm font-medium text-brand-dark">Admin User</p>
              <p className="text-xs text-brand-body">admin@vayitagrow.com</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
