"use client";

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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-brand-border min-h-screen">
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
    </aside>
  );
}
