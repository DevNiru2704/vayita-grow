"use client";

import { FileDown } from "lucide-react";
import { useRef, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatINR, formatINRCompact, formatNumber } from "@/lib/format";
import type { MonthlyOrderPoint } from "@/lib/services/dashboard";

/**
 * Revamped dashboard analytics (Recharts). A dropdown selects which chart is
 * shown; only the selected one is displayed. "Export PDF" rasterizes each
 * chart's SVG into a multi-page PDF. Colors use hex literals that mirror the
 * --chart-* design tokens so the serialized SVG is self-contained (Tailwind
 * v4's oklch computed colors can't be rasterized reliably).
 */

// Mirrors globals.css chart tokens.
const C = {
  s1: "#14833b",
  s2: "#58b478",
  s3: "#d4a017",
  s4: "#0a4520",
  s5: "#9bd4ac",
  grid: "#e3e8e4",
  axis: "#5b6b5f",
  text: "#14231a",
};
const SERIES = [C.s1, C.s3, C.s5, C.s2, C.s4];

export interface StatusDatum {
  status: string;
  count: number;
}

/**
 * Rasterizes a Recharts <svg> to a PNG data URL by serializing it (colors are
 * inline hex, so it is self-contained) and drawing it to a canvas. This avoids
 * html2canvas, which cannot parse Tailwind v4's oklch computed colors.
 */
async function svgToPng(svg: SVGElement): Promise<{ dataUrl: string; ratio: number }> {
  const rect = svg.getBoundingClientRect();
  const width = Math.round(rect.width) || 728;
  const height = Math.round(rect.height) || 340;

  const clone = svg.cloneNode(true) as SVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));
  const xml = new XMLSerializer().serializeToString(clone);
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;

  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("SVG load failed"));
    img.src = url;
  });

  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return { dataUrl: canvas.toDataURL("image/png"), ratio: width / height };
}

const CHART_TYPES = [
  { id: "revenue-area", label: "Revenue trend (area)" },
  { id: "orders-bar", label: "Orders per month (bar)" },
  { id: "status-bar", label: "Orders by status (bar)" },
  { id: "status-pie", label: "Order status share (donut)" },
] as const;
type ChartId = (typeof CHART_TYPES)[number]["id"];

/** The exact values a chart's hover tooltip reveals, as a table for the PDF. */
function chartTableData(
  id: ChartId,
  series: MonthlyOrderPoint[],
  status: StatusDatum[],
): { head: string[]; body: string[][] } {
  switch (id) {
    case "revenue-area":
      return {
        head: ["Month", "Revenue", "Orders"],
        body: series.map((p) => [p.month, formatINR(p.revenue), formatNumber(p.orders)]),
      };
    case "orders-bar":
      return {
        head: ["Month", "Orders"],
        body: series.map((p) => [p.month, formatNumber(p.orders)]),
      };
    default: // status-bar, status-pie
      return {
        head: ["Status", "Orders"],
        body: status.map((s) => [s.status, formatNumber(s.count)]),
      };
  }
}

const axisTick = { fill: C.axis, fontSize: 12 } as const;

function TooltipBox({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div
      style={{ background: "#fff", border: `1px solid ${C.grid}`, color: C.text }}
      className="rounded-lg px-3 py-2 text-sm shadow-md"
    >
      {rows.map((r) => (
        <p key={r.label}>
          {r.label}: <span style={{ fontWeight: 600 }}>{r.value}</span>
        </p>
      ))}
    </div>
  );
}

function Chart({ id, series, status }: { id: ChartId; series: MonthlyOrderPoint[]; status: StatusDatum[] }) {
  if (id === "revenue-area") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.s1} stopOpacity={0.22} />
              <stop offset="100%" stopColor={C.s1} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={C.grid} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={axisTick} dy={6} />
          <YAxis tickFormatter={(v: number) => formatINRCompact(v)} tickLine={false} axisLine={false} tick={axisTick} width={64} />
          <Tooltip
            cursor={{ stroke: C.grid }}
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <TooltipBox
                  rows={[
                    { label: String(label), value: formatINR((payload[0].payload as MonthlyOrderPoint).revenue) },
                    { label: "Orders", value: formatNumber((payload[0].payload as MonthlyOrderPoint).orders) },
                  ]}
                />
              ) : null
            }
          />
          <Area type="monotone" dataKey="revenue" stroke={C.s1} strokeWidth={2} fill="url(#rev)" isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (id === "orders-bar") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
          <CartesianGrid vertical={false} stroke={C.grid} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={axisTick} dy={6} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={axisTick} width={40} />
          <Tooltip
            cursor={{ fill: "rgba(20,131,59,0.06)" }}
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <TooltipBox rows={[{ label: String(label), value: `${formatNumber(Number(payload[0].value))} orders` }]} />
              ) : null
            }
          />
          <Bar dataKey="orders" fill={C.s1} radius={[4, 4, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (id === "status-bar") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={status} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
          <CartesianGrid vertical={false} stroke={C.grid} />
          <XAxis dataKey="status" tickLine={false} axisLine={false} tick={axisTick} dy={6} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={axisTick} width={40} />
          <Tooltip
            cursor={{ fill: "rgba(20,131,59,0.06)" }}
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <TooltipBox rows={[{ label: String(label), value: `${formatNumber(Number(payload[0].value))} orders` }]} />
              ) : null
            }
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} isAnimationActive={false}>
            {status.map((_, i) => (
              <Cell key={i} fill={SERIES[i % SERIES.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // status-pie
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip
          content={({ active, payload }) =>
            active && payload?.length ? (
              <TooltipBox
                rows={[
                  {
                    label: String((payload[0].payload as StatusDatum).status),
                    value: `${formatNumber((payload[0].payload as StatusDatum).count)} orders`,
                  },
                ]}
              />
            ) : null
          }
        />
        <Pie data={status} dataKey="count" nameKey="status" innerRadius={60} outerRadius={100} paddingAngle={2} isAnimationActive={false}>
          {status.map((_, i) => (
            <Cell key={i} fill={SERIES[i % SERIES.length]} stroke="#fff" strokeWidth={2} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function DashboardCharts({
  series,
  status,
}: {
  series: MonthlyOrderPoint[];
  status: StatusDatum[];
}) {
  const [selected, setSelected] = useState<ChartId>("revenue-area");
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  async function exportPdf() {
    if (!exportRef.current) return;
    setExporting(true);
    try {
      const [{ jsPDF }, autoTableModule] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);
      const autoTable = autoTableModule.default;
      const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const cards = Array.from(exportRef.current.querySelectorAll<HTMLElement>("[data-chart-card]"));

      let rendered = 0;
      for (let i = 0; i < cards.length; i++) {
        const svg = cards[i].querySelector("svg");
        if (!svg) continue;
        const { dataUrl, ratio } = await svgToPng(svg);
        if (rendered > 0) doc.addPage();
        rendered++;

        doc.setFontSize(13);
        doc.setTextColor(20, 35, 26);
        doc.text(CHART_TYPES[i].label, 40, 42);
        doc.setFontSize(9);
        doc.setTextColor(150, 158, 153);
        doc.text("VayitaGrow — Dashboard analytics", 40, 58);

        // Chart image (height-capped to leave room for the data table).
        let w = pageWidth - 80;
        let h = w / ratio;
        const maxImgH = 290;
        if (h > maxImgH) {
          h = maxImgH;
          w = h * ratio;
        }
        const x = (pageWidth - w) / 2;
        doc.addImage(dataUrl, "PNG", x, 72, w, h);

        // The hover values, printed as a table so the PDF is self-explanatory.
        const { head, body } = chartTableData(CHART_TYPES[i].id, series, status);
        doc.setFontSize(9);
        doc.setTextColor(120, 128, 123);
        doc.text("Values shown on hover", 40, 72 + h + 22);
        autoTable(doc, {
          startY: 72 + h + 30,
          head: [head],
          body,
          theme: "striped",
          styles: { fontSize: 9, cellPadding: 4 },
          headStyles: { fillColor: [20, 131, 59], textColor: 255 },
          margin: { left: 40, right: 40 },
        });
      }
      doc.save("dashboard-charts.pdf");
    } catch (err) {
      console.error("[charts-pdf] export failed:", err);
      toast.error("Could not export charts. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <section aria-labelledby="analytics-heading" className="rounded-xl border bg-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="analytics-heading" className="font-sans text-base font-semibold">
          Analytics
        </h2>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="chart-type">
            Chart type
          </label>
          <select
            id="chart-type"
            value={selected}
            onChange={(e) => setSelected(e.target.value as ChartId)}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm font-medium focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {CHART_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          <Button type="button" variant="outline" onClick={exportPdf} disabled={exporting}>
            <FileDown aria-hidden data-icon="inline-start" />
            {exporting ? "Exporting…" : "Export PDF"}
          </Button>
        </div>
      </div>

      <div className="h-[320px] w-full">
        <Chart id={selected} series={series} status={status} />
      </div>

      {/* Off-screen: all charts rendered for the multi-page PDF export. */}
      <div
        ref={exportRef}
        aria-hidden
        style={{ position: "fixed", left: -100000, top: 0, pointerEvents: "none" }}
      >
        {CHART_TYPES.map((t) => (
          <div
            key={t.id}
            data-chart-card
            style={{ width: 760, background: "#ffffff", color: C.text, padding: 16 }}
          >
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{t.label}</p>
            <div style={{ width: 728, height: 340 }}>
              <Chart id={t.id} series={series} status={status} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
