import type { FieldReportStatus } from "./database";

/**
 * EXTENSION: not in DB design v1.2.0 - backend schema addition required.
 * Field reports are a confirmed client requirement (field staff visit
 * reports; see docs/project_details/client_requirements.md).
 */

export interface FieldReport {
  reportId: number;
  visitDate: string;
  customerId: number | null;
  dealerName: string;
  location: string;
  summary: string;
  status: FieldReportStatus;
  createdBy: number;
  createdByUsername: string;
  createdAt: string;
}

export interface FieldReportInput {
  visitDate: string;
  customerId: number | null;
  dealerName: string;
  location: string;
  summary: string;
  status: FieldReportStatus;
}
