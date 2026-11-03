// src/services/skillStandardService.js
import { supabase } from "@/lib/supabase";

async function getSkillStandardsByRows(filteredRows) {
  if (!filteredRows || filteredRows.length === 0) {
    return [{ title: "No Data", description: "No session reports found for this timeframe." }];
  }

  // Map each unique grade level and its standard code from the rows
  const gradeStandardMap = {};
  filteredRows.forEach((row) => {
    const code = row.skillstandard_addressed;
    const grade = row.student_grade_level; // e.g., "Grade 3"
    if (code && grade) {
      gradeStandardMap[grade] = code;
    }
  });

  const grades = Object.keys(gradeStandardMap);
  if (grades.length === 0) {
    return [{ title: "N/A", description: "No standards recorded." }];
  }

  // Fetch descriptions for these standards from the skill_standards table
  const results = [];
  for (const grade of grades) {
    const standardCode = gradeStandardMap[grade];

    const { data, error } = await supabase
      .from("skill_standards")
      .select("*")
      .eq("standard_code", standardCode)
      .eq("grade_level", grade)
      .single();

    if (error || !data) {
      results.push({
        title: `${grade}: ${standardCode}`,
        description: "Standard addressed during session.",
      });
    } else {
      results.push({
        title: `${data.grade_level}: ${data.domain} (${data.standard_code})`,
        description: data.description,
      });
    }
  }

  return results;
}

export async function getSkillStandardsByDay(targetDate, filteredRows) {
  return await getSkillStandardsByRows(filteredRows);
}

export async function getSkillStandardsByWeek(startDateStr, filteredRows) {
  return await getSkillStandardsByRows(filteredRows);
}