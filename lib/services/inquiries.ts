import { isSupabase } from "@/lib/db/source";
import * as mock from "./inquiries.mock";
import * as pg from "./inquiries.pg";

/** Source-aware reads for the public contact + feedback inboxes. Read-only. */
export const getContactInquiries = isSupabase ? pg.getContactInquiries : mock.getContactInquiries;
export const getPublicFeedback = isSupabase ? pg.getPublicFeedback : mock.getPublicFeedback;
