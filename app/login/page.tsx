"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo login - just navigate to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-dark via-[#1a3a2a] to-brand-dark relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-brand-primary rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-brand-secondary rounded-full blur-[120px]" />
        </div>

        <div className="relative flex flex-col items-center justify-center w-full px-16">
          <div className="w-20 h-20 rounded-2xl bg-brand-primary/20 flex items-center justify-center mb-6">
            <Leaf className="w-10 h-10 text-brand-secondary" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-white text-center mb-4">
            VayitaGrow BioOrganics
          </h2>
          <p className="text-gray-400 text-center max-w-sm leading-relaxed">
            Access your business management portal. Track orders, manage clients,
            view statements, and monitor field operations.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-xs">
            {[
              { label: "Clients", value: "127" },
              { label: "Orders", value: "42" },
              { label: "States", value: "10+" },
              { label: "Products", value: "50+" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10"
              >
                <p className="font-heading text-xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-brand-primary text-white flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading text-base font-bold text-brand-dark block leading-tight">
                VayitaGrow
              </span>
              <span className="text-[10px] text-brand-body tracking-wider uppercase">
                BioOrganics
              </span>
            </div>
          </div>

          <h1 className="font-heading text-2xl font-bold text-brand-dark mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-brand-body mb-8">
            Sign in to your management portal
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-brand-dark mb-1.5"
              >
                Email Address
              </label>
              <Input
                id="login-email"
                type="email"
                placeholder="admin@vayitagrow.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl h-11"
              />
            </div>
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-brand-dark mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-xl h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-body hover:text-brand-dark transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-secondary text-white rounded-xl h-11 text-sm font-medium"
            >
              Sign In
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 rounded-2xl bg-brand-section border border-brand-border">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-brand-primary" />
              <span className="text-sm font-semibold text-brand-dark">
                Demo Credentials
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-brand-body">Admin:</span>
                <span className="font-medium text-brand-dark font-mono text-xs">
                  admin@vayitagrow.com
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-body">Sub Admin:</span>
                <span className="font-medium text-brand-dark font-mono text-xs">
                  subadmin@vayitagrow.com
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-body">Password:</span>
                <span className="font-medium text-brand-dark font-mono text-xs">
                  password123
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
