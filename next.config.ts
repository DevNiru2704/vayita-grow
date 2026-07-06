import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // All imagery is served from /public — no remote image hosts needed.
  experimental: {
    // Persist Turbopack's dev compilation cache to disk instead of holding
    // every recompile generation in memory — keeps long `next dev` sessions
    // (especially during heavy refactors) from ballooning the JS heap.
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
