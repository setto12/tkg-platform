// src/app/reports/page.jsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { Card } from "@/components/ui/card";
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

        {/* Date Selector & View Mode Controls */}
        <div className="flex items-center gap-3 bg-white p-2 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex bg-slate-100 p-1 rounded-lg text-sm font-medium">
            <button
              onClick={() => setViewMode("day")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewMode === "day"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewMode === "week"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Week
            </button>
          </div>

          {/* Calendar Input */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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
