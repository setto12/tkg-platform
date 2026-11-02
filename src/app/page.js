// src/app/page.jsx
import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";

export default function Home() {
  const metrics = [
    { id: 1, title: "Student Groups", value: 63 },
    { id: 2, title: "Students", value: 238 },
    { id: 3, title: "Active Tutors", value: 32 },
    { id: 4, title: "Assigned Groups", value: 63 },
    { id: 5, title: "Unassigned Groups", value: 0 },
    { id: 6, title: "Conflicts", value: 0 },
    { id: 7, title: "Morning Tutor Shortage", value: 0 },
    { id: 8, title: "On District List", value: 233 },
  ];
  
  // Sample data simulating student group tracking
  const tableHeaders = ["Group Name", "Tutor", "Students Enrolled", "Status", "Attendance Rate"];
  const tableData = [
    ["Group JAC-G3-02", "Tutor Name", "4", "Planned", "100%"],
    ["Group JAC-G3-03", "Jane Doe", "3", "Completed", "90%"],
    ["Group BAL-G4-01", "John Smith", "5", "Planned", "95%"],
  ];
  const tableTotal = ["Total / Average", "-", "12 Students", "3 Active Groups", "95% Avg"];
  return (
    <div className="space-y-8">
      {/* Dashboard Section Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#101a2b]">
          Platform Dashboard
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Current operational metrics (Hardcoded preview — ready for Supabase sync).
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
      {/* Reusable Table Section */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-[#101a2b]">
          Recent Student Groups
        </h2>
        <Table 
          headers={tableHeaders} 
          data={tableData} 
          totalRow={tableTotal} 
        />
      </div>
    </div>
  );
}