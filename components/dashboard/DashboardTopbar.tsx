"use client";

import { ChevronDown, ExternalLink, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { logoutDemo } from "@/lib/actions/auth";
import { company } from "@/lib/config/company";
import { enumLabel } from "@/lib/types/database";
import type { SessionUser } from "@/lib/types/user";
import { cn } from "@/lib/utils";

export function DashboardTopbar({ user }: { user: SessionUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b bg-background/90 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-2">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            className={cn(buttonVariants({ variant: "outline", size: "icon-lg" }), "lg:hidden")}
            aria-label="Open navigation"
          >
            <Menu aria-hidden className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 overflow-y-auto p-0">
            <SheetHeader className="border-b">
              <SheetTitle className="flex items-center gap-2 text-left">
                <BrandLogo height={28} />
                {company.shortName} Portal
              </SheetTitle>
            </SheetHeader>
            <DashboardSidebar role={user.role} onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        <Link
          href="/dashboard"
          className="hidden items-center gap-2 rounded-md lg:flex focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <BrandLogo height={30} />
          <span className="font-display text-base font-semibold">
            {company.shortName} <span className="font-sans text-sm font-medium text-muted-foreground">Portal</span>
          </span>
        </Link>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "gap-2 px-2")}
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 uppercase">
            {user.username.slice(0, 2)}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm leading-tight font-medium">{user.username}</span>
            <span className="block text-xs leading-tight text-muted-foreground capitalize">
              {enumLabel(user.role)}
            </span>
          </span>
          <ChevronDown aria-hidden className="size-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              Signed in as <span className="font-medium">{user.username}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/" />}>
              <ExternalLink aria-hidden />
              View public website
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                void logoutDemo();
              }}
            >
              <LogOut aria-hidden />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
