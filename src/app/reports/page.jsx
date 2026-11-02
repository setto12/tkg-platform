// src/app/reports/page.jsx
import { Card } from "@/components/ui/card";

export default function ReportsPage() {
  const reportMetrics = [
    { id: 1, title: "Attendance", value: "238/238" },
    { id: 2, title: "Exit Ticket Scores", value: "100%" },
  ];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#101a2b]">
          Reports Overview
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Summary metrics pulled from session reports and exit ticket
          evaluations.
        </p>
      </div>

      {/* Centered Cards Container */}
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
          {reportMetrics.map((metric) => (
            <Card key={metric.id} title={metric.title} value={metric.value} />
          ))}
        </div>
      </div>
    </div>
  );
}
