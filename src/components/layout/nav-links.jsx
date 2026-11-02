// src/components/layout/nav-links.jsx
"use client"; // Ready for client-side routing state if needed later (e.g., active paths)

import Link from "next/link";

const links = [
  { name: "Dashboard", href: "/" },
  { name: "Reports", href: "/reports" },
];

export function NavLinks() {
  return (
    <nav className="flex items-center gap-6 text-sm font-medium">
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="hover:opacity-80 transition-opacity"
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
