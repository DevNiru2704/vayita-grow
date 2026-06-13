import {
  Users,
  ShoppingCart,
  FileText,
  ClipboardList,
  TrendingUp,
  Package,
  MapPin,
  Sprout,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Users,
  ShoppingCart,
  FileText,
  ClipboardList,
  TrendingUp,
  Package,
  MapPin,
  Sprout,
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  change?: string;
  description?: string;
  variant?: "default" | "hero";
}

export default function StatCard({
  label,
  value,
  icon,
  change,
  description,
  variant = "default",
}: StatCardProps) {
  const Icon = icon ? iconMap[icon] : null;

  if (variant === "hero") {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-border text-center hover:shadow-md transition-shadow">
        <p className="font-heading text-3xl sm:text-4xl font-bold text-brand-primary mb-1">
          {value}
        </p>
        <p className="text-sm font-medium text-brand-body">{label}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-brand-border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-brand-body mb-1">{label}</p>
          <p className="font-heading text-2xl font-bold text-brand-dark">
            {value}
          </p>
          {change && (
            <p className="text-xs text-brand-secondary mt-1 font-medium">
              {change} from last month
            </p>
          )}
          {description && (
            <p className="text-xs text-brand-body mt-1">{description}</p>
          )}
        </div>
        {Icon && (
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-light text-brand-primary">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
