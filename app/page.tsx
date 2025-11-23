import { getTodayNeos } from "@/lib/fetchNeos"; 
import { DangerMeter } from "@/components/DangerMeter";
import { getDangerLevel } from "@/lib/getDangerLevel";
import { NeoTable } from "@/components/NeoTable";

export default async function HomePage() {
  const data = await getTodayNeos();
  const { date, count, neos } = data;

  const danger = getDangerLevel(neos);
  const { closest, hazardousCount } = danger;

  return (
    <main className="starfield retro-grid crt min-h-screen">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        {/* Top bar / logo */}
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
              Neo Tracker
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Near-Earth Object dashboard, for curious earthlings.
            </p>
          </div>
          <div className="rounded-full border border-sky-400/50 bg-slate-900/60 px-4 py-1 text-xs font-medium uppercase tracking-wide text-sky-200 shadow-sm shadow-sky-500/40">
            IT'S FINE. PROBABLY.
          </div>
        </header>
{/* 🔥 New: Danger Meter */}
        <DangerMeter neos={data.neos} />
        {/* Hero + danger summary row */}
        <section className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* Left: big hero card */}
          <div className="console-panel p-6 shadow-xl shadow-sky-950/60 backdrop-blur">
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-sky-300">
              Today&apos;s Near Misses
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-50 sm:text-3xl">
              {count} objects are paying Earth a friendly visit today.
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Data from NASA’s Near Earth Object Web Service. Updated for{" "}
              <span className="font-semibold text-sky-300">{date}</span>.
            </p>

            <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
              <div className="rounded-xl border border-slate-700/80 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Nearest miss
                </p>
                <p className="mt-2 text-lg font-semibold text-sky-300">
                  {closest.missMiles.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}{" "}
                  mi
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Object: <span className="font-medium">{closest.name}</span>
                </p>
              </div>

              <div className="rounded-xl border border-slate-700/80 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Potentially hazardous
                </p>
                <p className="mt-2 text-lg font-semibold text-amber-300">
                  {hazardousCount}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  NASA&apos;s classification, not ours. We&apos;re just
                  narrating.
                </p>
              </div>

              <div className="rounded-xl border border-slate-700/80 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Mood of the day
                </p>
                <p className="mt-2 text-lg font-semibold text-emerald-300">
                  Probably Fine
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Statistically, you&apos;re more likely to stub your toe than
                  be vaporized.
                </p>
              </div>
            </div>
          </div>

          {/* Right: placeholder for future Danger Meter component */}
          <aside className="rounded-2xl border border-slate-700/70 bg-slate-900/75 p-4 shadow-lg shadow-sky-950/60 backdrop-blur">
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-sky-300">
              Planetary Status
            </p>
            <div className="mt-4 h-32 rounded-xl border border-slate-700/70 bg-slate-950/80 p-4 flex flex-col justify-between">
              {/* This is where we’ll drop the animated danger meter later */}
              <p className="text-sm text-slate-200">
                System check complete. All major extinction events are
                currently on hold.
              </p>
              <p className="text-xs text-slate-500">
                (More dramatic danger meter coming soon.)
              </p>
            </div>
          </aside>
        </section>

        {/* Bottom area: list / table  */}
<section className="mt-4 space-y-3">
  <div className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4 text-sm text-slate-200">
    <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
      Object manifest
    </p>
    <p className="text-slate-400 mb-3">
      Today&apos;s catalog of near-Earth visitors. Distances are{" "}
      <span className="font-medium text-sky-300">miss distances</span>—how
      close they come to Earth&apos;s orbit, not where they&apos;re sitting
      right now.
    </p>

    <NeoTable neos={neos} />
  </div>
</section>
      </div>
    </main>
  );
}
