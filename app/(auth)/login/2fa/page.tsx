import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { getChallenge } from "@/lib/auth/session";
import { company } from "@/lib/config/company";
import { paramString } from "@/lib/url";
import { TwoFactorForm } from "./two-factor-form";

export const metadata: Metadata = {
  title: "Two-factor authentication",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function TwoFactorPage({ searchParams }: Props) {
  const challenge = await getChallenge();
  if (!challenge) redirect("/login");

  const from = paramString(await searchParams, "from");

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16 sm:px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-3">
          <Link
            href="/"
            className="flex w-fit items-center gap-2 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <BrandLogo height={36} />
            <span className="font-display text-lg font-semibold">{company.shortName} Bioorganics</span>
          </Link>
          <div className="flex items-center gap-2 pt-2">
            <ShieldCheck aria-hidden className="size-5 text-brand-600" />
            <h1 className="font-sans text-2xl font-semibold tracking-tight">Two-factor verification</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code from your authenticator app to finish signing in as{" "}
            <span className="font-medium text-foreground">{challenge.user.username}</span>.
          </p>
        </div>

        <TwoFactorForm expiresAt={challenge.exp * 1000} from={from} />

        <p className="text-center text-sm">
          <Link
            href="/login"
            className="rounded-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            Cancel and sign in again
          </Link>
        </p>
      </div>
    </main>
  );
}
