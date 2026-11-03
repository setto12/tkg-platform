// src/app/reports/page.jsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { Card } from "@/components/ui/card";
import ReportDateSelector from "@/components/ReportDateSelector";
import {
  getAttendanceByDay,
  getAttendanceByWeek,
} from "../services/attendanceAggregationService";

export default function ReportsPage() {
  const [selectedDate, setSelectedDate] = useState("2026-10-27"); // HTML date format
  const [viewMode, setViewMode] = useState("day"); // 'day' or 'week'
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      // Convert 'YYYY-MM-DD' to 'MM/DD/YYYY' expected by our service
      const [y, m, d] = selectedDate.split("-");
      const formattedDate = `${m}/${d}/${y}`;

      let data = null;
      if (viewMode === "day") {
        data = await getAttendanceByDay(formattedDate);
      } else {
        data = await getAttendanceByWeek(formattedDate);
      }
      setAttendanceData(data);
    });
  }, [selectedDate, viewMode]);

  // Compute dynamic attendance ratio (Present / Total Students Logged)
  const totalPresent = attendanceData?.total_present ?? 238;
  const totalStudents = attendanceData?.total_students_count ?? 238;
  const attendanceDisplay = loading
    ? "Loading..."
    : `${totalPresent}/${totalStudents}`;

  const reportMetrics = [
    { id: 1, title: "Attendance", value: attendanceDisplay },
    { id: 2, title: "Exit Ticket Scores", value: "100%" },
  ];

  return (
    <div className="space-y-8">
      {/* Section Header & Calendar/View Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#101a2b]">
            Reports Overview
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Summary metrics pulled from session reports and exit ticket
            evaluations.
          </p>
        </div>

        {/* Reusable Calendar Component */}
        <ReportDateSelector
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      </div>

      {/* Centered Cards Container */}
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
          {reportMetrics.map((metric) => (
            <Card key={metric.id} title={metric.title} value={metric.value} />
          ))}
        </div>
      </div>
    </div>
  );
}
