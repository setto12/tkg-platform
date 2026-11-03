// src/services/exitTicketService.js
import { supabase } from "@/lib/supabase";

/**
 * Helper to compute average score and percentage from rows
 */
function calculateExitTicketAverages(rows) {
  let totalScoreSum = 0;
  let validCount = 0;

  rows.forEach((row) => {
    const rawResult = row.check_for_understanding_result;
    if (!rawResult) return;

    const valStr = String(rawResult).trim();
    
    // Expecting 'X/3' format based on normalization
    if (valStr.includes("/")) {
      const parts = valStr.split("/");
      if (parts.length === 2) {
        const score = parseFloat(parts[0]);
        const maxScore = parseFloat(parts[1]);
        
        if (!isNaN(score) && !isNaN(maxScore) && maxScore > 0) {
          // Convert score to a 3-point scale ratio or keep raw value
          totalScoreSum += (score / maxScore) * 3; // Normalize to 3-point scale equivalent
          validCount += 1;
        }
      }
    }
  });

  if (validCount === 0) {
    return {
      averageScore: "0.0/3",
      averagePercentage: "0%",
      validEntriesCount: 0,
    };
  }

  const avgScore = totalScoreSum / validCount;
  const avgPercentage = (avgScore / 3) * 100;

  return {
    averageScore: `${avgScore.toFixed(1)}/3`,
    averagePercentage: `${avgPercentage.toFixed(1)}%`,
    validEntriesCount: validCount,
  };
}

/**
 * 1. Get exit ticket averages for a specific day
 * @param {string} targetDate - Format 'MM/DD/YYYY' (e.g., '10/27/2026')
 */
export async function getExitTicketAverageByDay(targetDate) {
  try {
    const { data, error } = await supabase
      .from("tutor_reports_export")
      .select("*");

    if (error) {
      console.error("Error fetching daily exit tickets:", error.message);
      return null;
    }

    const filteredRows = (data || []).filter((row) => {
      const lessonStart = row.lesson_start;
      if (!lessonStart) return false;
      const datePart = lessonStart.split(" ")[0];
      return datePart === targetDate;
    });

    const summary = calculateExitTicketAverages(filteredRows);
    console.log(`[EXIT TICKET DAY] Date: ${targetDate} | Avg Score: ${summary.averageScore} | Avg %: ${summary.averagePercentage}`);
    return summary;
  } catch (err) {
    console.error("Connection error in getExitTicketAverageByDay:", err);
    return null;
  }
}

/**
 * 2. Get exit ticket averages for a 7-day weekly range
 * @param {string} startDateStr - Format 'MM/DD/YYYY' (e.g., '10/27/2026')
 */
export async function getExitTicketAverageByWeek(startDateStr) {
  try {
    const { data, error } = await supabase
      .from("tutor_reports_export")
      .select("*");

    if (error) {
      console.error("Error fetching weekly exit tickets:", error.message);
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

    const summary = calculateExitTicketAverages(filteredRows);
    console.log(`[EXIT TICKET WEEK] Starting: ${startDateStr} | Avg Score: ${summary.averageScore} | Avg %: ${summary.averagePercentage}`);
    return summary;
  } catch (err) {
    console.error("Connection error in getExitTicketAverageByWeek:", err);
    return null;
  }
}