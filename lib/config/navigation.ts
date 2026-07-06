import {
  Activity,
  Boxes,
  ClipboardList,
  FileText,
  Layers,
  LayoutDashboard,
  LucideIcon,
  MessageSquare,
  Package,
  Settings,
  ShoppingCart,
  Truck,
  UserCog,
  Users,
  Warehouse,
} from "lucide-react";
import type { RoleName } from "@/lib/types/database";

export interface NavLink {
  label: string;
  href: string;
}

export interface DashboardNavLink extends NavLink {
  icon: LucideIcon;
  /** When set, the link is only shown to these roles. */
  roles?: RoleName[];
}

export interface DashboardNavGroup {
  label: string;
  links: DashboardNavLink[];
}

export const publicNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Feedback", href: "/feedback" },
  { label: "Contact", href: "/contact" },
];

export const dashboardNav: DashboardNavGroup[] = [
  {
    label: "Overview",
    links: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Sales",
    links: [
      { label: "Clients", href: "/dashboard/clients", icon: Users },
      { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
      { label: "Deliveries", href: "/dashboard/deliveries", icon: Truck },
      { label: "Statements", href: "/dashboard/statements", icon: FileText },
    ],
  },
  {
    label: "Catalog",
    links: [
      { label: "Products", href: "/dashboard/catalog/products", icon: Package },
      { label: "Categories", href: "/dashboard/catalog/categories", icon: Layers },
      { label: "Inventory", href: "/dashboard/inventory", icon: Warehouse },
      { label: "Suppliers", href: "/dashboard/suppliers", icon: Boxes },
    ],
  },
  {
    label: "Field Operations",
    links: [
      { label: "Field Reports", href: "/dashboard/field-reports", icon: ClipboardList },
    ],
  },
  {
    label: "System",
    links: [
      { label: "Feedback", href: "/dashboard/feedback", icon: MessageSquare },
      { label: "Activity Log", href: "/dashboard/activity", icon: Activity },
      { label: "Users", href: "/dashboard/users", icon: UserCog, roles: ["admin", "dev"] },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];
