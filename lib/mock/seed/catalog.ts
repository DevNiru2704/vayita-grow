import type { Product, ProductCategory, ProductDetails } from "@/lib/types/catalog";

/**
 * REAL PRODUCT DATA - translated from the client's Bengali leaflets.
 * Do not alter names, descriptions, benefits, dosage, composition, or pack
 * sizes without client approval. `basePrice` is DEMO-ONLY (dashboard/orders);
 * it is never rendered on the public site.
 */

export const seedCategories: ProductCategory[] = [
  { categoryId: 1, categoryName: "Natural Plant Growth Promoter", description: "Formulated with humic and fulvic acids to improve overall plant health, stress tolerance, and vigorous crop development.", createdAt: "2025-11-10T09:00:00.000Z" },
  { categoryId: 2, categoryName: "Amino Acid Enriched Liquid Nutrient", description: "A balanced liquid formulation that prevents nutrient deficiencies, improves flowering, and enhances fruit quality and yield.", createdAt: "2025-11-10T09:00:00.000Z" },
  { categoryId: 3, categoryName: "Leaf Growth Promoter", description: "Scientifically developed to increase chlorophyll content, accelerate photosynthesis, and promote vigorous foliage expansion.", createdAt: "2025-11-10T09:00:00.000Z" },
  { categoryId: 4, categoryName: "Flowering Promoter", description: "A highly effective stimulant that activates physiological processes to promote rapid, uniform flowering and reduce bud drop.", createdAt: "2025-11-10T09:00:00.000Z" },
  { categoryId: 5, categoryName: "100% Organic Fertilizer", description: "Prepared from natural materials to restore beneficial microorganisms, improve soil fertility, and provide balanced long-term nutrition.", createdAt: "2025-11-10T09:00:00.000Z" },
  { categoryId: 6, categoryName: "Soil pH Regulator", description: "Corrects acidic or alkaline soil imbalances to maintain optimal pH and significantly improve nutrient availability for roots.", createdAt: "2025-11-10T09:00:00.000Z" },
  { categoryId: 7, categoryName: "Soil Conditioner Powder", description: "Humic acid-based powder that enhances soil structure, improves water-holding capacity, and increases organic carbon.", createdAt: "2025-11-10T09:00:00.000Z" },
  { categoryId: 8, categoryName: "Organic Enzyme", description: "An organic soil activator that accelerates matter decomposition and increases beneficial biological activity in the soil.", createdAt: "2025-11-10T09:00:00.000Z" },
  { categoryId: 9, categoryName: "Silicone-Based Spreader & Activator", description: "A premium agricultural adjuvant that drastically improves the spreading, sticking, and absorption of foliar sprays.", createdAt: "2025-11-10T09:00:00.000Z" },
  { categoryId: 10, categoryName: "Seaweed-Based Enriched Mixed Granules", description: "Granular fertilizer rich in natural seaweed extracts and essential minerals to improve soil health and stimulate growth.", createdAt: "2025-11-10T09:00:00.000Z" },
];

export type SeedProduct = Product & { details: ProductDetails };

export const seedProducts: SeedProduct[] = [
  {
    productId: 1,
    name: "VEER-L",
    slug: "VEER-L",
    categoryId: 1,
    sku: "VG-VEER-L",
    basePrice: 450,
    imageUrl: "/products/VEER-L.jpg",
    createdAt: "2025-11-12T09:00:00.000Z",
    description:
      "Veer-L is a natural plant growth promoter formulated with humic acid, fulvic acid, and essential nutrients. Its synergistic action improves plant growth, overall plant health, and stress tolerance. It enhances nutrient availability and supports vigorous crop development, resulting in increased yield and better crop performance.",
    details: {
      shortDescription:
        "Enhances growth, strengthens plants, improves nutrient uptake, boosts yield, and resilience.",
      benefits: [
        "Promotes vigorous plant growth",
        "Enhances nutrient absorption efficiency",
        "Improves stress tolerance naturally",
        "Supports healthier crop development",
        "Increases yield and productivity",
      ],
      dosage: "All crops: 2-3 ml per liter of water",
      composition: "Humic Acid, Fulvic Acid: 25.05%",
      packSizes: ["100 ml", "250 ml", "500 ml", "1 Ltr"],
      imageCutoutUrl: "/products/VEER-L_rbg.png",
    },
  },
  {
    productId: 2,
    name: "VITA-A",
    slug: "VITA-A",
    categoryId: 2,
    sku: "VG-VITA-A",
    basePrice: 420,
    imageUrl: "/products/VITA-A.jpg",
    createdAt: "2025-11-12T09:00:00.000Z",
    description:
      "Vita-A is a balanced liquid nutrient enriched with amino acids and micronutrients. It helps prevent and correct nutrient deficiencies while promoting healthy growth. The formulation improves flowering, fruit setting, fruit size, color, and taste, resulting in higher-quality produce and increased productivity.",
    details: {
      shortDescription:
        "Enhances growth, corrects deficiencies, improves flowering, fruit quality, yield, and taste.",
      benefits: [
        "Corrects nutrient deficiencies effectively",
        "Promotes healthy plant growth",
        "Enhances flowering and fruiting",
        "Improves fruit size and color",
        "Boosts yield and produce quality",
      ],
      dosage: "All crops: 2-3 ml per liter of water",
      composition: null,
      packSizes: ["100 ml", "250 ml", "500 ml", "1 Ltr"],
      imageCutoutUrl: "/products/VITA-A_rbg.png",
    },
  },
  {
    productId: 3,
    name: "V-LEAF",
    slug: "V-LEAF",
    categoryId: 3,
    sku: "VG-V-LEAF",
    basePrice: 400,
    imageUrl: "/products/V-LEAF.jpg",
    createdAt: "2025-11-12T09:00:00.000Z",
    description:
      "V-Leaf is a scientifically developed leaf growth enhancer that promotes the formation of healthy and vigorous foliage. It improves cell division, nutrient absorption, and photosynthesis, leading to faster leaf expansion, increased chlorophyll content, and stronger plant growth. Healthy foliage contributes directly to improved crop productivity.",
    details: {
      shortDescription:
        "Enhances leaf growth, improves photosynthesis, and promotes vigorous, healthy foliage for better productivity.",
      benefits: [
        "Promotes vigorous leaf expansion",
        "Improves photosynthesis naturally",
        "Enhances nutrient absorption",
        "Increases chlorophyll content",
        "Boosts overall crop productivity",
      ],
      dosage: "All crops: 2-3 ml per liter of water",
      composition: null,
      packSizes: ["100 ml", "250 ml", "500 ml", "1 Ltr"],
      imageCutoutUrl: "/products/V-LEAF_rbg.png",
    },
  },
  {
    productId: 4,
    name: "V-BOOST",
    slug: "V-BOOST",
    categoryId: 4,
    sku: "VG-V-BOOST",
    basePrice: 380,
    imageUrl: "/products/V-BOOST.jpg",
    createdAt: "2025-11-12T09:00:00.000Z",
    description:
      "V-Boost is a highly effective flowering stimulant developed to promote rapid and uniform flowering. It activates the plant's natural physiological processes, resulting in improved bud formation, reduced flower drop, and healthier flowering. This helps maintain stronger flowers and better fruit-setting potential.",
    details: {
      shortDescription:
        "Stimulates rapid flowering, reduces flower drop, and improves fruit-setting potential.",
      benefits: [
        "Promotes rapid and uniform flowering",
        "Reduces unwanted flower drop",
        "Improves healthy bud formation",
        "Enhances fruit-setting potential",
        "Activates natural physiological processes",
      ],
      dosage: "10-15 drops per 15 liters of water",
      composition: "Natural phytohormones and other beneficial ingredients",
      packSizes: ["10 ml", "50 ml", "100 ml"],
      imageCutoutUrl: "/products/V-BOOST_rbg.png",
    },
  },
  {
    productId: 5,
    name: "JAIVIK GOLD",
    slug: "JAIVIK-GOLD",
    categoryId: 5,
    sku: "VG-JAIVIK-GOLD",
    basePrice: 550,
    imageUrl: "/products/JAIVIK-gold.jpg",
    createdAt: "2025-11-12T09:00:00.000Z",
    description:
      "Jaivik Gold is a 100% natural organic fertilizer prepared from well-decomposed organic materials. It improves soil fertility, restores beneficial microorganisms, and provides long-lasting balanced nutrition. Suitable for field crops, horticulture, gardens, nurseries, and organic farming systems.",
    details: {
      shortDescription:
        "100% natural organic fertilizer that improves soil fertility and provides long-lasting balanced nutrition.",
      benefits: [
        "Improves overall soil fertility",
        "Restores beneficial microorganisms",
        "Provides long-lasting balanced nutrition",
        "100% natural and organic composition",
        "Suitable for all farming systems",
      ],
      dosage: "200-300 kg per acre",
      composition: null,
      packSizes: ["50 kg", "1 kg"],
      imageCutoutUrl: "/products/JAIVIK-GOLD_rbg.png",
    },
  },
  {
    productId: 6,
    name: "VEER-P",
    slug: "VEER-P",
    categoryId: 7,
    sku: "VG-VEER-P",
    basePrice: 350,
    imageUrl: "/products/VEER-P.jpg",
    createdAt: "2025-11-12T09:00:00.000Z",
    description:
      "Veer-P is a humic acid-based soil conditioner designed to improve soil structure and increase organic carbon content. It enhances nutrient retention, improves water-holding capacity, increases soil aeration, and promotes healthy root-zone development. Regular use supports overall soil health and crop productivity.",
    details: {
      shortDescription:
        "Humic acid-based soil conditioner that enhances soil structure, nutrient retention, and root development.",
      benefits: [
        "Improves soil structure and aeration",
        "Increases organic carbon content",
        "Enhances water-holding capacity",
        "Promotes healthy root-zone development",
        "Supports long-term soil health",
      ],
      dosage: "All crops: 1 kg per acre",
      composition: "Humic Acid: 75%, Fulvic Acid: 8%, Potassium: 6%, Moisture: 10%",
      packSizes: ["1 kg"],
      imageCutoutUrl: "/products/VEER-P_rbg.png",
    },
  },
  {
    productId: 7,
    name: "V-pH",
    slug: "V-PH",
    categoryId: 6,
    sku: "VG-V-PH",
    basePrice: 300,
    imageUrl: "/products/V-PH.jpg",
    createdAt: "2025-11-12T09:00:00.000Z",
    description:
      "V-pH helps regulate soil pH and maintain proper soil balance. It assists in correcting acidic or alkaline soil conditions, improving nutrient availability and root efficiency. Continuous use supports healthy soil development and creates favorable conditions for higher crop yields.",
    details: {
      shortDescription:
        "Regulates soil pH, corrects acidic or alkaline imbalances, and improves nutrient availability.",
      benefits: [
        "Regulates and maintains proper soil pH",
        "Corrects acidic and alkaline conditions",
        "Improves vital nutrient availability",
        "Enhances root system efficiency",
        "Creates favorable conditions for high yields",
      ],
      dosage: "All crops: 3-5 kg per bigha",
      composition: null,
      packSizes: ["1 kg", "5 kg"],
      imageCutoutUrl: "/products/V-PH_rbg.png",
    },
  },
  {
    productId: 8,
    name: "V-RICH",
    slug: "V-RICH",
    categoryId: 10,
    sku: "VG-V-RICH",
    basePrice: 320,
    imageUrl: "/products/V-RICH.jpg",
    createdAt: "2025-11-12T09:00:00.000Z",
    description:
      "V-Rich is a premium seaweed-based granular fertilizer prepared from naturally derived seaweed extracts. It contains valuable minerals, organic matter, calcium, magnesium, and humic substances that improve soil health, enhance nutrient uptake, and stimulate plant growth. Suitable for all types of crops.",
    details: {
      shortDescription:
        "Premium seaweed granules that improve soil health, stimulate growth, and enhance nutrient uptake.",
      benefits: [
        "Improves overall soil health",
        "Enhances nutrient uptake efficiency",
        "Stimulates vigorous plant growth",
        "Rich in essential minerals and organic matter",
        "Suitable for all types of crops",
      ],
      dosage: "All crops: 3-5 kg per acre",
      composition: null,
      packSizes: ["1 kg"],
      imageCutoutUrl: "/products/V-RICH_rbg.png",
    },
  },
  {
    productId: 9,
    name: "JYME-VITA",
    slug: "JYME-VITA",
    categoryId: 8,
    sku: "VG-JYME-VITA",
    basePrice: 600,
    imageUrl: "/products/JYME-VITA.jpg",
    createdAt: "2025-11-12T09:00:00.000Z",
    description:
      "Jyme-Vita is an organic enzyme-based soil activator designed to increase biological activity in the soil. It contains naturally derived enzymes and nutrients that stimulate beneficial microorganisms, accelerate decomposition of organic matter, and improve nutrient utilization. It strengthens plants and promotes healthy growth and productivity.",
    details: {
      shortDescription:
        "Organic soil activator that stimulates microorganisms, accelerates decomposition, and improves nutrient utilization.",
      benefits: [
        "Increases soil biological activity",
        "Stimulates beneficial microorganisms",
        "Accelerates organic matter decomposition",
        "Improves nutrient utilization efficiency",
        "Strengthens plants for healthy growth",
      ],
      dosage: "All crops: 10-15 kg per acre",
      composition: null,
      packSizes: ["10 kg"],
      imageCutoutUrl: "/products/JYME-VITA_rbg.png",
    },
  },
  {
    productId: 10,
    name: "V-FIX",
    slug: "V-FIX",
    categoryId: 9,
    sku: "VG-V-FIX",
    basePrice: 480,
    imageUrl: "/products/V-FIX.jpg",
    createdAt: "2025-11-12T09:00:00.000Z",
    description:
      "V-Fix is a silicone-based non-ionic agricultural adjuvant used along with pesticides and foliar sprays. It improves the spreading, sticking, and absorption of insecticides, fungicides, herbicides, and nutrients on plant surfaces. This results in better spray coverage, enhanced effectiveness, and improved crop protection.",
    details: {
      shortDescription:
        "Silicone-based adjuvant that improves spreading, sticking, and absorption of foliar sprays.",
      benefits: [
        "Improves spray spreading and sticking",
        "Enhances absorption of foliar sprays",
        "Increases effectiveness of pesticides",
        "Provides better uniform spray coverage",
        "Improves overall crop protection",
      ],
      dosage: "All crops: 5 ml per liter of water",
      composition: null,
      packSizes: ["100 ml", "250 ml", "500 ml", "1 Ltr"],
      imageCutoutUrl: "/products/V-FIX_rbg.png",
    },
  },
];
