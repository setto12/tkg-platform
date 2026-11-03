// src/components/ReportDateSelector.jsx
"use client";

export default function ReportDateSelector({
  selectedDate,
  setSelectedDate,
  viewMode,
  setViewMode,
}) {
  return (
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
  );
}
