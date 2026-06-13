import Image from "next/image";
import { MapPin, Calendar, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fieldReports } from "@/lib/data";

export default function FieldReportsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-brand-dark mb-1">
          Field Reports
        </h1>
        <p className="text-sm text-brand-body">
          Field visit reports from dealer and farmer engagement activities.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fieldReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-brand-border hover:shadow-md transition-shadow"
          >
            {/* Photo */}
            <div className="relative h-32 rounded-xl bg-brand-light overflow-hidden mb-4">
              <Image
                src={`https://images.unsplash.com/photo-1553484771-689277e6fa16?auto=format&fit=crop&w=400&q=80&sig=${report.id}`}
                alt="Field Report Photo"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-body" />
                <span className="text-xs text-brand-body">
                  {new Date(report.visitDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <Badge
                className={`rounded-full text-xs font-medium px-2 py-0.5 ${
                  report.status === "Completed"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {report.status}
              </Badge>
            </div>

            <h3 className="text-sm font-semibold text-brand-dark mb-1">
              {report.dealerName}
            </h3>
            <div className="flex items-center gap-1.5 mb-3">
              <MapPin className="w-3 h-3 text-brand-body shrink-0" />
              <span className="text-xs text-brand-body">{report.location}</span>
            </div>
            <p className="text-xs text-brand-body leading-relaxed line-clamp-3">
              {report.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
