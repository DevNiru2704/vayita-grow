import { ClipboardList, FileText, ShoppingCart, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { getSession } from "@/lib/auth/session";
import { company } from "@/lib/config/company";
import { paramString } from "@/lib/url";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Portal Login",
  description: "Sign in to the VayitaGrow internal management portal.",
  robots: { index: false, follow: false },
};

const portalFeatures = [
  { icon: Users, label: "Client & dealer records" },
  { icon: ShoppingCart, label: "Orders, payments & deliveries" },
  { icon: FileText, label: "Account statements" },
  { icon: ClipboardList, label: "Field visit reports" },
];

export default async function LoginPage(props: PageProps<"/login">) {
  // Already signed in? Straight to the portal.
  if (await getSession()) redirect("/dashboard");

  const searchParams = await props.searchParams;
  const from = paramString(searchParams, "from");

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-brand-950 p-10 text-white lg:flex">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(50rem_28rem_at_20%_110%,rgba(42,157,75,0.3),transparent)]"
        />
        <Link
          href="/"
          className="relative flex w-fit items-center gap-2 rounded-md focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
        >
          <BrandLogo height={42} inverted />
          <span className="font-display text-xl font-semibold">
            {company.shortName} Bioorganics
          </span>
        </Link>

        <div className="relative max-w-md space-y-6">
          <h1 className="text-3xl leading-snug tracking-tight text-balance">
            One portal for the whole operation
          </h1>
          <p className="text-sm leading-relaxed text-brand-200">
            Clients, orders, statements, field reports, inventory, and the product catalog -
            managed in one place by the {company.shortName} team.
          </p>
          <ul className="space-y-3">
            {portalFeatures.map((feature) => (
              <li key={feature.label} className="flex items-center gap-3 text-sm text-brand-100">
                <span className="flex size-8 items-center justify-center rounded-lg bg-white/10">
                  <feature.icon aria-hidden className="size-4" />
                </span>
                {feature.label}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-brand-300">
          © {new Date().getFullYear()} {company.legalName}
        </p>
      </section>

      {/* Form panel */}
      <section className="flex items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <Link
              href="/"
              className="mb-6 flex w-fit items-center gap-2 rounded-md lg:hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <BrandLogo height={36} />
              <span className="font-display text-lg font-semibold">
                {company.shortName} Bioorganics
              </span>
            </Link>
            <h2 className="font-sans text-2xl font-semibold tracking-tight">Portal sign in</h2>
            <p className="text-sm text-muted-foreground">
              For {company.shortName} staff and administrators.
            </p>
          </div>

          <LoginForm from={from} />

          <div className="rounded-lg border bg-muted/50 p-4 text-sm leading-relaxed text-muted-foreground">
            <p className="font-medium text-foreground">Restricted access</p>
            <p className="mt-1">
              This portal is intended for {company.shortName} administrators and staff only. If you
              are a dealer, distributor, or customer, please return to our website to{" "}
              <Link
                href="/contact"
                className="rounded-sm font-medium text-brand-600 underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                submit an enquiry
              </Link>{" "}
              or{" "}
              <Link
                href="/feedback"
                className="rounded-sm font-medium text-brand-600 underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                share your feedback
              </Link>
              .
            </p>
          </div>

          <p className="text-center text-sm">
            <Link
              href="/"
              className="rounded-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              Back to website
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
