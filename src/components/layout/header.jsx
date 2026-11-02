// src/components/layout/header.jsx
import { NavLinks } from "@/components/layout/nav-links";
import themeConfig from "@/config/theme.json";

export function Header() {
  // Pulling light mode theme colors from your config (ready for dark mode extension)
  const colors = themeConfig.colors.light;

  return (
    <header
      className="px-6 py-4 flex items-center justify-between shadow-sm border-b border-slate-800"
      style={{ backgroundColor: colors.primary, color: colors.headerText }}
    >
      <div className="font-bold text-lg tracking-wide">TKG Platform</div>
      <NavLinks />
    </header>
  );
}
