// src/app/layout.jsx
import "./globals.css";
import { Header } from "@/components/layout/header";
import themeConfig from "@/config/theme.json";

export const metadata = {
  title: "TKG Platform",
  description: "Dashboard for Supabase & FastAPI operations",
};

export default function RootLayout({ children }) {
  const colors = themeConfig.colors.light;

  return (
    <html lang="en">
      <body style={{ backgroundColor: colors.background, color: colors.text }}>
        {/* Modular Header Component */}
        <Header />

        {/* Main Content Area (60% background environment) */}
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </body>
    </html>
  );
}