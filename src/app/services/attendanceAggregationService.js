// src/services/attendanceAggregationService.js
import { supabase } from "@/lib/supabase";

/**
 * Helper to fetch and aggregate attendance metrics from rows
 */
function aggregateAttendanceData(rows) {
  const lessonMap = {};
  let totalStudentsCount = 0;
  let totalPresentCount = 0;
  let totalAbsentCount = 0;

  rows.forEach((row) => {
    const lessonId = row.lesson_id || row.lesson_topic || "unknown_lesson";
    const student = row.student;
    const clientReport = (row.client_report || "").trim().toLowerCase();

    if (!lessonMap[lessonId]) {
      lessonMap[lessonId] = {
        lesson_id: lessonId,
        lesson_topic: row.lesson_topic || "Untitled Lesson",
        lesson_start: row.lesson_start,
        students: new Set(),
        present: 0,
        absent: 0,
      };
    }

    if (student) {
      lessonMap[lessonId].students.add(student);
    }

    // Count present or absent based on client_report column
    if (clientReport === "present") {
      lessonMap[lessonId].present += 1;
      totalPresentCount += 1;
    } else if (clientReport === "absent") {
      lessonMap[lessonId].absent += 1;
      totalAbsentCount += 1;
    }

    if (student) totalStudentsCount += 1;
  });

  const lessonsSummary = Object.values(lessonMap).map((lesson) => ({
    lesson_id: lesson.lesson_id,
    lesson_topic: lesson.lesson_topic,
    lesson_start: lesson.lesson_start,
    total_students: lesson.students.size,
    present_count: lesson.present,
    absent_count: lesson.absent,
  }));

  return {
    unique_lessons_count: lessonsSummary.length,
    total_students_count: totalStudentsCount,
    total_present: totalPresentCount,
    total_absent: totalAbsentCount,
    lessons_breakdown: lessonsSummary,
  };
}

/**
 * 1. Get attendance metrics for a specific day
 * @param {string} targetDate - Format 'MM/DD/YYYY' (e.g., '10/27/2026')
 */
export async function getAttendanceByDay(targetDate) {
  try {
    const { data, error } = await supabase
      .from("tutor_reports_export")
      .select("*");

    if (error) {
      console.error("Error fetching daily attendance:", error.message);
      return null;
    }

    const filteredRows = (data || []).filter((row) => {
      const lessonStart = row.lesson_start;
      if (!lessonStart) return false;
      const datePart = lessonStart.split(" ")[0];
      return datePart === targetDate;
    });

    const aggregated = aggregateAttendanceData(filteredRows);

    console.log(`\n================ DAILY ATTENDANCE TEST ===============`);
    console.log(`[DAY] Target: ${targetDate} | Unique Lessons: ${aggregated.unique_lessons_count} | Present: ${aggregated.total_present} | Absent: ${aggregated.total_absent}`);
    console.log(`======================================================\n`);

    return aggregated;
  } catch (err) {
    console.error("Connection error in getAttendanceByDay:", err);
    return null;
  }
}

/**
 * 2. Get attendance metrics for a 7-day weekly range
 * @param {string} startDateStr - Format 'MM/DD/YYYY' (e.g., '10/27/2026')
 */
export async function getAttendanceByWeek(startDateStr) {
  try {
    const { data, error } = await supabase
      .from("tutor_reports_export")
      .select("*");

    if (error) {
      console.error("Error fetching weekly attendance:", error.message);
      return null;
    }

    const [month, day, year] = startDateStr.split("/").map(Number);
    const startDt = new Date(year, month - 1, day);
    const endDt = new Date(year, month - 1, day + 6); // 7-day span

    const filteredRows = (data || []).filter((row) => {
      const lessonStart = row.lesson_start;
      if (!lessonStart) return false;
      try {
        const datePart = lessonStart.split(" ")[0];
        const [rMonth, rDay, rYear] = datePart.split("/").map(Number);
        const rowDt = new Date(rYear, rMonth - 1, rDay);
        return rowDt >= startDt && rowDt <= endDt;
      } catch {
        return false;
      }
    });

    const aggregated = aggregateAttendanceData(filteredRows);

    console.log(`\n================ WEEKLY ATTENDANCE TEST ===============`);
    console.log(`[WEEK] Starting: ${startDateStr} | Unique Lessons: ${aggregated.unique_lessons_count} | Present: ${aggregated.total_present} | Absent: ${aggregated.total_absent}`);
    console.log(`=======================================================\n`);

    return aggregated;
  } catch (err) {
    console.error("Connection error in getAttendanceByWeek:", err);
    return null;
  }
}