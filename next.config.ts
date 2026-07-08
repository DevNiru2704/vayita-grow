import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/**
 * Content-Security-Policy. Applied in production only — Turbopack's dev HMR
 * relies on eval/inline that a strict policy would block. 'unsafe-inline' is
 * kept for scripts/styles because Next's hydration bootstrap and Tailwind's
 * injected styles are inline; everything else is locked to same-origin plus the
 * Cloudinary image CDN.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  ...(isProd
    ? [
        { key: "Content-Security-Policy", value: csp },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  // Product images are hosted on Cloudinary (secure URLs stored in the DB);
  // local /public assets remain the demo fallback.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  experimental: {
    // Persist Turbopack's dev compilation cache to disk instead of holding
    // every recompile generation in memory — keeps long `next dev` sessions
    // (especially during heavy refactors) from ballooning the JS heap.
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
