// src/components/layout/header.jsx
import { NavLinks } from "@/components/layout/nav-links";
import themeConfig from "@/config/theme.json";
import tenantConfig from "@/config/tenantConfig.json"; // Or pass as props / fetch based on subdomain

export function Header() {
  const colors = themeConfig.colors.light;

  return (
    <header
      className="relative px-6 py-4 flex items-center justify-between shadow-sm border-b border-slate-800"
      style={{ backgroundColor: colors.primary, color: colors.headerText }}
    >
      {/* Configurable Header Branding Area */}
      <div className="flex flex-col">
        {/* Text 1: Small accent text */}
        <span className="text-xs font-semibold tracking-wider uppercase text-[#9d7413]">
          {tenantConfig.text1}
        </span>

        {/* Text 2: District Name */}
        <span className="text-lg font-bold tracking-wide text-[#ffffff]">
          {tenantConfig.text2}
        </span>

        {/* Text 3: Schools list */}
        <span className="text-xs font-medium text-[#faf8f3] opacity-90 mt-0.5">
          {tenantConfig.text3}
        </span>
      </div>

      {/* Navigation Links */}
      <NavLinks />

      {/* Accent Bar: Thin line at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#9d7413]" />
    </header>
  );
}
