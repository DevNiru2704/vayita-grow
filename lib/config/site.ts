/**
 * Site-wide configuration: canonical URL and default metadata values.
 * NEXT_PUBLIC_SITE_URL should be set in production; the fallback is a
 * placeholder domain pending the client's final domain purchase.
 */
export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vayitagrow.com",
  name: "VayitaGrow Bioorganics",
  defaultTitle: "VayitaGrow Bioorganics - Sustainable Agricultural Solutions",
  titleTemplate: "%s | VayitaGrow Bioorganics",
  description:
    "VAYITAGROW BIOORGANICS PRIVATE LIMITED manufactures and markets bioorganic agricultural inputs - plant growth promoters, organic fertilizers, soil conditioners, and crop nutrition products - supporting sustainable farming across West Bengal and Jharkhand.",
} as const;
