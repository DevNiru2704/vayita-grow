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
  | "Natural Plant Growth Promoter"
  | "Amino Acid Enriched Liquid Nutrient"
  | "Leaf Growth Promoter"
  | "Flowering Promoter"
  | "100% Organic Fertilizer"
  | "Soil pH Regulator"
  | "Seaweed-Based Enriched Mixed Granules"
  | "Organic Enzyme"
  | "Silicone-Based Spreader & Activator"
  | "Soil Conditioner Powder";

export const productCategories: {
  name: ProductCategory;
  description: string;
  icon: string;
}[] = [
    {
      name: "Natural Plant Growth Promoter",
      description:
        "Formulated with humic and fulvic acids to improve overall plant health, stress tolerance, and vigorous crop development.",
      icon: "Leaf",
    },
    {
      name: "Amino Acid Enriched Liquid Nutrient",
      description:
        "A balanced liquid formulation that prevents nutrient deficiencies, improves flowering, and enhances fruit quality and yield.",
      icon: "FlaskConical",
    },
    {
      name: "Leaf Growth Promoter",
      description:
        "Scientifically developed to increase chlorophyll content, accelerate photosynthesis, and promote vigorous foliage expansion.",
      icon: "Sprout",
    },
    {
      name: "Flowering Promoter",
      description:
        "A highly effective stimulant that activates physiological processes to promote rapid, uniform flowering and reduce bud drop.",
      icon: "Flower2",
    },
    {
      name: "100% Organic Fertilizer",
      description:
        "Prepared from natural materials to restore beneficial microorganisms, improve soil fertility, and provide balanced long-term nutrition.",
      icon: "Wheat",
    },
    {
      name: "Soil pH Regulator",
      description:
        "Corrects acidic or alkaline soil imbalances to maintain optimal pH and significantly improve nutrient availability for roots.",
      icon: "Scale",
    },
    {
      name: "Soil Conditioner Powder",
      description:
        "Humic acid-based powder that enhances soil structure, improves water-holding capacity, and increases organic carbon.",
      icon: "Mountain",
    },
    {
      name: "Organic Enzyme",
      description:
        "An organic soil activator that accelerates matter decomposition and increases beneficial biological activity in the soil.",
      icon: "Activity",
    },
    {
      name: "Silicone-Based Spreader & Activator",
      description:
        "A premium agricultural adjuvant that drastically improves the spreading, sticking, and absorption of foliar sprays.",
      icon: "Maximize",
    },
    {
      name: "Seaweed-Based Enriched Mixed Granules",
      description:
        "Granular fertilizer rich in natural seaweed extracts and essential minerals to improve soil health and stimulate growth.",
      icon: "Waves",
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
  Dosage: string;
  Composition: string;
  packSizes: string[];
  imagecut: string;
  image: string;
}

export const products: Product[] = [
  {
    id: "1",
    slug: "VEER-L",
    name: "VEER-L",
    category: "Natural Plant Growth Promoter",
    description:
      "Veer-L is a natural plant growth promoter formulated with humic acid, fulvic acid, and essential nutrients. Its synergistic action improves plant growth, overall plant health, and stress tolerance. It enhances nutrient availability and supports vigorous crop development, resulting in increased yield and better crop performance.",
    shortDescription:
      "Enhances growth, strengthens plants, improves nutrient uptake, boosts yield, and resilience.",
    benefits: [
      "Promotes vigorous plant growth",
      "Enhances nutrient absorption efficiency",
      "Improves stress tolerance naturally",
      "Supports healthier crop development",
      "Increases yield and productivity"
    ],
    Dosage:
      "All crops: 2–3 ml per liter of water",
    Composition:
      "Humic Acid, Fulvic Acid: 25.05%",
    packSizes: ["100 ml", "250 ml", "500 ml", "1 Ltr"],
    imagecut: "/products/VEER-L_rbg.png",
    image: "/products/VEER-L.jpg",
  },
  {
    id: "2",
    slug: "VITA-A",
    name: "VITA-A",
    category: "Amino Acid Enriched Liquid Nutrient",
    description:
      "Vita-A is a balanced liquid nutrient enriched with amino acids and micronutrients. It helps prevent and correct nutrient deficiencies while promoting healthy growth. The formulation improves flowering, fruit setting, fruit size, color, and taste, resulting in higher-quality produce and increased productivity.",
    shortDescription:
      "Enhances growth, corrects deficiencies, improves flowering, fruit quality, yield, and taste.",
    benefits: [
      "Corrects nutrient deficiencies effectively",
      "Promotes healthy plant growth",
      "Enhances flowering and fruiting",
      "Improves fruit size and color",
      "Boosts yield and produce quality"
    ],
    Dosage:
      "All crops: 2–3 ml per liter of water",
    Composition:
      "N/A",
    packSizes: ["100 ml", "250 ml", "500 ml", "1 Ltr"],
    imagecut: "/products/VITA-A_rbg.png",
    image: "/products/VITA-A.jpg",
  },
  {
    id: "3",
    slug: "V-LEAF",
    name: "V-LEAF",
    category: "Leaf Growth Promoter",
    description:
      "V-Leaf is a scientifically developed leaf growth enhancer that promotes the formation of healthy and vigorous foliage. It improves cell division, nutrient absorption, and photosynthesis, leading to faster leaf expansion, increased chlorophyll content, and stronger plant growth. Healthy foliage contributes directly to improved crop productivity.",
    shortDescription:
      "Enhances leaf growth, improves photosynthesis, and promotes vigorous, healthy foliage for better productivity.",
    benefits: [
      "Promotes vigorous leaf expansion",
      "Improves photosynthesis naturally",
      "Enhances nutrient absorption",
      "Increases chlorophyll content",
      "Boosts overall crop productivity"
    ],
    Dosage:
      "All crops: 2–3 ml per liter of water",
    Composition:
      "N/A",
    packSizes: ["100 ml", "250 ml", "500 ml", "1 Ltr"],
    imagecut: "/products/V-LEAF_rbg.png",
    image: "/products/V-LEAF.jpg",
  },
  {
    id: "4",
    slug: "V-BOOST",
    name: "V-BOOST",
    category: "Flowering Promoter",
    description:
      "V-Boost is a highly effective flowering stimulant developed to promote rapid and uniform flowering. It activates the plant's natural physiological processes, resulting in improved bud formation, reduced flower drop, and healthier flowering. This helps maintain stronger flowers and better fruit-setting potential.",
    shortDescription:
      "Stimulates rapid flowering, reduces flower drop, and improves fruit-setting potential.",
    benefits: [
      "Promotes rapid and uniform flowering",
      "Reduces unwanted flower drop",
      "Improves healthy bud formation",
      "Enhances fruit-setting potential",
      "Activates natural physiological processes"
    ],
    Dosage:
      "10–15 drops per 15 liters of water",
    Composition:
      "Natural phytohormones and other beneficial ingredients",
    packSizes: ["10 ml", "50 ml", "100 ml"],
    imagecut: "/products/V-BOOST_rbg.png",
    image: "/products/V-BOOST.jpg",
  },
  {
    id: "5",
    slug: "JAIVIK-GOLD",
    name: "JAIVIK GOLD",
    category: "100% Organic Fertilizer",
    description:
      "Jaivik Gold is a 100% natural organic fertilizer prepared from well-decomposed organic materials. It improves soil fertility, restores beneficial microorganisms, and provides long-lasting balanced nutrition. Suitable for field crops, horticulture, gardens, nurseries, and organic farming systems.",
    shortDescription:
      "100% natural organic fertilizer that improves soil fertility and provides long-lasting balanced nutrition.",
    benefits: [
      "Improves overall soil fertility",
      "Restores beneficial microorganisms",
      "Provides long-lasting balanced nutrition",
      "100% natural and organic composition",
      "Suitable for all farming systems"
    ],
    Dosage:
      "200–300 kg per acre",
    Composition:
      "N/A",
    packSizes: ["50 kg", "1 kg"],
    imagecut: "/products/JAIVIK-GOLD_rbg.png",
    image: "/products/JAIVIK-gold.jpg",
  },
  {
    id: "6",
    slug: "VEER-P",
    name: "VEER-P",
    category: "Soil Conditioner Powder",
    description:
      "Veer-P is a humic acid-based soil conditioner designed to improve soil structure and increase organic carbon content. It enhances nutrient retention, improves water-holding capacity, increases soil aeration, and promotes healthy root-zone development. Regular use supports overall soil health and crop productivity.",
    shortDescription:
      "Humic acid-based soil conditioner that enhances soil structure, nutrient retention, and root development.",
    benefits: [
      "Improves soil structure and aeration",
      "Increases organic carbon content",
      "Enhances water-holding capacity",
      "Promotes healthy root-zone development",
      "Supports long-term soil health"
    ],
    Dosage:
      "All crops: 1 kg per acre",
    Composition:
      "Humic Acid: 75%, Fulvic Acid: 8%, Potassium: 6%, Moisture: 10%",
    packSizes: ["1 kg"],
    imagecut: "/products/VEER-P_rbg.png",
    image: "/products/VEER-P.jpg",
  },
  {
    id: "7",
    slug: "V-PH",
    name: "V-pH",
    category: "Soil pH Regulator",
    description:
      "V-pH helps regulate soil pH and maintain proper soil balance. It assists in correcting acidic or alkaline soil conditions, improving nutrient availability and root efficiency. Continuous use supports healthy soil development and creates favorable conditions for higher crop yields.",
    shortDescription:
      "Regulates soil pH, corrects acidic or alkaline imbalances, and improves nutrient availability.",
    benefits: [
      "Regulates and maintains proper soil pH",
      "Corrects acidic and alkaline conditions",
      "Improves vital nutrient availability",
      "Enhances root system efficiency",
      "Creates favorable conditions for high yields"
    ],
    Dosage:
      "All crops: 3–5 kg per bigha",
    Composition:
      "N/A",
    packSizes: ["1 kg", "5 kg"],
    imagecut: "/products/V-PH_rbg.png",
    image: "/products/V-PH.jpg",
  },
  {
    id: "8",
    slug: "V-RICH",
    name: "V-RICH",
    category: "Seaweed-Based Enriched Mixed Granules",
    description:
      "V-Rich is a premium seaweed-based granular fertilizer prepared from naturally derived seaweed extracts. It contains valuable minerals, organic matter, calcium, magnesium, and humic substances that improve soil health, enhance nutrient uptake, and stimulate plant growth. Suitable for all types of crops.",
    shortDescription:
      "Premium seaweed granules that improve soil health, stimulate growth, and enhance nutrient uptake.",
    benefits: [
      "Improves overall soil health",
      "Enhances nutrient uptake efficiency",
      "Stimulates vigorous plant growth",
      "Rich in essential minerals and organic matter",
      "Suitable for all types of crops"
    ],
    Dosage:
      "All crops: 3–5 kg per acre",
    Composition:
      "N/A",
    packSizes: ["1 kg"],
    imagecut: "/products/V-RICH_rbg.png",
    image: "/products/V-RICH.jpg",
  },
  {
    id: "9",
    slug: "JYME-VITA",
    name: "JYME-VITA",
    category: "Organic Enzyme",
    description:
      "Jyme-Vita is an organic enzyme-based soil activator designed to increase biological activity in the soil. It contains naturally derived enzymes and nutrients that stimulate beneficial microorganisms, accelerate decomposition of organic matter, and improve nutrient utilization. It strengthens plants and promotes healthy growth and productivity.",
    shortDescription:
      "Organic soil activator that stimulates microorganisms, accelerates decomposition, and improves nutrient utilization.",
    benefits: [
      "Increases soil biological activity",
      "Stimulates beneficial microorganisms",
      "Accelerates organic matter decomposition",
      "Improves nutrient utilization efficiency",
      "Strengthens plants for healthy growth"
    ],
    Dosage:
      "All crops: 10–15 kg per acre",
    Composition:
      "N/A",
    packSizes: ["10 kg"],
    imagecut: "/products/JYME-VITA_rbg.png",
    image: "/products/JYME-VITA.jpg",
  },
  {
    id: "10",
    slug: "V-FIX",
    name: "V-FIX",
    category: "Silicone-Based Spreader & Activator",
    description:
      "V-Fix is a silicone-based non-ionic agricultural adjuvant used along with pesticides and foliar sprays. It improves the spreading, sticking, and absorption of insecticides, fungicides, herbicides, and nutrients on plant surfaces. This results in better spray coverage, enhanced effectiveness, and improved crop protection.",
    shortDescription:
      "Silicone-based adjuvant that improves spreading, sticking, and absorption of foliar sprays.",
    benefits: [
      "Improves spray spreading and sticking",
      "Enhances absorption of foliar sprays",
      "Increases effectiveness of pesticides",
      "Provides better uniform spray coverage",
      "Improves overall crop protection"
    ],
    Dosage:
      "All crops: 5 ml per liter of water",
    Composition:
      "N/A",
    packSizes: ["100 ml", "250 ml", "500 ml", "1 Ltr"],
    imagecut: "/products/V-FIX_rbg.png",
    image: "/products/V-FIX.jpg",
  }
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
