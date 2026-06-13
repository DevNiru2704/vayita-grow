"use client";

import { Building2, User, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-brand-dark mb-1">
          Settings
        </h1>
        <p className="text-sm text-brand-body">
          Manage your company, profile, and notification settings.
        </p>
      </div>

      <div className="space-y-6">
        {/* Company Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center">
              <Building2 className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-brand-dark">
                Company Settings
              </h2>
              <p className="text-xs text-brand-body">
                Manage company information and business details
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">
                Company Name
              </label>
              <Input
                defaultValue="VayitaGrow BioOrganics Pvt. Ltd."
                className="rounded-xl h-11"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">
                Registration Number
              </label>
              <Input
                defaultValue="U01100WB2024PTC123456"
                className="rounded-xl h-11"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">
                GST Number
              </label>
              <Input
                defaultValue="19AABCV1234A1Z5"
                className="rounded-xl h-11"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">
                Business Phone
              </label>
              <Input
                defaultValue="+91 9876543210"
                className="rounded-xl h-11"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-brand-dark mb-1.5">
                Registered Address
              </label>
              <Input
                defaultValue="Kolkata, West Bengal, India"
                className="rounded-xl h-11"
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <Button className="bg-brand-primary hover:bg-brand-secondary text-white rounded-xl px-6 h-10 text-sm font-medium">
              Save Changes
            </Button>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center">
              <User className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-brand-dark">
                Profile Settings
              </h2>
              <p className="text-xs text-brand-body">
                Update your personal information and credentials
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">
                Full Name
              </label>
              <Input defaultValue="Admin User" className="rounded-xl h-11" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">
                Email
              </label>
              <Input
                defaultValue="admin@vayitagrow.com"
                className="rounded-xl h-11"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">
                Phone
              </label>
              <Input
                defaultValue="+91 9876543210"
                className="rounded-xl h-11"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">
                Role
              </label>
              <Input
                defaultValue="Administrator"
                className="rounded-xl h-11"
                disabled
              />
            </div>
          </div>
          <Separator className="my-5" />
          <h3 className="text-sm font-semibold text-brand-dark mb-4">
            Change Password
          </h3>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">
                Current Password
              </label>
              <Input
                type="password"
                placeholder="Enter current password"
                className="rounded-xl h-11"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">
                New Password
              </label>
              <Input
                type="password"
                placeholder="Enter new password"
                className="rounded-xl h-11"
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <Button className="bg-brand-primary hover:bg-brand-secondary text-white rounded-xl px-6 h-10 text-sm font-medium">
              Update Profile
            </Button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center">
              <Bell className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-brand-dark">
                Notification Settings
              </h2>
              <p className="text-xs text-brand-body">
                Configure how and when you receive notifications
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              {
                title: "Order Notifications",
                description: "Get notified when new orders are placed or status changes",
                enabled: true,
              },
              {
                title: "Client Updates",
                description: "Receive alerts for new client registrations and updates",
                enabled: true,
              },
              {
                title: "Field Report Alerts",
                description: "Get notified when new field reports are submitted",
                enabled: true,
              },
              {
                title: "Statement Reminders",
                description: "Receive reminders for pending statement generation",
                enabled: false,
              },
              {
                title: "Weekly Summary",
                description: "Receive a weekly summary of business operations",
                enabled: true,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between p-4 rounded-xl bg-brand-section border border-brand-border"
              >
                <div>
                  <p className="text-sm font-medium text-brand-dark">
                    {item.title}
                  </p>
                  <p className="text-xs text-brand-body mt-0.5">
                    {item.description}
                  </p>
                </div>
                <div
                  className={`w-10 h-6 rounded-full flex items-center cursor-pointer transition-colors ${
                    item.enabled ? "bg-brand-primary" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                      item.enabled ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-end">
            <Button className="bg-brand-primary hover:bg-brand-secondary text-white rounded-xl px-6 h-10 text-sm font-medium">
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
