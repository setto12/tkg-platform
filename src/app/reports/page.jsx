// src/app/reports/page.jsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { Card } from "@/components/ui/card";
import ReportDateSelector from "@/components/ReportDateSelector";
import {
  getAttendanceByDay,
  getAttendanceByWeek,
} from "../services/attendanceAggregationService";
import {
  getExitTicketAverageByDay,
  getExitTicketAverageByWeek,
} from "../services/exitTicketService";

export default function ReportsPage() {
  const [selectedDate, setSelectedDate] = useState("2026-10-27");
  const [viewMode, setViewMode] = useState("day"); // 'day' or 'week'
  const [displayMode, setDisplayMode] = useState("percentage"); // <-- Set default to percentage here
  const [attendanceData, setAttendanceData] = useState(null);
  const [exitTicketData, setExitTicketData] = useState(null);
  const [loading, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const [y, m, d] = selectedDate.split("-");
      const formattedDate = `${m}/${d}/${y}`;

      let attData = null;
      let exitData = null;

      if (viewMode === "day") {
        attData = await getAttendanceByDay(formattedDate);
        exitData = await getExitTicketAverageByDay(formattedDate);
      } else {
        attData = await getAttendanceByWeek(formattedDate);
        exitData = await getExitTicketAverageByWeek(formattedDate);
      }

      setAttendanceData(attData);
      setExitTicketData(exitData);
    });
  }, [selectedDate, viewMode]);

  // --- Attendance Formatting ---
  const totalPresent = attendanceData?.total_present ?? 238;
  const totalStudents = attendanceData?.total_students_count ?? 238;

  let attendanceDisplay = `${totalPresent}/${totalStudents}`;
  if (displayMode === "percentage" && totalStudents > 0) {
    const attPct = (totalPresent / totalStudents) * 100;
    attendanceDisplay = `${attPct.toFixed(1)}%`;
  }

  // --- Exit Ticket Formatting ---
  let exitScoreDisplay = exitTicketData?.averageScore ?? "3.0/3";
  if (displayMode === "percentage") {
    exitScoreDisplay = exitTicketData?.averagePercentage ?? "100%";
  }

  const reportMetrics = [
    {
      id: 1,
      title: "Attendance",
      value: loading ? "Loading..." : attendanceDisplay,
    },
    {
      id: 2,
      title: "Average Exit Ticket Scores",
      value: loading ? "Loading..." : exitScoreDisplay,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Section Header & Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#101a2b]">
            Reports Overview
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Summary metrics pulled from session reports and exit ticket
            evaluations.
          </p>
        </div>

        {/* Reusable Calendar Component with Format Toggle */}
        <ReportDateSelector
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          viewMode={viewMode}
          setViewMode={setViewMode}
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
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
