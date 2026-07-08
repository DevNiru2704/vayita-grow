import "server-only";
import ExcelJS from "exceljs";

/**
 * Server-side .xlsx generation for dashboard exports. Column values are pulled
 * from typed rows; the workbook is returned as a downloadable Response.
 */

export interface ExportColumn<T> {
  header: string;
  width?: number;
  value: (row: T) => string | number | null;
}

export async function xlsxResponse<T>(
  filename: string,
  sheetName: string,
  columns: ExportColumn<T>[],
  rows: T[],
): Promise<Response> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "VayitaGrow Portal";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet(sheetName);
  sheet.columns = columns.map((c) => ({ header: c.header, key: c.header, width: c.width ?? 22 }));
  for (const row of rows) sheet.addRow(columns.map((c) => c.value(row) ?? ""));

  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF14833B" } };
  header.alignment = { vertical: "middle" };
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
