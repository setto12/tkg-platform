export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-[#101a2b] mb-3">
        Welcome to TKG Platform
      </h1>
      <p className="text-slate-600 max-w-md text-base">
        Your UI is now configured with a scalable design system (60/30/10 rule) ready for Supabase data and FastAPI integrations.
      </p>
    </div>
  );
}