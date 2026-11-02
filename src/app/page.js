// src/app/page.jsx
import { Card } from "@/components/ui/card";

export default function Home() {
  const metrics = [
    { id: 1, title: "Student Groups", value: 63 },
    { id: 2, title: "Total Students", value: 412 },
    { id: 3, title: "Active Tutors", value: 28 },
    { id: 4, title: "Reports Generated", value: 1250 },
  ];

  return (
    <div className="space-y-8">
      {/* Dashboard Section Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#101a2b]">
          Overview Dashboard
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Real-time metric summary synced across your platforms.
        </p>
      </div>

      {/* Responsive Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card
            key={metric.id}
            title={metric.title}
            value={metric.value}
          />
        ))}
      </div>
    </div>
  );
}