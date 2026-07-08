import "server-only";
import { latency } from "@/lib/mock/store";
import type { ListParams, Paginated } from "@/lib/types/common";
import type { ContactInquiry, PublicFeedbackEntry } from "@/lib/types/inquiries";
import { applyList } from "./helpers";

// MOCK IMPLEMENTATION — public submissions are only persisted on the Postgres
// source. These sample rows keep the dashboard inboxes populated in the demo.

const CONTACT_INQUIRIES: ContactInquiry[] = [
  {
    inquiryId: 3,
    name: "Sujit Mahato",
    organization: "Mahato Krishi Kendra",
    phone: "+91 98300 12345",
    email: "sujit.mahato@example.com",
    subject: "dealership",
    message:
      "We run an agri-input shop in Purulia and would like to become a dealer. Please share territory and margin details.",
    createdAt: "2026-07-06T09:12:00.000Z",
  },
  {
    inquiryId: 2,
    name: "Ritwik Sen",
    organization: null,
    phone: "+91 90070 55221",
    email: "ritwik.sen@example.com",
    subject: "product",
    message: "Is JAIVIK GOLD suitable for paddy nurseries? What is the recommended dosage per acre?",
    createdAt: "2026-07-05T14:40:00.000Z",
  },
  {
    inquiryId: 1,
    name: "Anita Devi",
    organization: "Ranchi Agro Traders",
    phone: "+91 89100 77340",
    email: null,
    subject: "order",
    message: "Please call to confirm availability of V-BOOST in 1kg packs for a bulk order.",
    createdAt: "2026-07-04T07:05:00.000Z",
  },
];

const PUBLIC_FEEDBACK: PublicFeedbackEntry[] = [
  {
    feedbackId: 3,
    name: "Gopal Hansda",
    role: "farmer",
    email: "gopal.h@example.com",
    message:
      "Used VEER-L on my vegetable plots this season — noticeably stronger growth. Would like smaller pack sizes.",
    createdAt: "2026-07-06T11:20:00.000Z",
  },
  {
    feedbackId: 2,
    name: "Pooja Agarwal",
    role: "dealer",
    email: null,
    message: "Field support has been excellent. Faster restocking on V-FIX would help during peak season.",
    createdAt: "2026-07-05T16:02:00.000Z",
  },
  {
    feedbackId: 1,
    name: "Imran Khan",
    role: "distributor",
    email: "imran.k@example.com",
    message: "Packaging quality is good. Please consider adding a Hindi usage leaflet inside each carton.",
    createdAt: "2026-07-03T08:45:00.000Z",
  },
];

export async function getContactInquiries(
  params?: ListParams & { subject?: string },
): Promise<Paginated<ContactInquiry>> {
  await latency();
  let rows = CONTACT_INQUIRIES;
  if (params?.subject) rows = rows.filter((r) => r.subject === params.subject);
  return applyList(rows, params, {
    search: (r) => `${r.name} ${r.organization ?? ""} ${r.email ?? ""} ${r.phone} ${r.message}`,
    sorters: { createdAt: (r) => r.createdAt, name: (r) => r.name },
    defaultSort: "createdAt",
    defaultDir: "desc",
  });
}

export async function getPublicFeedback(
  params?: ListParams & { role?: string },
): Promise<Paginated<PublicFeedbackEntry>> {
  await latency();
  let rows = PUBLIC_FEEDBACK;
  if (params?.role) rows = rows.filter((r) => r.role === params.role);
  return applyList(rows, params, {
    search: (r) => `${r.name} ${r.email ?? ""} ${r.message}`,
    sorters: { createdAt: (r) => r.createdAt, name: (r) => r.name },
    defaultSort: "createdAt",
    defaultDir: "desc",
  });
}
