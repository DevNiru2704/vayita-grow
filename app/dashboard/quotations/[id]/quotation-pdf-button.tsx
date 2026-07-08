"use client";

import { FileDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { company } from "@/lib/config/company";

export interface QuotationPdfData {
  quotationNumber: string;
  customerName: string;
  status: string;
  createdAt: string;
  validUntil: string | null;
  createdByUsername: string;
  assignedStaffName: string | null;
  notes: string | null;
  totalAmount: number;
  items: { productName: string; sku: string; quantity: number; unitPrice: number }[];
}

const BRAND: [number, number, number] = [20, 131, 59]; // --brand-600 #14833b

function inr(amount: number): string {
  return `INR ${new Intl.NumberFormat("en-IN").format(amount)}`;
}

/** Rasterizes the SVG logo to a PNG data URL for embedding in the PDF. */
async function loadLogo(): Promise<{ dataUrl: string; ratio: number } | null> {
  try {
    const img = new Image();
    img.src = "/vayitagrow_logo.svg";
    await img.decode();
    const w = img.naturalWidth || 612;
    const h = img.naturalHeight || 408;
    const canvas = document.createElement("canvas");
    canvas.width = w * 2;
    canvas.height = h * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return { dataUrl: canvas.toDataURL("image/png"), ratio: w / h };
  } catch {
    return null;
  }
}

export function QuotationPdfButton({ quotation }: { quotation: QuotationPdfData }) {
  const [busy, setBusy] = useState(false);

  async function handleExport() {
    setBusy(true);
    try {
      const [{ jsPDF }, autoTableModule, logo] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
        loadLogo(),
      ]);
      const autoTable = autoTableModule.default;
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;

      // Header band
      doc.setFillColor(...BRAND);
      doc.rect(0, 0, pageWidth, 8, "F");

      let logoBottom = 54;
      if (logo) {
        const logoH = 34;
        doc.addImage(logo.dataUrl, "PNG", margin, 28, logoH * logo.ratio, logoH);
        logoBottom = 28 + logoH;
      } else {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(...BRAND);
        doc.text(company.displayName, margin, 46);
      }

      // Company block (right aligned)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(90, 107, 95);
      const rightLines = [company.legalName, ...company.contact.addressLines, company.contact.email];
      rightLines.forEach((line, i) => {
        doc.text(line, pageWidth - margin, 34 + i * 12, { align: "right" });
      });

      // Title
      const titleY = Math.max(logoBottom, 34 + rightLines.length * 12) + 28;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(20, 35, 26);
      doc.text("QUOTATION", margin, titleY);
      doc.setFontSize(11);
      doc.setTextColor(90, 107, 95);
      doc.text(quotation.quotationNumber, margin, titleY + 16);

      // Meta grid
      const metaY = titleY + 40;
      const meta: [string, string][] = [
        ["Client", quotation.customerName],
        ["Status", quotation.status],
        ["Date", new Date(quotation.createdAt).toLocaleDateString("en-IN")],
        ["Valid until", quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString("en-IN") : "—"],
        ["Prepared by", quotation.createdByUsername],
        ["Assigned to", quotation.assignedStaffName ?? "Unassigned"],
      ];
      doc.setFontSize(9);
      meta.forEach(([label, value], i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = margin + col * (pageWidth / 2 - margin);
        const y = metaY + row * 18;
        doc.setTextColor(120, 130, 124);
        doc.text(label.toUpperCase(), x, y);
        doc.setTextColor(20, 35, 26);
        doc.setFont("helvetica", "bold");
        doc.text(value, x + 70, y);
        doc.setFont("helvetica", "normal");
      });

      // Items table
      autoTable(doc, {
        startY: metaY + Math.ceil(meta.length / 2) * 18 + 14,
        head: [["Product", "SKU", "Qty", "Unit price", "Line total"]],
        body: quotation.items.map((it) => [
          it.productName,
          it.sku,
          String(it.quantity),
          inr(it.unitPrice),
          inr(it.unitPrice * it.quantity),
        ]),
        foot: [["", "", "", "Total", inr(quotation.totalAmount)]],
        theme: "grid",
        headStyles: { fillColor: BRAND, textColor: 255, fontStyle: "bold" },
        footStyles: { fillColor: [240, 245, 241], textColor: [20, 35, 26], fontStyle: "bold" },
        columnStyles: {
          2: { halign: "right" },
          3: { halign: "right" },
          4: { halign: "right" },
        },
        styles: { fontSize: 9, cellPadding: 6 },
        margin: { left: margin, right: margin },
      });

      // Notes + footer
      const afterTable = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
      if (quotation.notes) {
        doc.setFontSize(9);
        doc.setTextColor(120, 130, 124);
        doc.text("NOTES", margin, afterTable + 24);
        doc.setTextColor(20, 35, 26);
        doc.text(doc.splitTextToSize(quotation.notes, pageWidth - margin * 2), margin, afterTable + 38);
      }

      doc.setFontSize(8);
      doc.setTextColor(150, 158, 153);
      doc.text(
        `${company.contact.landline} · ${company.contact.email} · Computer-generated quotation`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 24,
        { align: "center" },
      );

      doc.save(`${quotation.quotationNumber}.pdf`);
    } catch (err) {
      console.error("[quotation-pdf] export failed:", err);
      toast.error("Could not generate the PDF. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button type="button" variant="outline" size="lg" onClick={handleExport} disabled={busy}>
      <FileDown aria-hidden data-icon="inline-start" />
      {busy ? "Preparing…" : "Export PDF"}
    </Button>
  );
}
