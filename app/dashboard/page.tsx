"use client";

import {
  Users,
  ShoppingCart,
  FileText,
  ClipboardList,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { dashboardStats, monthlyOrdersData, monthlyReportsData } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  Users,
  ShoppingCart,
  FileText,
  ClipboardList,
};

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-brand-dark mb-1">
          Dashboard Overview
        </h1>
        <p className="text-sm text-brand-body">
          Welcome back. Here is a summary of your business operations.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {dashboardStats.map((stat) => {
          const Icon = iconMap[stat.icon];
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 shadow-sm border border-brand-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-body mb-1">
                    {stat.label}
                  </p>
                  <p className="font-heading text-2xl font-bold text-brand-dark">
                    {stat.value}
                  </p>
                  <p className="text-xs text-brand-secondary mt-1 font-medium">
                    {stat.change} from last month
                  </p>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-light text-brand-primary">
                  {Icon && <Icon className="w-5 h-5" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-border">
          <h3 className="font-heading text-base font-semibold text-brand-dark mb-1">
            Monthly Orders
          </h3>
          <p className="text-xs text-brand-body mb-6">
            Order count and revenue trends over the last 12 months
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#4B5563" }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#4B5563" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    fontSize: "13px",
                  }}
                />
                <Bar
                  dataKey="orders"
                  fill="#14833B"
                  radius={[6, 6, 0, 0]}
                  name="Orders"
                />
                <Bar
                  dataKey="revenue"
                  fill="#D4A017"
                  radius={[6, 6, 0, 0]}
                  name="Revenue (L)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Reports */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-border">
          <h3 className="font-heading text-base font-semibold text-brand-dark mb-1">
            Monthly Field Reports
          </h3>
          <p className="text-xs text-brand-body mb-6">
            Field visit reports submitted over the last 12 months
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyReportsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#4B5563" }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#4B5563" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    fontSize: "13px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="reports"
                  stroke="#2A9D4B"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#2A9D4B" }}
                  activeDot={{ r: 6 }}
                  name="Reports"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
