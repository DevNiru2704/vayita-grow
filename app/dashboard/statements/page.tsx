import { FileText, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { statements } from "@/lib/data";

export default function StatementsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-brand-dark mb-1">
          Statements
        </h1>
        <p className="text-sm text-brand-body">
          View and download client account statements.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statements.map((statement) => (
          <div
            key={statement.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-brand-border hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-dark truncate">
                  {statement.statementNumber}
                </p>
                <p className="text-sm text-brand-body truncate mt-0.5">
                  {statement.clientName}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Calendar className="w-3 h-3 text-brand-body" />
                  <span className="text-xs text-brand-body">
                    {new Date(statement.uploadDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-xs text-brand-body mx-1">|</span>
                  <span className="text-xs font-medium text-brand-primary">
                    {statement.period}
                  </span>
                </div>
              </div>
            </div>
            <Button
              className="w-full mt-4 bg-brand-section text-brand-dark hover:bg-brand-light border border-brand-border rounded-xl h-9 text-xs font-medium"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download PDF
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
