import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gatwick-sky flex flex-col items-center justify-center p-6 text-center">
      {/* Gatwick Branding */}
      <div className="bg-gatwick-blue p-4 rounded-full mb-6 shadow-lg">
        <PlaneTakeoff className="text-white w-12 h-12" />
      </div>

      <h1 className="text-4xl font-extrabold text-gatwick-blue mb-2">
        Gatwick Quiz Live
      </h1>
      <p className="text-lg text-slate-600 mb-8 max-w-xs">
        Compete with fellow travelers! Scan, Play, and top the Leaderboard.
      </p>

      {/* Join Game Button */}
      <Link href="/play" className="w-full max-w-xs">
        <button className="w-full bg-gatwick-orange hover:bg-orange-600 text-white font-bold py-4 rounded-2xl text-xl transition-all active:scale-95 shadow-md">
          Join Game
        </button>
      </Link>

      <p className="mt-6 text-sm text-slate-400">
        No download required • Real-time flight data
      </p>
    </main>
  );
}