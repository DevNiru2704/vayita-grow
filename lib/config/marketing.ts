import {
  Activity,
  Award,
  FlaskConical,
  Flower2,
  Handshake,
  Heart,
  Leaf,
  Lightbulb,
  Maximize,
  Mountain,
  Scale,
  ShieldCheck,
  Sprout,
  Truck,
  Users,
  Waves,
  Wheat,
  type LucideIcon,
} from "lucide-react";

/**
 * Public-site marketing copy - company positioning drafted by the developer
 * from docs/project_details/ (explicitly authorized by the client). Contains
 * NO invented statistics, certifications, testimonials, or people.
 */

export interface ValuePillar {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const whyChooseUs: ValuePillar[] = [
  {
    title: "Quality Manufacturing",
    description:
      "Products are manufactured under careful quality control so that every batch reaching a dealer's counter performs consistently in the field.",
    icon: ShieldCheck,
  },
  {
    title: "Science-Led Formulations",
    description:
      "Each formulation is built around well-understood agricultural inputs - humic substances, amino acids, seaweed extracts, and beneficial enzymes.",
    icon: FlaskConical,
  },
  {
    title: "Farmer-Focused Support",
    description:
      "Field teams visit dealers and farms, demonstrate correct application, and carry feedback from the ground back into the product range.",
    icon: Users,
  },
  {
    title: "Dependable Distribution",
    description:
      "A growing dealer and distributor network across West Bengal and Jharkhand, supported by planned dispatch and delivery tracking.",
    icon: Truck,
  },
];

export const coreValues: ValuePillar[] = [
  {
    title: "Quality First",
    description:
      "No compromise on product standards - quality is checked at every stage from raw material to packed product.",
    icon: Award,
  },
  {
    title: "Sustainability",
    description:
      "Bioorganic inputs designed to support long-term soil health and ecological balance, not just a single season's yield.",
    icon: Leaf,
  },
  {
    title: "Innovation",
    description:
      "Continuous improvement of formulations based on field results and established agricultural science.",
    icon: Lightbulb,
  },
  {
    title: "Farmer Welfare",
    description:
      "Business decisions are weighed against their impact on farmer productivity and profitability.",
    icon: Heart,
  },
  {
    title: "Integrity",
    description:
      "Honest product claims, transparent dealings, and fair terms with every dealer, distributor, and farmer.",
    icon: ShieldCheck,
  },
  {
    title: "Partnership",
    description:
      "Long-term relationships with the dealer network built on mutual trust and shared growth.",
    icon: Handshake,
  },
];

/** Fallback icon for product categories without a specific mapping. */
export const DEFAULT_CATEGORY_ICON: LucideIcon = Sprout;

export const categoryIcons: Record<string, LucideIcon> = {
  "Natural Plant Growth Promoter": Leaf,
  "Amino Acid Enriched Liquid Nutrient": FlaskConical,
  "Leaf Growth Promoter": Sprout,
  "Flowering Promoter": Flower2,
  "100% Organic Fertilizer": Wheat,
  "Soil pH Regulator": Scale,
  "Soil Conditioner Powder": Mountain,
  "Organic Enzyme": Activity,
  "Silicone-Based Spreader & Activator": Maximize,
  "Seaweed-Based Enriched Mixed Granules": Waves,
};
