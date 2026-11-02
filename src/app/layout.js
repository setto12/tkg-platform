import "./globals.css";
import theme from "@/config/theme.json";

export const metadata = {
  title: "TKG Platform",
  description: "Dashboard for Supabase & FastAPI operations",
};

export default function RootLayout({ children }) {
  // Using light mode config by default, structured for easy dark mode expansion later
  const colors = theme.colors.light;

  return (
    <html lang="en">
      <body style={{ backgroundColor: colors.background, color: colors.text }}>
        {/* Configured Header: 30% background (#101a2b) with 10% text (#ffffff) */}
        <header 
          className="px-6 py-4 flex items-center justify-between shadow-sm border-b border-slate-800"
          style={{ backgroundColor: colors.primary, color: colors.headerText }}
        >
          <div className="font-bold text-lg tracking-wide">
            TKG Platform
          </div>
          <nav className="flex gap-6 text-sm font-medium">
            <a href="/" className="hover:opacity-80 transition-opacity">Dashboard</a>
            <a href="/reports" className="hover:opacity-80 transition-opacity">Reports</a>
          </nav>
        </header>

        {/* Main Content Area (60% background environment) */}
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </body>
    </html>
  );
}