import type { Customer, CustomerNote } from "@/lib/types/customer";

/**
 * DEMO operational data - dealer/distributor records for the internal portal.
 * All localities are within the company's two real operating states
 * (West Bengal and Jharkhand). Names and phone numbers are demo values.
 */

export const seedCustomers: Customer[] = [
  { customerId: 1, fullName: "Bengal Agro Distributors", email: "bengalagro@example.com", phone: "+91 98000 00001", address: "College Street, Kolkata", state: "West Bengal", status: "Active", createdAt: "2025-12-01T09:00:00.000Z" },
  { customerId: 2, fullName: "Ghosh Seed & Fertilizer", email: "ghoshseeds@example.com", phone: "+91 98000 00002", address: "Chinsurah, Hooghly", state: "West Bengal", status: "Active", createdAt: "2025-12-05T09:00:00.000Z" },
  { customerId: 3, fullName: "Howrah Krishi Bhandar", email: null, phone: "+91 98000 00003", address: "Panchla Bazar, Howrah", state: "West Bengal", status: "Active", createdAt: "2025-12-18T09:00:00.000Z" },
  { customerId: 4, fullName: "Burdwan Agro Centre", email: "burdwanagro@example.com", phone: "+91 98000 00004", address: "GT Road, Bardhaman", state: "West Bengal", status: "Active", createdAt: "2026-01-08T09:00:00.000Z" },
  { customerId: 5, fullName: "Siliguri Farm Supplies", email: null, phone: "+91 98000 00005", address: "Sevoke Road, Siliguri", state: "West Bengal", status: "Active", createdAt: "2026-01-20T09:00:00.000Z" },
  { customerId: 6, fullName: "Malda Krishi Seva Kendra", email: "maldakrishi@example.com", phone: "+91 98000 00006", address: "Rathbari, Malda", state: "West Bengal", status: "New", createdAt: "2026-05-12T09:00:00.000Z" },
  { customerId: 7, fullName: "Nadia Agri Traders", email: null, phone: "+91 98000 00007", address: "Krishnanagar, Nadia", state: "West Bengal", status: "Active", createdAt: "2026-02-02T09:00:00.000Z" },
  { customerId: 8, fullName: "Ranchi Agro Agencies", email: "ranchiagro@example.com", phone: "+91 98000 00008", address: "Main Road, Ranchi", state: "Jharkhand", status: "Active", createdAt: "2025-12-10T09:00:00.000Z" },
  { customerId: 9, fullName: "Jamshedpur Farm Solutions", email: "jsrfarms@example.com", phone: "+91 98000 00009", address: "Sakchi Market, Jamshedpur", state: "Jharkhand", status: "Active", createdAt: "2026-01-15T09:00:00.000Z" },
  { customerId: 10, fullName: "Dhanbad Krishi Depot", email: null, phone: "+91 98000 00010", address: "Bank More, Dhanbad", state: "Jharkhand", status: "Inactive", createdAt: "2026-02-20T09:00:00.000Z" },
  { customerId: 11, fullName: "Hazaribagh Agro Mart", email: "hazaribaghagro@example.com", phone: "+91 98000 00011", address: "Guru Gobind Singh Road, Hazaribagh", state: "Jharkhand", status: "Active", createdAt: "2026-03-05T09:00:00.000Z" },
  { customerId: 12, fullName: "Deoghar Beej Bhandar", email: null, phone: "+91 98000 00012", address: "Tower Chowk, Deoghar", state: "Jharkhand", status: "New", createdAt: "2026-06-01T09:00:00.000Z" },
];

export const seedCustomerNotes: CustomerNote[] = [
  { noteId: 1, customerId: 1, createdBy: 2, createdByUsername: "manish", noteText: "Long-standing Kolkata distributor. Prefers quarterly consolidated statements. Interested in stocking JYME-VITA from next season.", createdAt: "2026-04-10T10:30:00.000Z" },
  { noteId: 2, customerId: 8, createdBy: 2, createdByUsername: "manish", noteText: "Anchor dealer for the Ranchi region. Requested dealer training session for VEER-P application before kharif sowing.", createdAt: "2026-05-02T08:15:00.000Z" },
  { noteId: 3, customerId: 6, createdBy: 3, createdByUsername: "sourav.field", noteText: "New dealer onboarded after Malda field visit. Initial order focused on V-BOOST and V-FIX for mango orchard customers.", createdAt: "2026-05-14T11:00:00.000Z" },
  { noteId: 4, customerId: 10, createdBy: 2, createdByUsername: "manish", noteText: "Account inactive since March - proprietor renovating shop premises. Follow up in August before festive season demand.", createdAt: "2026-06-08T09:45:00.000Z" },
];
