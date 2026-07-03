import { Compass } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-brand-100 text-brand-600">
        <Compass aria-hidden className="size-7" />
      </span>
      <div className="space-y-2">
        <p className="text-sm font-semibold tracking-wide text-brand-600 uppercase">404</p>
        <h1 className="text-3xl tracking-tight">Page not found</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          The page you are looking for does not exist or may have moved. Try the homepage or
          browse our products.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          Go to homepage
        </Link>
        <Link href="/products" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
          Browse products
        </Link>
      </div>
    </main>
  );
}
