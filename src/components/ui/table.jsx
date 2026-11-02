// src/components/ui/table.jsx
import React from "react";

export function Table({
  headers = [],
  data = [],
  totalRow = null,
  className = "",
}) {
  return (
    <div className={`w-full ${className}`}>
      {/* DESKTOP VIEW: Standard Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200/80 shadow-sm bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#101a2b] text-[#ffffff]">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="bg-[#ffffff] text-[#241a2b] hover:bg-slate-50/50 transition-colors"
              >
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 text-sm font-medium">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {totalRow && (
            <tfoot>
              <tr className="bg-[#eeebe2] text-[#241a2b] font-bold border-t border-slate-300">
                {totalRow.map((cell, index) => (
                  <td key={index} className="px-6 py-4 text-sm">
                    {cell}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* MOBILE VIEW: Card Stack Layout */}
      <div className="md:hidden space-y-4">
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 space-y-3"
          >
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className="flex justify-between items-center text-sm"
              >
                <span className="font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  {headers[cellIndex] || `Column ${cellIndex + 1}`}
                </span>
                <span className="font-medium text-[#241a2b] text-right">
                  {cell}
                </span>
              </div>
            ))}
          </div>
        ))}

        {/* Mobile Total Card (if available) */}
        {totalRow && (
          <div className="bg-[#eeebe2] rounded-xl border border-slate-300 shadow-sm p-4 space-y-3 font-bold text-[#241a2b]">
            {totalRow.map((cell, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-xs uppercase tracking-wider opacity-75">
                  {headers[index] || "Total"}
                </span>
                <span className="text-right">{cell}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
