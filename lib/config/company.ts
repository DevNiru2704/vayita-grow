/**
 * Single source of truth for company facts shown anywhere on the site.
 *
 * Facts below marked PLACEHOLDER are pending delivery from the client
 * (Rajiv Pal / Manish) and must be replaced before production launch.
 * Everything else is verifiable from docs/project_details/.
 */
export const company = {
  legalName: "VAYITAGROW BIOORGANICS PRIVATE LIMITED",
  displayName: "VayitaGrow Bioorganics",
  shortName: "VayitaGrow",
  tagline: "Sustainable Agricultural Solutions for Modern Farming",
  supportingMessage:
    "Delivering quality agricultural inputs through innovation, reliability, and strong field support.",
  industry: "Agricultural Inputs Manufacturing and Marketing",
  businessModel: "B2B",
  operatingStates: ["West Bengal", "Jharkhand"] as const,
  registeredState: "Jharkhand",
  contact: {
    // PLACEHOLDER - full registered address (Jharkhand) pending from client.
    addressLines: ["Registered Office", "Jharkhand, India"],
    // PLACEHOLDER - office landline pending from client.
    landline: "+91 00000 00000",
    // PLACEHOLDER - business mobile numbers pending from client.
    mobile: "+91 00000 00000",
    // PLACEHOLDER - official email pending from client.
    email: "info@vayitagrow.com",
    hours: "Monday - Saturday, 9:00 AM - 6:00 PM IST",
  },
} as const;

export type OperatingState = (typeof company.operatingStates)[number];
