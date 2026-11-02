// src/components/layout/nav-links.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/" },
  { name: "Reports", href: "/reports" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-2 text-sm font-medium">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`px-4 py-2 rounded-full transition-all duration-200 ${
              isActive
                ? "bg-[#ffffff] text-[#101a2b] font-semibold shadow-sm"
                : "text-white hover:bg-white/10"
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
