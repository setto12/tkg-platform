// src/services/reportQueryService.js
import { supabase } from "@/lib/supabase";

/**
 * 1. Get rows by day querying the lesson_start column
 * @param {string} targetDate - Expected format 'MM/DD/YYYY' (e.g., '10/27/2026')
 */
export async function getRowsByDay(targetDate) {
  try {
    const { data, error } = await supabase
      .from("tutor_reports_export")
      .select("*");

    if (error) {
    //   console.error("Error fetching rows by day:", error.message);
      return [];
    }

    const filtered = (data || []).filter((row) => {
      const lessonStart = row.lesson_start;
      if (!lessonStart) return false;
      // Extract date part before the time (e.g., "10/27/2026")
      const datePart = lessonStart.split(" ")[0];
      return datePart === targetDate;
    });

    // console.log(`\n================ NEXT.JS CONSOLE LOG TEST ===============`);
    // console.log(`[DAY QUERY] Target Date: ${targetDate} | Matches found: ${filtered.length}`);
    if (filtered.length > 0) {
    //   console.log(`  -> Sample ID: ${filtered[0].id} | Topic: ${filtered[0].lesson_topic}`);
    }
    // console.log(`=========================================================\n`);

    return filtered;
  } catch (err) {
    // console.error("Connection error in getRowsByDay:", err);
    return [];
  }
}

/**
 * 2. Get rows by week querying the lesson_start column (7-day span)
 * @param {string} startDateStr - Expected format 'MM/DD/YYYY' (e.g., '10/27/2026')
 */
export async function getRowsByWeek(startDateStr) {
  try {
    const { data, error } = await supabase
      .from("tutor_reports_export")
      .select("*");

    if (error) {
    //   console.error("Error fetching rows by week:", error.message);
      return [];
    }

    const [month, day, year] = startDateStr.split("/").map(Number);
    const startDt = new Date(year, month - 1, day);
    const endDt = new Date(year, month - 1, day + 6); // 7-day range

    const filtered = (data || []).filter((row) => {
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

    // console.log(`\n================ NEXT.JS CONSOLE LOG TEST ===============`);
    // console.log(`[WEEK QUERY] Starting: ${startDateStr} (7 days) | Matches found: ${filtered.length}`);
    // console.log(`=========================================================\n`);

    return filtered;
  } catch (err) {
    // console.error("Connection error in getRowsByWeek:", err);
    return [];
  }
}