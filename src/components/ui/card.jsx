// src/components/ui/card.jsx
import themeConfig from "@/config/theme.json";

export function Card({ title, value, className = "" }) {
  const colors = themeConfig.colors.light;

  return (
    <div
      className={`relative overflow-hidden p-6 rounded-xl border border-slate-200/80 shadow-sm transition-all hover:shadow-md group ${className}`}
      style={{ backgroundColor: colors.card }}
    >
      {/* Accent Bar: Thin line at the top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#9d7413] group-hover:bg-[#101a2b] transition-colors duration-200" />

      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2 mt-1">
        {title}
      </p>
      <h3
        className="text-3xl font-extrabold tracking-tight"
        style={{ color: colors.text }}
      >
        {value}
      </h3>
    </div>
  );
}
