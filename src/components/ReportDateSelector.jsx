// src/components/ReportDateSelector.jsx
"use client";

export default function ReportDateSelector({
  selectedDate,
  setSelectedDate,
  viewMode,
  setViewMode,
  displayMode,
  setDisplayMode,
  minDate,
  maxDate,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-white p-2 border border-slate-200 rounded-xl shadow-sm">
      {/* Day / Week View Mode */}
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

      {/* Percentage vs Raw Ratio Toggle */}
      <button
        onClick={() =>
          setDisplayMode(displayMode === "ratio" ? "percentage" : "ratio")
        }
        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-all"
        title="Toggle display format between Ratio and Percentage"
      >
        Format:{" "}
        <span className="font-bold text-slate-900">
          {displayMode === "ratio" ? "Raw Ratio" : "Percentage (%)"}
        </span>
      </button>

      {/* Constrained Calendar Input */}
      <input
        type="date"
        value={selectedDate}
        min={minDate}
        max={maxDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
