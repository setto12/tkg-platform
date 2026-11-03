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
import {
  getSkillStandardsByDay,
  getSkillStandardsByWeek,
} from "../services/skillStandardService";

import { supabase } from "@/lib/supabase";
import { getAvailableDateBounds } from "../services/reportDateRangeService";

export default function ReportsPage() {
  const [selectedDate, setSelectedDate] = useState("2026-10-27");
  const [viewMode, setViewMode] = useState("day");
  const [displayMode, setDisplayMode] = useState("percentage");
  const [dateBounds, setDateBounds] = useState({
    minDate: "2026-01-01",
    maxDate: "2026-12-31",
  });

  const [attendanceData, setAttendanceData] = useState(null);
  const [exitTicketData, setExitTicketData] = useState(null);
  const [skillStandards, setSkillStandards] = useState([]);

  const [loading, startTransition] = useTransition();

  useEffect(() => {
    async function loadBounds() {
      const bounds = await getAvailableDateBounds();
      setDateBounds(bounds);
      setSelectedDate(bounds.maxDate);
    }
    loadBounds();
  }, []);

  useEffect(() => {
    startTransition(async () => {
      const [y, m, d] = selectedDate.split("-");
      const formattedDate = `${m}/${d}/${y}`;

      const { data: rawRows } = await supabase
        .from("tutor_reports_export")
        .select("*");

      const filteredRows = (rawRows || []).filter((row) => {
        const lessonStart = row.lesson_start;
        if (!lessonStart) return false;
        const datePart = lessonStart.split(" ")[0];

        if (viewMode === "day") {
          return datePart === formattedDate;
        } else {
          try {
            const [rm, rd, ry] = datePart.split("/").map(Number);
            const rowDt = new Date(ry, rm - 1, rd);
            const [sm, sd, sy] = formattedDate.split("/").map(Number);
            const startDt = new Date(sy, sm - 1, sd);
            const endDt = new Date(sy, sm - 1, sd + 6);
            return rowDt >= startDt && rowDt <= endDt;
          } catch {
            return false;
          }
        }
      });

      let attData = null;
      let exitData = null;
      let standardsData = [];

      if (viewMode === "day") {
        attData = await getAttendanceByDay(formattedDate);
        exitData = await getExitTicketAverageByDay(formattedDate);
        standardsData = await getSkillStandardsByDay(
          formattedDate,
          filteredRows,
        );
      } else {
        attData = await getAttendanceByWeek(formattedDate);
        exitData = await getExitTicketAverageByWeek(formattedDate);
        standardsData = await getSkillStandardsByWeek(
          formattedDate,
          filteredRows,
        );
      }

      setAttendanceData(attData);
      setExitTicketData(exitData);
      setSkillStandards(standardsData);
    });
  }, [selectedDate, viewMode]);

  const totalPresent = attendanceData?.total_present ?? 238;
  const totalStudents = attendanceData?.total_students_count ?? 238;

  let attendanceDisplay = `${totalPresent}/${totalStudents}`;
  if (displayMode === "percentage" && totalStudents > 0) {
    const attPct = (totalPresent / totalStudents) * 100;
    attendanceDisplay = `${attPct.toFixed(1)}%`;
  }

  let exitScoreDisplay = exitTicketData?.averageScore ?? "3.0/3";
  if (displayMode === "percentage") {
    exitScoreDisplay = exitTicketData?.averagePercentage ?? "100%";
  }

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

        <ReportDateSelector
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          viewMode={viewMode}
          setViewMode={setViewMode}
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
          minDate={dateBounds.minDate}
          maxDate={dateBounds.maxDate}
        />
      </div>

      {/* Cards Container */}
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Top Row: Attendance & Exit Ticket Scores Cards */}
          <Card
            title="Attendance"
            value={loading ? "Loading..." : attendanceDisplay}
          />
          <Card
            title="Average Exit Ticket Scores"
            value={loading ? "Loading..." : exitScoreDisplay}
          />

          {/* Bottom Container: Standards & Individual Grades */}
          <div className="sm:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#101a2b]">
              Skill Standards Addressed
            </h2>

            {loading ? (
              <p className="text-sm text-slate-500">Loading standards...</p>
            ) : skillStandards.length > 0 ? (
              <div className="space-y-3">
                {skillStandards.map((std, idx) => (
                  <div
                    key={idx}
                    className="border-b border-slate-100 pb-3 last:border-none last:pb-0"
                  >
                    <p className="text-sm font-semibold text-slate-900">
                      {std.title}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {std.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No standards recorded for this period.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
