// src/components/layout/header.jsx
import { NavLinks } from "@/components/layout/nav-links";
import themeConfig from "@/config/theme.json";

export function Header() {
  const colors = themeConfig.colors.light;

  return (
    <header
      className="relative px-6 py-4 flex items-center justify-between shadow-sm border-b border-slate-800"
      style={{ backgroundColor: colors.primary, color: colors.headerText }}
    >
      <div className="font-bold text-lg tracking-wide">TKG Platform</div>
      <NavLinks />

      {/* Accent Bar: Thin line at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#9d7413]" />
    </header>
  );
}
