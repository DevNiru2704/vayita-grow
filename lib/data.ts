// =============================================
// VAYITAGROW BIOORGANICS - ALL DUMMY DATA
// =============================================

// ---------- STATS ----------
export const companyStats = [
  { label: "Dealers", value: "150+", description: "Active dealer partners" },
  { label: "Products", value: "50+", description: "Agricultural solutions" },
  { label: "States Served", value: "10+", description: "Pan-India presence" },
  { label: "Farmers Reached", value: "5000+", description: "Growing community" },
];

// ---------- PRODUCT CATEGORIES ----------
export type ProductCategory =
  | "All"
  | "Bio Fertilizers"
  | "Organic Fertilizers"
  | "Growth Promoters"
  | "Micronutrients"
  | "Soil Conditioners"
  | "Crop Protection";

export const productCategories: {
  name: ProductCategory;
  description: string;
  icon: string;
}[] = [
  {
    name: "Bio Fertilizers",
    description:
      "Microbial-based fertilizers that enhance soil fertility through natural nitrogen fixation and phosphate solubilization.",
    icon: "Leaf",
  },
  {
    name: "Organic Fertilizers",
    description:
      "Naturally derived nutrient formulations that improve soil structure, water retention, and long-term crop productivity.",
    icon: "Sprout",
  },
  {
    name: "Growth Promoters",
    description:
      "Plant growth regulators and bio-stimulants that boost root development, flowering, and overall plant vigour.",
    icon: "TrendingUp",
  },
  {
    name: "Micronutrients",
    description:
      "Essential trace element formulations that prevent nutrient deficiencies and support balanced crop nutrition.",
    icon: "Droplets",
  },
  {
    name: "Soil Conditioners",
    description:
      "Advanced soil amendment solutions that restore soil health, improve aeration, and maintain optimal pH balance.",
    icon: "Mountain",
  },
  {
    name: "Crop Protection",
    description:
      "Bio-based crop protection solutions that safeguard crops from pests and diseases while maintaining ecological balance.",
    icon: "ShieldCheck",
  },
];

// ---------- PRODUCTS ----------
export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  shortDescription: string;
  benefits: string[];
  applicationMethod: string;
  recommendedUsage: string;
  packSizes: string[];
  image: string;
}

export const products: Product[] = [
  {
    id: "1",
    slug: "vitagrow-bio-boost",
    name: "VitaGrow Bio Boost",
    category: "Bio Fertilizers",
    description:
      "VitaGrow Bio Boost is a premium microbial consortium fertilizer that contains beneficial bacteria and fungi to enhance soil fertility naturally. It promotes nitrogen fixation, phosphate solubilization, and potash mobilization, leading to improved nutrient availability for crops. Ideal for all types of agricultural and horticultural crops.",
    shortDescription:
      "Premium microbial consortium fertilizer for enhanced soil fertility and nutrient availability.",
    benefits: [
      "Enhances nitrogen fixation in soil",
      "Improves phosphorus availability to plants",
      "Stimulates root growth and development",
      "Reduces dependency on chemical fertilizers",
      "Safe for soil micro-ecosystem",
    ],
    applicationMethod:
      "Mix 2-3 kg per acre with farm yard manure or compost and apply near the root zone. Can also be used as seed treatment at 10g per kg of seed.",
    recommendedUsage:
      "Apply during land preparation or within 15 days of sowing. Suitable for all field crops, vegetables, fruits, and plantation crops.",
    packSizes: ["500g", "1 kg", "5 kg", "25 kg"],
    image: "/products/bio-boost.jpg",
  },
  {
    id: "2",
    slug: "vitagrow-rootmax",
    name: "VitaGrow RootMax",
    category: "Bio Fertilizers",
    description:
      "VitaGrow RootMax is a specialized root development bio-fertilizer enriched with Mycorrhizal fungi and Trichoderma viride. It forms a symbiotic relationship with plant roots, expanding the root surface area for better water and nutrient absorption. Particularly effective in transplanted crops.",
    shortDescription:
      "Mycorrhizal root development bio-fertilizer for superior nutrient uptake.",
    benefits: [
      "Expands root surface area by up to 40%",
      "Enhances water absorption efficiency",
      "Improves transplant survival rate",
      "Strengthens plant resistance to root diseases",
      "Promotes early establishment of seedlings",
    ],
    applicationMethod:
      "Apply 1-2 kg per acre through drip irrigation or soil drenching near the root zone at the time of transplanting.",
    recommendedUsage:
      "Best suited for transplanted crops including tomato, chilli, brinjal, capsicum, and flower crops.",
    packSizes: ["250g", "500g", "1 kg", "5 kg"],
    image: "/products/rootmax.jpg",
  },
  {
    id: "3",
    slug: "vitagrow-soilcare",
    name: "VitaGrow SoilCare",
    category: "Soil Conditioners",
    description:
      "VitaGrow SoilCare is an advanced soil conditioning formulation that restores degraded soils. It contains humic acid, fulvic acid, and beneficial microorganisms that improve soil structure, water holding capacity, and cation exchange capacity. Essential for intensive farming areas.",
    shortDescription:
      "Advanced soil conditioner with humic and fulvic acids for soil restoration.",
    benefits: [
      "Improves soil organic carbon content",
      "Enhances water holding capacity of sandy soils",
      "Improves drainage in clayey soils",
      "Increases cation exchange capacity",
      "Restores soil microbial diversity",
    ],
    applicationMethod:
      "Broadcast 5-10 kg per acre and incorporate into soil during land preparation. Can also be applied through drip irrigation at 2 kg per acre.",
    recommendedUsage:
      "Recommended for all soil types, especially degraded and intensive farming soils. Apply every season for best results.",
    packSizes: ["1 kg", "5 kg", "10 kg", "25 kg"],
    image: "/products/soilcare.jpg",
  },
  {
    id: "4",
    slug: "vitagrow-greenlife",
    name: "VitaGrow GreenLife",
    category: "Organic Fertilizers",
    description:
      "VitaGrow GreenLife is a complete organic nutrition package derived from neem cake, castor cake, and bone meal. Enriched with essential macro and micronutrients, it provides sustained release nutrition throughout the crop cycle while improving soil health organically.",
    shortDescription:
      "Complete organic nutrition package with sustained-release formula for all crops.",
    benefits: [
      "Provides complete NPK nutrition organically",
      "Sustained nutrient release over 45-60 days",
      "Improves soil texture and fertility",
      "Natural pest repellent properties from neem",
      "Safe for organic farming certification",
    ],
    applicationMethod:
      "Apply 50-100 kg per acre as basal dose during land preparation. For standing crops, apply 25 kg per acre as top dressing near the plant base.",
    recommendedUsage:
      "Suitable for all crops including cereals, pulses, oilseeds, vegetables, fruits, and plantation crops.",
    packSizes: ["5 kg", "10 kg", "25 kg", "50 kg"],
    image: "/products/greenlife.jpg",
  },
  {
    id: "5",
    slug: "vitagrow-cropshield",
    name: "VitaGrow CropShield",
    category: "Crop Protection",
    description:
      "VitaGrow CropShield is a bio-based crop protection solution formulated with Pseudomonas fluorescens and Bacillus subtilis. It provides broad-spectrum protection against fungal and bacterial diseases while being completely safe for beneficial insects and the environment.",
    shortDescription:
      "Bio-based broad-spectrum crop protection against fungal and bacterial diseases.",
    benefits: [
      "Controls major fungal diseases like blight and wilt",
      "Prevents bacterial leaf spot and canker",
      "Safe for pollinators and beneficial insects",
      "No pre-harvest interval restrictions",
      "Compatible with organic farming practices",
    ],
    applicationMethod:
      "Foliar spray at 3-5 ml per litre of water. Apply in the morning or evening for best results. Repeat every 10-15 days during disease-prone periods.",
    recommendedUsage:
      "Suitable for all crops. Start preventive application from 30 days after sowing or at the first sign of disease symptoms.",
    packSizes: ["250 ml", "500 ml", "1 litre", "5 litres"],
    image: "/products/cropshield.jpg",
  },
  {
    id: "6",
    slug: "vitagrow-nutri-zinc",
    name: "VitaGrow Nutri Zinc",
    category: "Micronutrients",
    description:
      "VitaGrow Nutri Zinc is a chelated zinc micronutrient formulation designed to prevent and correct zinc deficiency in crops. Zinc plays a crucial role in enzyme activation, protein synthesis, and auxin metabolism. Essential for rice, wheat, maize, and fruit crops.",
    shortDescription:
      "Chelated zinc micronutrient for correcting zinc deficiency and boosting yield.",
    benefits: [
      "Corrects zinc deficiency symptoms within 7-10 days",
      "Improves grain filling and seed quality",
      "Enhances enzyme activity and photosynthesis",
      "Increases resistance to environmental stress",
      "Compatible with most pesticides and fungicides",
    ],
    applicationMethod:
      "Foliar spray at 2-3 g per litre of water. For soil application, mix 5 kg per acre with sand and broadcast uniformly.",
    recommendedUsage:
      "Apply at tillering stage in cereals, flowering stage in pulses, and fruit development stage in horticultural crops.",
    packSizes: ["100g", "250g", "500g", "1 kg"],
    image: "/products/nutri-zinc.jpg",
  },
  {
    id: "7",
    slug: "vitagrow-bloom-plus",
    name: "VitaGrow Bloom Plus",
    category: "Growth Promoters",
    description:
      "VitaGrow Bloom Plus is a premium plant growth promoter enriched with seaweed extract, amino acids, and plant hormones. It enhances flowering, fruit setting, and overall crop yield. The formulation stimulates natural plant growth processes for healthier and more productive crops.",
    shortDescription:
      "Seaweed-based growth promoter for enhanced flowering and fruit setting.",
    benefits: [
      "Increases flowering by 25-30%",
      "Improves fruit setting and retention",
      "Enhances crop quality and shelf life",
      "Provides natural stress tolerance",
      "Rich in natural cytokinins and auxins",
    ],
    applicationMethod:
      "Foliar spray at 2-3 ml per litre of water at pre-flowering and post-flowering stages. Can also be applied through drip at 1 litre per acre.",
    recommendedUsage:
      "Ideal for flowering and fruiting crops including tomato, chilli, brinjal, mango, citrus, pomegranate, and flower crops.",
    packSizes: ["250 ml", "500 ml", "1 litre", "5 litres"],
    image: "/products/bloom-plus.jpg",
  },
  {
    id: "8",
    slug: "vitagrow-organic-gold",
    name: "VitaGrow Organic Gold",
    category: "Organic Fertilizers",
    description:
      "VitaGrow Organic Gold is a premium vermicompost-based organic fertilizer enriched with bio-active substances. Produced through controlled vermicomposting processes, it provides a rich source of humus, plant nutrients, and growth hormones in a readily available form.",
    shortDescription:
      "Premium vermicompost-based organic fertilizer with bio-active enrichment.",
    benefits: [
      "High humus content for long-term soil health",
      "Contains natural plant growth hormones",
      "Improves soil water-holding capacity",
      "Provides slow-release nutrition",
      "Enhances beneficial soil microbial population",
    ],
    applicationMethod:
      "Apply 200-400 kg per acre as basal application. For potted plants, mix with soil at 1:3 ratio.",
    recommendedUsage:
      "Suitable for all agricultural, horticultural, and floriculture crops. Best for organic farming systems.",
    packSizes: ["5 kg", "10 kg", "25 kg", "50 kg"],
    image: "/products/organic-gold.jpg",
  },
  {
    id: "9",
    slug: "vitagrow-micro-mix",
    name: "VitaGrow Micro Mix",
    category: "Micronutrients",
    description:
      "VitaGrow Micro Mix is a balanced micronutrient mixture containing zinc, iron, manganese, copper, boron, and molybdenum in chelated form. It prevents and corrects multiple micronutrient deficiencies in a single application, ensuring complete crop nutrition.",
    shortDescription:
      "Complete chelated micronutrient mixture for balanced crop nutrition.",
    benefits: [
      "Corrects multiple deficiencies in one application",
      "EDTA chelated for superior absorption",
      "Prevents hidden hunger in crops",
      "Improves crop uniformity and quality",
      "Cost-effective nutrition management",
    ],
    applicationMethod:
      "Foliar spray at 2-3 g per litre of water. Two applications recommended at 30 and 60 days after sowing.",
    recommendedUsage:
      "Recommended for all crops, especially on soils with known micronutrient deficiency. Essential for intensive cropping systems.",
    packSizes: ["100g", "250g", "500g", "1 kg"],
    image: "/products/micro-mix.jpg",
  },
  {
    id: "10",
    slug: "vitagrow-vigor-max",
    name: "VitaGrow Vigor Max",
    category: "Growth Promoters",
    description:
      "VitaGrow Vigor Max is an advanced bio-stimulant formulation containing humic acid, fulvic acid, amino acids, and vitamins. It enhances overall plant vigor, stress tolerance, and crop productivity. Particularly effective during critical growth stages.",
    shortDescription:
      "Advanced bio-stimulant for enhanced plant vigor and stress tolerance.",
    benefits: [
      "Boosts overall plant vigor and canopy development",
      "Enhances tolerance to drought and heat stress",
      "Improves nutrient use efficiency",
      "Accelerates recovery after pest or weather damage",
      "Compatible with all crop protection products",
    ],
    applicationMethod:
      "Foliar spray at 2 ml per litre or drench at 500 ml per acre through drip irrigation.",
    recommendedUsage:
      "Apply at vegetative growth stage, pre-flowering, and during stress periods. Suitable for all field and horticultural crops.",
    packSizes: ["250 ml", "500 ml", "1 litre", "5 litres"],
    image: "/products/vigor-max.jpg",
  },
  {
    id: "11",
    slug: "vitagrow-neem-protect",
    name: "VitaGrow Neem Protect",
    category: "Crop Protection",
    description:
      "VitaGrow Neem Protect is a neem oil-based bio-pesticide with 3000 ppm azadirachtin content. It acts as an insect growth regulator, antifeedant, and repellent against a wide range of sucking and chewing pests. Ideal for integrated pest management programs.",
    shortDescription:
      "High-potency neem oil bio-pesticide for broad-spectrum pest management.",
    benefits: [
      "Controls over 200 species of crop pests",
      "Acts as antifeedant, repellent, and growth regulator",
      "No pest resistance development",
      "Safe for natural enemies and pollinators",
      "Zero residue on harvested produce",
    ],
    applicationMethod:
      "Foliar spray at 2-5 ml per litre of water. Apply in the evening for best results. Repeat every 7-10 days during pest incidence.",
    recommendedUsage:
      "Suitable for all crops as preventive and curative pest management. Part of IPM-compatible solutions.",
    packSizes: ["250 ml", "500 ml", "1 litre", "5 litres"],
    image: "/products/neem-protect.jpg",
  },
  {
    id: "12",
    slug: "vitagrow-humic-power",
    name: "VitaGrow Humic Power",
    category: "Soil Conditioners",
    description:
      "VitaGrow Humic Power is a concentrated humic acid formulation derived from leonardite. With 80% humic acid content, it dramatically improves soil structure, nutrient retention, and root development. An essential input for building long-term soil fertility.",
    shortDescription:
      "Concentrated humic acid formulation for superior soil health and fertility.",
    benefits: [
      "80% humic acid for maximum effectiveness",
      "Dramatically improves nutrient retention",
      "Enhances root mass development",
      "Buffers soil pH for optimal nutrient availability",
      "Reduces nutrient leaching losses",
    ],
    applicationMethod:
      "Soil application at 2-5 kg per acre mixed with irrigation water. For foliar use, apply at 1-2 ml per litre.",
    recommendedUsage:
      "Apply at land preparation and repeat at 30-day intervals. Essential for sandy soils and areas with low organic matter.",
    packSizes: ["500g", "1 kg", "5 kg", "25 kg"],
    image: "/products/humic-power.jpg",
  },
];

// ---------- WHY CHOOSE US ----------
export const whyChooseUs = [
  {
    title: "Quality Manufacturing",
    description:
      "State-of-the-art manufacturing facility with strict quality control at every stage. All products meet national regulatory standards and undergo rigorous testing.",
    icon: "Factory",
  },
  {
    title: "Research Driven",
    description:
      "Continuous research and development backed by agronomists and soil scientists. Products are formulated based on field trials and scientific validation.",
    icon: "FlaskConical",
  },
  {
    title: "Farmer Focused",
    description:
      "Dedicated field support teams provide technical guidance and agronomic advisory to farmers and dealers. Building relationships through knowledge sharing.",
    icon: "Users",
  },
  {
    title: "Reliable Distribution",
    description:
      "Extensive distribution network spanning 10+ states with 150+ active dealer partners. Timely product availability and consistent supply chain management.",
    icon: "Truck",
  },
];

// ---------- TESTIMONIALS ----------
export const testimonials = [
  {
    name: "Rajesh Kumar Patel",
    role: "Agricultural Dealer",
    company: "Patel Agro Traders, Gujarat",
    content:
      "We have been associated with VayitaGrow for over two years now. Their product quality is consistently excellent, and the technical support team is always available when our farmers need guidance. The Bio Boost and RootMax products have become bestsellers in our region.",
    rating: 5,
  },
  {
    name: "Suresh Reddy",
    role: "Distributor",
    company: "Reddy Farm Solutions, Andhra Pradesh",
    content:
      "As a distributor covering three districts, I can confidently say that VayitaGrow products deliver results. The company maintains professional communication, timely deliveries, and fair business terms. Our dealer network has grown significantly since we partnered with them.",
    rating: 5,
  },
  {
    name: "Anand Sharma",
    role: "Progressive Farmer",
    company: "Sharma Farms, Madhya Pradesh",
    content:
      "After switching to VitaGrow GreenLife and SoilCare products, we observed noticeable improvement in soil health and crop yield. The organic approach has reduced our input costs while maintaining productivity. I recommend VayitaGrow products to every farmer in our village.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    role: "Retail Store Owner",
    company: "KrishiMart, Kerala",
    content:
      "Our customers trust VayitaGrow products because they see real results in their fields. The product packaging is professional, the labeling is clear, and the company provides excellent marketing support. It has been a rewarding partnership.",
    rating: 5,
  },
  {
    name: "Vikram Singh",
    role: "Agricultural Consultant",
    company: "AgroVision Consultancy, Punjab",
    content:
      "I have evaluated several bio-input brands for my clients. VayitaGrow stands out for their scientific approach to product formulation and their commitment to quality. Their Micro Mix and Bloom Plus products have shown excellent field performance across different crops.",
    rating: 5,
  },
  {
    name: "Manoj Tiwari",
    role: "District Dealer",
    company: "Tiwari Agricultural Agencies, Uttar Pradesh",
    content:
      "Partnering with VayitaGrow has been a game-changer for our business. Their product range covers all farmer needs, and the company invests in dealer training programs. The support we receive in terms of technical knowledge and promotional material is outstanding.",
    rating: 5,
  },
];

// ---------- LEADERSHIP ----------
export const leadership = [
  {
    name: "Arun K. Banerjee",
    role: "Managing Director",
    description:
      "With over 20 years of experience in the agricultural industry, Arun leads VayitaGrow with a vision of sustainable agricultural growth. His expertise in agricultural manufacturing and strategic partnerships has been instrumental in building the company's foundation.",
    image: "/team/md.jpg",
  },
  {
    name: "Sunita Devi Agarwal",
    role: "Operations Head",
    description:
      "Sunita brings 15 years of operations management experience in agricultural manufacturing. She oversees production, quality control, and supply chain operations, ensuring that every product meets VayitaGrow's high standards.",
    image: "/team/operations.jpg",
  },
  {
    name: "Dr. Rakesh Mohan",
    role: "Technical Director",
    description:
      "Dr. Rakesh holds a Ph.D. in Soil Science and has spent 18 years in agricultural research. He leads product development, field trials, and the technical support team, ensuring scientific rigor in every formulation.",
    image: "/team/technical.jpg",
  },
  {
    name: "Deepak Singh Chauhan",
    role: "Sales Head",
    description:
      "Deepak has built and managed distribution networks across India for over 12 years. His understanding of the agricultural input market and dealer relationships drives VayitaGrow's expanding reach across states.",
    image: "/team/sales.jpg",
  },
];

// ---------- CORE VALUES ----------
export const coreValues = [
  {
    title: "Quality First",
    description:
      "Every product undergoes rigorous quality testing before reaching the market. We maintain zero compromise on product standards.",
    icon: "Award",
  },
  {
    title: "Sustainability",
    description:
      "Our products are designed to support long-term soil health and ecological balance, promoting farming practices that sustain future generations.",
    icon: "Leaf",
  },
  {
    title: "Innovation",
    description:
      "Continuous research and development drives our product portfolio. We invest in scientific approaches to solve real agricultural challenges.",
    icon: "Lightbulb",
  },
  {
    title: "Farmer Welfare",
    description:
      "Every business decision is evaluated against its impact on farmer productivity and profitability. Our success is measured by farmer success.",
    icon: "Heart",
  },
  {
    title: "Integrity",
    description:
      "Transparent business practices, honest product claims, and fair dealing with all stakeholders form the cornerstone of our operations.",
    icon: "Shield",
  },
  {
    title: "Partnership",
    description:
      "We build long-term relationships with dealers, distributors, and farmers based on mutual trust, respect, and shared growth objectives.",
    icon: "Handshake",
  },
];

// ---------- CLIENTS ----------
export interface Client {
  id: string;
  name: string;
  state: string;
  contactPerson: string;
  phone: string;
  status: "Active" | "Inactive" | "New";
}

export const clients: Client[] = [
  { id: "C001", name: "Patel Agro Traders", state: "Gujarat", contactPerson: "Rajesh Patel", phone: "+91 9876501234", status: "Active" },
  { id: "C002", name: "Reddy Farm Solutions", state: "Andhra Pradesh", contactPerson: "Suresh Reddy", phone: "+91 9876502345", status: "Active" },
  { id: "C003", name: "Tiwari Agricultural Agencies", state: "Uttar Pradesh", contactPerson: "Manoj Tiwari", phone: "+91 9876503456", status: "Active" },
  { id: "C004", name: "Sharma Krishi Kendra", state: "Madhya Pradesh", contactPerson: "Vikram Sharma", phone: "+91 9876504567", status: "Active" },
  { id: "C005", name: "Bengal Agro Distributors", state: "West Bengal", contactPerson: "Debashis Roy", phone: "+91 9876505678", status: "Active" },
  { id: "C006", name: "Nair Fertilizer Depot", state: "Kerala", contactPerson: "Priya Nair", phone: "+91 9876506789", status: "Active" },
  { id: "C007", name: "Singh Farm Supplies", state: "Punjab", contactPerson: "Harpreet Singh", phone: "+91 9876507890", status: "Active" },
  { id: "C008", name: "Joshi Agri Enterprises", state: "Maharashtra", contactPerson: "Amit Joshi", phone: "+91 9876508901", status: "New" },
  { id: "C009", name: "Rao Crop Solutions", state: "Telangana", contactPerson: "Venkat Rao", phone: "+91 9876509012", status: "Active" },
  { id: "C010", name: "Mishra Agricultural Store", state: "Bihar", contactPerson: "Sanjay Mishra", phone: "+91 9876510123", status: "Inactive" },
  { id: "C011", name: "Deshpande Agri Mart", state: "Karnataka", contactPerson: "Ramesh Deshpande", phone: "+91 9876511234", status: "Active" },
  { id: "C012", name: "Choudhary Farm Centre", state: "Rajasthan", contactPerson: "Naveen Choudhary", phone: "+91 9876512345", status: "New" },
  { id: "C013", name: "Das Krishi Udyog", state: "Odisha", contactPerson: "Prakash Das", phone: "+91 9876513456", status: "Active" },
  { id: "C014", name: "Pillai Agro Services", state: "Tamil Nadu", contactPerson: "Murugan Pillai", phone: "+91 9876514567", status: "Active" },
  { id: "C015", name: "Ghosh Seed and Fertilizer", state: "West Bengal", contactPerson: "Subhash Ghosh", phone: "+91 9876515678", status: "Active" },
];

// ---------- ORDERS ----------
export interface Order {
  id: string;
  client: string;
  amount: string;
  status: "Pending" | "Approved" | "Completed";
  date: string;
}

export const orders: Order[] = [
  { id: "ORD-2024-001", client: "Patel Agro Traders", amount: "2,45,000", status: "Completed", date: "2024-12-15" },
  { id: "ORD-2024-002", client: "Reddy Farm Solutions", amount: "3,80,000", status: "Completed", date: "2024-12-18" },
  { id: "ORD-2024-003", client: "Bengal Agro Distributors", amount: "1,75,000", status: "Completed", date: "2024-12-22" },
  { id: "ORD-2024-004", client: "Singh Farm Supplies", amount: "4,20,000", status: "Completed", date: "2025-01-05" },
  { id: "ORD-2025-005", client: "Tiwari Agricultural Agencies", amount: "2,90,000", status: "Completed", date: "2025-01-12" },
  { id: "ORD-2025-006", client: "Nair Fertilizer Depot", amount: "1,55,000", status: "Completed", date: "2025-01-20" },
  { id: "ORD-2025-007", client: "Deshpande Agri Mart", amount: "3,10,000", status: "Completed", date: "2025-02-03" },
  { id: "ORD-2025-008", client: "Sharma Krishi Kendra", amount: "2,60,000", status: "Completed", date: "2025-02-14" },
  { id: "ORD-2025-009", client: "Rao Crop Solutions", amount: "1,95,000", status: "Approved", date: "2025-02-28" },
  { id: "ORD-2025-010", client: "Pillai Agro Services", amount: "2,25,000", status: "Approved", date: "2025-03-05" },
  { id: "ORD-2025-011", client: "Das Krishi Udyog", amount: "3,45,000", status: "Approved", date: "2025-03-10" },
  { id: "ORD-2025-012", client: "Ghosh Seed and Fertilizer", amount: "1,80,000", status: "Approved", date: "2025-03-15" },
  { id: "ORD-2025-013", client: "Joshi Agri Enterprises", amount: "2,75,000", status: "Pending", date: "2025-03-22" },
  { id: "ORD-2025-014", client: "Choudhary Farm Centre", amount: "4,50,000", status: "Pending", date: "2025-03-28" },
  { id: "ORD-2025-015", client: "Patel Agro Traders", amount: "3,20,000", status: "Pending", date: "2025-04-02" },
  { id: "ORD-2025-016", client: "Reddy Farm Solutions", amount: "2,15,000", status: "Pending", date: "2025-04-08" },
  { id: "ORD-2025-017", client: "Bengal Agro Distributors", amount: "1,90,000", status: "Approved", date: "2025-04-12" },
  { id: "ORD-2025-018", client: "Singh Farm Supplies", amount: "5,00,000", status: "Pending", date: "2025-04-18" },
  { id: "ORD-2025-019", client: "Mishra Agricultural Store", amount: "1,45,000", status: "Pending", date: "2025-04-22" },
  { id: "ORD-2025-020", client: "Tiwari Agricultural Agencies", amount: "3,75,000", status: "Approved", date: "2025-04-28" },
];

// ---------- STATEMENTS ----------
export interface Statement {
  id: string;
  statementNumber: string;
  clientName: string;
  uploadDate: string;
  period: string;
}

export const statements: Statement[] = [
  { id: "S001", statementNumber: "STM-2025-001", clientName: "Patel Agro Traders", uploadDate: "2025-01-15", period: "Q4 2024" },
  { id: "S002", statementNumber: "STM-2025-002", clientName: "Reddy Farm Solutions", uploadDate: "2025-01-15", period: "Q4 2024" },
  { id: "S003", statementNumber: "STM-2025-003", clientName: "Bengal Agro Distributors", uploadDate: "2025-01-15", period: "Q4 2024" },
  { id: "S004", statementNumber: "STM-2025-004", clientName: "Singh Farm Supplies", uploadDate: "2025-01-15", period: "Q4 2024" },
  { id: "S005", statementNumber: "STM-2025-005", clientName: "Tiwari Agricultural Agencies", uploadDate: "2025-02-15", period: "Jan 2025" },
  { id: "S006", statementNumber: "STM-2025-006", clientName: "Nair Fertilizer Depot", uploadDate: "2025-02-15", period: "Jan 2025" },
  { id: "S007", statementNumber: "STM-2025-007", clientName: "Deshpande Agri Mart", uploadDate: "2025-03-15", period: "Feb 2025" },
  { id: "S008", statementNumber: "STM-2025-008", clientName: "Sharma Krishi Kendra", uploadDate: "2025-03-15", period: "Feb 2025" },
  { id: "S009", statementNumber: "STM-2025-009", clientName: "Rao Crop Solutions", uploadDate: "2025-04-15", period: "Q1 2025" },
  { id: "S010", statementNumber: "STM-2025-010", clientName: "Pillai Agro Services", uploadDate: "2025-04-15", period: "Q1 2025" },
  { id: "S011", statementNumber: "STM-2025-011", clientName: "Das Krishi Udyog", uploadDate: "2025-04-15", period: "Q1 2025" },
  { id: "S012", statementNumber: "STM-2025-012", clientName: "Ghosh Seed and Fertilizer", uploadDate: "2025-04-15", period: "Q1 2025" },
];

// ---------- FIELD REPORTS ----------
export interface FieldReport {
  id: string;
  visitDate: string;
  dealerName: string;
  location: string;
  summary: string;
  status: "Completed" | "Follow-up Required";
}

export const fieldReports: FieldReport[] = [
  { id: "FR001", visitDate: "2025-03-05", dealerName: "Patel Agro Traders", location: "Ahmedabad, Gujarat", summary: "Conducted product demonstration of Bio Boost to a group of 25 farmers. Strong interest observed in organic farming solutions. Dealer requested additional promotional material for local farmer meetings.", status: "Completed" },
  { id: "FR002", visitDate: "2025-03-08", dealerName: "Reddy Farm Solutions", location: "Guntur, Andhra Pradesh", summary: "Reviewed chilli crop field trials with RootMax application. 30% improvement in root mass observed compared to control plots. Dealer plans to expand VayitaGrow product range in next order.", status: "Completed" },
  { id: "FR003", visitDate: "2025-03-12", dealerName: "Tiwari Agricultural Agencies", location: "Lucknow, Uttar Pradesh", summary: "Addressed farmer complaints about delayed product supply. Logistics team has been coordinated for priority dispatch. Dealer satisfied with resolution approach.", status: "Follow-up Required" },
  { id: "FR004", visitDate: "2025-03-15", dealerName: "Singh Farm Supplies", location: "Ludhiana, Punjab", summary: "Training session conducted for dealer staff on VitaGrow Micro Mix application techniques. 12 staff members attended. Covered dosage, timing, and crop-specific recommendations.", status: "Completed" },
  { id: "FR005", visitDate: "2025-03-18", dealerName: "Bengal Agro Distributors", location: "Kolkata, West Bengal", summary: "Reviewed quarterly business performance. Sales grew 22% compared to previous quarter. New sub-dealer onboarded in Hooghly district. Plan to expand to Burdwan next quarter.", status: "Completed" },
  { id: "FR006", visitDate: "2025-03-22", dealerName: "Nair Fertilizer Depot", location: "Kochi, Kerala", summary: "Visited rubber and spice plantations using SoilCare products. Plantation owners reported improved soil moisture retention. Potential for large-volume orders in upcoming season.", status: "Follow-up Required" },
  { id: "FR007", visitDate: "2025-03-25", dealerName: "Deshpande Agri Mart", location: "Belgaum, Karnataka", summary: "Participated in local Krishi Mela. VayitaGrow stall received strong footfall. Collected 45 farmer contact details for follow-up. Dealer network expansion discussed.", status: "Completed" },
  { id: "FR008", visitDate: "2025-03-28", dealerName: "Sharma Krishi Kendra", location: "Indore, Madhya Pradesh", summary: "Inspected soybean fields treated with GreenLife organic fertilizer. Crop health assessment showed uniform growth and good nodulation. Farmer testimonials collected for marketing use.", status: "Completed" },
  { id: "FR009", visitDate: "2025-04-02", dealerName: "Rao Crop Solutions", location: "Hyderabad, Telangana", summary: "Conducted competitive market analysis in the region. Identified opportunities for VitaGrow CropShield in cotton and chilli growing areas. Pricing strategy discussed with dealer.", status: "Follow-up Required" },
  { id: "FR010", visitDate: "2025-04-05", dealerName: "Joshi Agri Enterprises", location: "Pune, Maharashtra", summary: "New dealer onboarding completed. Product catalog, pricing, and business terms finalized. Initial order placed for Bio Boost, SoilCare, and Bloom Plus products.", status: "Completed" },
  { id: "FR011", visitDate: "2025-04-08", dealerName: "Choudhary Farm Centre", location: "Jaipur, Rajasthan", summary: "Evaluated arid zone farming challenges. Recommended Humic Power and SoilCare combination for sandy soils. Dealer interested in organizing farmer awareness camp in May.", status: "Follow-up Required" },
  { id: "FR012", visitDate: "2025-04-12", dealerName: "Pillai Agro Services", location: "Coimbatore, Tamil Nadu", summary: "Visited banana and coconut plantations using VayitaGrow products. Impressive results observed in banana bunch weight improvement. Case study documentation initiated.", status: "Completed" },
];

// ---------- DASHBOARD STATS ----------
export const dashboardStats = [
  { label: "Clients", value: 127, icon: "Users", change: "+12%" },
  { label: "Orders", value: 42, icon: "ShoppingCart", change: "+8%" },
  { label: "Statements", value: 73, icon: "FileText", change: "+15%" },
  { label: "Field Reports", value: 18, icon: "ClipboardList", change: "+5%" },
];

// ---------- CHART DATA ----------
export const monthlyOrdersData = [
  { month: "Jul", orders: 18, revenue: 32 },
  { month: "Aug", orders: 22, revenue: 38 },
  { month: "Sep", orders: 28, revenue: 45 },
  { month: "Oct", orders: 35, revenue: 52 },
  { month: "Nov", orders: 30, revenue: 48 },
  { month: "Dec", orders: 25, revenue: 42 },
  { month: "Jan", orders: 32, revenue: 55 },
  { month: "Feb", orders: 38, revenue: 62 },
  { month: "Mar", orders: 42, revenue: 68 },
  { month: "Apr", orders: 45, revenue: 72 },
  { month: "May", orders: 40, revenue: 65 },
  { month: "Jun", orders: 48, revenue: 78 },
];

export const monthlyReportsData = [
  { month: "Jul", reports: 8 },
  { month: "Aug", reports: 12 },
  { month: "Sep", reports: 10 },
  { month: "Oct", reports: 15 },
  { month: "Nov", reports: 14 },
  { month: "Dec", reports: 9 },
  { month: "Jan", reports: 16 },
  { month: "Feb", reports: 18 },
  { month: "Mar", reports: 20 },
  { month: "Apr", reports: 22 },
  { month: "May", reports: 19 },
  { month: "Jun", reports: 24 },
];

// ---------- NAV LINKS ----------
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Feedback", href: "/feedback" },
  { label: "Contact", href: "/contact" },
];

export const dashboardNavLinks = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Clients", href: "/dashboard/clients", icon: "Users" },
  { label: "Orders", href: "/dashboard/orders", icon: "ShoppingCart" },
  { label: "Statements", href: "/dashboard/statements", icon: "FileText" },
  { label: "Field Reports", href: "/dashboard/field-reports", icon: "ClipboardList" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
];
