// src/components/ReportStandardsList.jsx
"use client";

export default function ReportStandardsList({ skillStandards, loading }) {
  // Helper to extract numeric grade level for proper sorting (e.g., "Grade 3" -> 3)
  const getGradeNumber = (title) => {
    if (!title) return 99;
    const match = title.match(/Grade\s*(\d+)/i);
    return match ? parseInt(match[1], 10) : 99;
  };

  // Sort standards sequentially by grade level (Grade 3 -> Grade 4 -> Grade 5...)
  const sortedStandards = [...(skillStandards || [])].sort((a, b) => {
    return getGradeNumber(a.title) - getGradeNumber(b.title);
  });

  return (
    <div className="sm:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-bold text-[#101a2b]">
        Skill Standards Addressed
      </h2>

      {loading ? (
        <p className="text-sm text-slate-500">Loading standards...</p>
      ) : sortedStandards.length > 0 ? (
        <div className="space-y-3">
          {sortedStandards.map((std, idx) => (
            <div
              key={idx}
              className="border-b border-slate-100 pb-3 last:border-none last:pb-0"
            >
              <p className="text-sm font-semibold text-[#101a2b]">
                {std.title}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">{std.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          No standards recorded for this period.
        </p>
      )}
    </div>
  );
}
