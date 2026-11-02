// src/components/ui/card.jsx
import themeConfig from "@/config/theme.json";

export function Card({ title, value, className = "" }) {
  const colors = themeConfig.colors.light;

  return (
    <div
      className={`p-6 rounded-xl border border-slate-200/80 shadow-sm transition-all hover:shadow-md ${className}`}
      style={{ backgroundColor: colors.card }}
    >
      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
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
