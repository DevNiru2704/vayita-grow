/**
 * EXTENSION: not in DB design v1.2.0 - backend schema addition required.
 * Statements are a confirmed client requirement (dealer account statements
 * uploaded by staff; see docs/project_details/client_talk_notes.md).
 */

export interface Statement {
  statementId: number;
  statementNumber: string;
  customerId: number;
  periodLabel: string;
  uploadDate: string;
  uploadedBy: number;
}

export interface StatementWithCustomer extends Statement {
  customerName: string;
  uploadedByUsername: string;
}

export interface StatementInput {
  customerId: number;
  periodLabel: string;
}
