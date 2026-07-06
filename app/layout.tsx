import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/lib/config/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/vayitagrow_logo.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/vayitagrow_logo.svg" }],
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${fraunces.variable} h-full`}
    >
      {/* suppressHydrationWarning: browser extensions (ColorZilla, Demoway, …)
          inject attributes into <body> before React hydrates; this silences
          that false-positive mismatch for the body element only. */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
