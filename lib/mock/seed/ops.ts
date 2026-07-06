import type { ActivityLog } from "@/lib/types/activity";
import type { FeedbackTicket } from "@/lib/types/feedback";
import type { FieldReport } from "@/lib/types/field-report";
import type { SystemSetting } from "@/lib/types/settings";
import type { Statement } from "@/lib/types/statement";

/**
 * DEMO operational data - statements, field reports, internal feedback,
 * activity log, and system settings. Field reports reference only the REAL
 * product catalog and the two real operating states (WB + Jharkhand).
 */

export const seedStatements: Statement[] = [
  { statementId: 1, statementNumber: "STM-2026-001", customerId: 1, periodLabel: "Q3 FY25-26 (Oct-Dec 2025)", uploadDate: "2026-01-10T09:00:00.000Z", uploadedBy: 2 },
  { statementId: 2, statementNumber: "STM-2026-002", customerId: 8, periodLabel: "Q3 FY25-26 (Oct-Dec 2025)", uploadDate: "2026-01-10T09:20:00.000Z", uploadedBy: 2 },
  { statementId: 3, statementNumber: "STM-2026-003", customerId: 2, periodLabel: "Q4 FY25-26 (Jan-Mar 2026)", uploadDate: "2026-04-08T08:30:00.000Z", uploadedBy: 2 },
  { statementId: 4, statementNumber: "STM-2026-004", customerId: 9, periodLabel: "Q4 FY25-26 (Jan-Mar 2026)", uploadDate: "2026-04-08T08:45:00.000Z", uploadedBy: 2 },
  { statementId: 5, statementNumber: "STM-2026-005", customerId: 4, periodLabel: "Q4 FY25-26 (Jan-Mar 2026)", uploadDate: "2026-04-09T10:00:00.000Z", uploadedBy: 2 },
  { statementId: 6, statementNumber: "STM-2026-006", customerId: 5, periodLabel: "Apr 2026", uploadDate: "2026-05-05T09:10:00.000Z", uploadedBy: 2 },
  { statementId: 7, statementNumber: "STM-2026-007", customerId: 11, periodLabel: "May 2026", uploadDate: "2026-06-04T08:50:00.000Z", uploadedBy: 2 },
  { statementId: 8, statementNumber: "STM-2026-008", customerId: 1, periodLabel: "Q1 FY26-27 (Apr-Jun 2026)", uploadDate: "2026-07-02T09:30:00.000Z", uploadedBy: 2 },
];

export const seedFieldReports: FieldReport[] = [
  {
    reportId: 1, visitDate: "2026-05-06", customerId: 1, dealerName: "Bengal Agro Distributors", location: "Kolkata, West Bengal",
    summary: "Quarterly business review with the proprietor. VEER-L and V-LEAF continue to be the fastest-moving SKUs among vegetable growers in the 24 Parganas belt. Dealer requested additional Bengali-language leaflets for counter display.",
    status: "Completed", createdBy: 3, createdByUsername: "sourav.field", createdAt: "2026-05-06T12:00:00.000Z",
  },
  {
    reportId: 2, visitDate: "2026-05-13", customerId: 6, dealerName: "Malda Krishi Seva Kendra", location: "Malda, West Bengal",
    summary: "New dealer onboarding visit. Demonstrated V-BOOST application on mango orchards with 15 growers present. Strong interest ahead of the flowering season; initial stocking order placed for V-BOOST and V-FIX.",
    status: "Completed", createdBy: 3, createdByUsername: "sourav.field", createdAt: "2026-05-13T11:30:00.000Z",
  },
  {
    reportId: 3, visitDate: "2026-05-21", customerId: 8, dealerName: "Ranchi Agro Agencies", location: "Ranchi, Jharkhand",
    summary: "Conducted staff training on VEER-P soil conditioner dosage and application ahead of kharif sowing. Eight counter staff attended. Dealer flagged demand for smaller JAIVIK GOLD pack sizes in tribal-belt markets.",
    status: "Follow_Up_Required", createdBy: 4, createdByUsername: "prakash.field", createdAt: "2026-05-21T13:15:00.000Z",
  },
  {
    reportId: 4, visitDate: "2026-06-03", customerId: 4, dealerName: "Burdwan Agro Centre", location: "Bardhaman, West Bengal",
    summary: "Field inspection of paddy nurseries treated with JYME-VITA. Farmers reported visibly improved seedling vigor versus untreated plots. Collected soil samples for pH analysis to support a V-pH recommendation.",
    status: "Completed", createdBy: 3, createdByUsername: "sourav.field", createdAt: "2026-06-03T10:45:00.000Z",
  },
  {
    reportId: 5, visitDate: "2026-06-11", customerId: 9, dealerName: "Jamshedpur Farm Solutions", location: "Jamshedpur, Jharkhand",
    summary: "Joint farmer meeting with 30 vegetable growers from the Kolhan region. Demonstrated V-RICH granule broadcasting and V-FIX spray mixing. Dealer to organize a follow-up demo plot visit after three weeks.",
    status: "Follow_Up_Required", createdBy: 4, createdByUsername: "prakash.field", createdAt: "2026-06-11T14:00:00.000Z",
  },
  {
    reportId: 6, visitDate: "2026-06-18", customerId: 5, dealerName: "Siliguri Farm Supplies", location: "Siliguri, West Bengal",
    summary: "Reviewed tea-garden trial of VEER-L on young bushes; garden manager noted improved flush recovery after pruning. Discussed monsoon logistics and buffer stocking for North Bengal routes.",
    status: "Completed", createdBy: 3, createdByUsername: "sourav.field", createdAt: "2026-06-18T09:50:00.000Z",
  },
  {
    reportId: 7, visitDate: "2026-06-25", customerId: 11, dealerName: "Hazaribagh Agro Mart", location: "Hazaribagh, Jharkhand",
    summary: "Addressed a complaint about a delayed May consignment; shared revised dispatch schedule and courier tracking process. Counter display refreshed with the new product range chart.",
    status: "Completed", createdBy: 4, createdByUsername: "prakash.field", createdAt: "2026-06-25T12:30:00.000Z",
  },
  {
    reportId: 8, visitDate: "2026-07-02", customerId: 7, dealerName: "Nadia Agri Traders", location: "Krishnanagar, West Bengal",
    summary: "Pre-season planning visit for flower growers around Ranaghat. Recommended VITA-A plus V-BOOST program for marigold and tuberose plots. Dealer requested credit-period revision - forwarded to admin for decision.",
    status: "Follow_Up_Required", createdBy: 3, createdByUsername: "sourav.field", createdAt: "2026-07-02T11:20:00.000Z",
  },
];

export const seedFeedback: FeedbackTicket[] = [
  { feedbackId: 1, userId: 3, subject: "Bengali leaflets running low", message: "Several WB dealers have requested more printed Bengali product leaflets. Current stock at the Kolkata depot is nearly exhausted. Requesting a reprint before the kharif campaign.", status: "In_Progress", createdAt: "2026-06-20T08:00:00.000Z" },
  { feedbackId: 2, userId: 4, subject: "Courier delays on Hazaribagh route", message: "Two consecutive consignments to Hazaribagh Agro Mart arrived 3-4 days late. Suggest evaluating an alternate courier for the North Chotanagpur routes.", status: "Open", createdAt: "2026-06-26T09:30:00.000Z" },
  { feedbackId: 3, userId: 2, subject: "Statement upload workflow", message: "Monthly statement uploads for all dealers currently take most of a working day. A bulk upload option in the next system version would save significant time.", status: "Open", createdAt: "2026-07-01T10:15:00.000Z" },
  { feedbackId: 4, userId: 3, subject: "Demo plot signage", message: "Demo plots in Malda and Bardhaman need weather-proof signage boards with the company branding. Local printing quotes attached for approval.", status: "Resolved", createdAt: "2026-05-28T07:45:00.000Z" },
];

export const seedActivityLogs: ActivityLog[] = [
  { logId: 1, userId: 2, actionType: "LOGIN", entityType: "SYSTEM", entityId: null, ipAddress: "103.87.24.11", createdAt: "2026-07-01T03:55:00.000Z" },
  { logId: 2, userId: 2, actionType: "CREATE", entityType: "ORDER", entityId: 16, ipAddress: "103.87.24.11", createdAt: "2026-07-02T08:10:00.000Z" },
  { logId: 3, userId: 4, actionType: "LOGIN", entityType: "SYSTEM", entityId: null, ipAddress: "45.118.70.92", createdAt: "2026-07-02T08:20:00.000Z" },
  { logId: 4, userId: 2, actionType: "UPDATE", entityType: "INVENTORY", entityId: 7, ipAddress: "103.87.24.11", createdAt: "2026-07-03T06:40:00.000Z" },
  { logId: 5, userId: 2, actionType: "CREATE", entityType: "ORDER", entityId: 17, ipAddress: "103.87.24.11", createdAt: "2026-07-03T05:25:00.000Z" },
];

export const seedSettings: SystemSetting[] = [
  { settingId: 1, settingKey: "company_display_name", settingValue: "VayitaGrow Bioorganics" },
  { settingId: 2, settingKey: "default_currency", settingValue: "INR" },
  { settingId: 3, settingKey: "financial_year_start", settingValue: "April" },
  { settingId: 4, settingKey: "low_stock_threshold", settingValue: "50" },
  { settingId: 5, settingKey: "order_id_prefix", settingValue: "ORD" },
  { settingId: 6, settingKey: "statement_id_prefix", settingValue: "STM" },
];
