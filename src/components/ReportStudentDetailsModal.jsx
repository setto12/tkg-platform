// src/components/ReportStudentDetailsModal.jsx
"use client";

import { useState, useMemo } from "react";
import { Modal } from "@/components/ui/modal";

export default function ReportStudentDetailsModal({
  isOpen,
  onClose,
  rows = [],
}) {
  const [selectedSchool, setSelectedSchool] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Extract unique schools/grades dynamically from the 'client' column of the filtered rows
  const schools = useMemo(() => {
    const schoolSet = new Set();
    rows.forEach((row) => {
      if (row.client) {
        schoolSet.add(row.client.trim());
      }
    });
    return Array.from(schoolSet).sort();
  }, [rows]);

  // Filter rows based on selected school and student search input
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const schoolMatch =
        selectedSchool === "all" || row.client?.trim() === selectedSchool;
      const studentName = (row.student || "").toLowerCase();
      const searchMatch = studentName.includes(searchTerm.toLowerCase());
      return schoolMatch && searchMatch;
    });
  }, [rows, selectedSchool, searchTerm]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detailed Student Attendance & Exit Tickets"
    >
      <div className="space-y-4">
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-200">
          {/* School Filter Dropdown */}
          <div className="w-full sm:w-72 space-y-1">
            <label className="text-xs font-semibold text-slate-600">
              Filter by School & Grade
            </label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-[#101a2b] focus:outline-none focus:ring-2 focus:ring-[#101a2b]"
            >
              <option value="all">All Schools ({schools.length})</option>
              {schools.map((school, index) => (
                <option key={index} value={school}>
                  {school}
                </option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <div className="w-full sm:w-72 space-y-1">
            <label className="text-xs font-semibold text-slate-600">
              Search Student
            </label>
            <input
              type="text"
              placeholder="Type student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-[#101a2b] focus:outline-none focus:ring-2 focus:ring-[#101a2b]"
            />
          </div>
        </div>

        {/* Results Counter */}
        <p className="text-xs text-slate-500 font-medium">
          Showing {filteredRows.length} of {rows.length} records
        </p>

        {/* Table Container */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="max-h-[50vh] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100 sticky top-0 z-10 text-xs font-bold text-[#101a2b] uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 border-b border-slate-200">
                    Student Name
                  </th>
                  <th className="px-4 py-3 border-b border-slate-200">
                    School & Grade
                  </th>
                  <th className="px-4 py-3 border-b border-slate-200">
                    Attendance Status
                  </th>
                  <th className="px-4 py-3 border-b border-slate-200">
                    Exit Ticket Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm bg-white text-slate-700">
                {filteredRows.length > 0 ? (
                  filteredRows.map((row, idx) => {
                    const clientReport = (
                      row.client_report || "Unknown"
                    ).toLowerCase();
                    const isAttended =
                      clientReport === "present" || clientReport === "attended";

                    return (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-[#101a2b]">
                          {row.student || "Unnamed Student"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {row.client || "N/A"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              isAttended
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {row.client_report || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-[#101a2b]">
                          {row.check_for_understanding_result || "N/A"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-slate-400">
                      No student records found matching your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
}
