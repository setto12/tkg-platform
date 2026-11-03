// src/app/reports/page.jsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { Card } from "@/components/ui/card";
import ReportDateSelector from "@/components/ReportDateSelector";
// Add this inside your ReportsPage component:
import { useRouter } from "next/navigation";

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
import ReportStandardsList from "@/components/ReportStandardList";

export default function ReportsPage() {
  const router = useRouter();

  useEffect(() => {
    const isAuthorized = sessionStorage.getItem("isAuthorized");
    if (!isAuthorized) {
      router.push("/login");
    }
  }, [router]);
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

  const totalStudents = attendanceData?.total_students_count ?? 238;
  const totalPresent = attendanceData?.total_present ?? 238;
  const totalAbsent = attendanceData?.total_absent ?? 0;
  const totalNotAssessed = attendanceData?.total_not_assessed ?? 0;

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
          {/* Top Row: Attendance & Average Exit Ticket Scores Cards */}
          <Card
            title="Attendance"
            value={loading ? "Loading..." : attendanceDisplay}
          />
          <Card
            title="Average Exit Ticket Scores"
            value={loading ? "Loading..." : exitScoreDisplay}
          />

          {/* Insight Card Styled to Match Color Rules */}
          <div className="sm:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-1">
            <h3 className="text-sm font-bold text-[#101a2b]">
              Assessment & Session Insight
            </h3>
            <p className="text-sm text-slate-600">
              {loading ? (
                "Calculating insights..."
              ) : (
                <>
                  Out of{" "}
                  <span className="font-bold text-[#101a2b]">
                    {totalStudents}
                  </span>{" "}
                  students,{" "}
                  <span className="font-bold text-[#101a2b]">
                    {totalAbsent}
                  </span>{" "}
                  were absent, and{" "}
                  <span className="font-bold text-[#101a2b]">
                    {totalNotAssessed}
                  </span>{" "}
                  could not be assessed due to technical difficulties.
                </>
              )}
            </p>
          </div>

          {/* Reusable Sorted Standards Component */}
          <ReportStandardsList
            skillStandards={skillStandards}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
