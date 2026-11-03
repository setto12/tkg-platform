// src/services/reportDateRangeService.js
import { supabase } from "@/lib/supabase";

/**
 * Fetches the earliest and latest available lesson dates from Supabase
 * and returns them in 'YYYY-MM-DD' format for HTML date inputs.
 */
export async function getAvailableDateBounds() {
  try {
    const { data, error } = await supabase
      .from("tutor_reports_export")
      .select("lesson_start");

    if (error || !data || data.length === 0) {
      return { minDate: "2026-01-01", maxDate: "2026-12-31" }; // Safe fallbacks
    }

    const dates = data
      .map((row) => row.lesson_start)
      .filter(Boolean)
      .map((lessonStart) => {
        // Convert "10/27/2026 8:45 AM" -> Date object
        const datePart = lessonStart.split(" ")[0]; // "10/27/2026"
        const [m, d, y] = datePart.split("/").map(Number);
        return new Date(y, m - 1, d);
      })
      .filter((date) => !isNaN(date));

    if (dates.length === 0) {
      return { minDate: "2026-01-01", maxDate: "2026-12-31" };
    }

    const minDateObj = new Date(Math.min(...dates));
    const maxDateObj = new Date(Math.max(...dates));

    // Format to YYYY-MM-DD for HTML input min/max props
    const formatDateToYMD = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    return {
      minDate: formatDateToYMD(minDateObj),
      maxDate: formatDateToYMD(maxDateObj),
    };
  } catch (err) {
    // console.error("Error fetching date bounds:", err);
    return { minDate: "2026-01-01", maxDate: "2026-12-31" };
  }
}