import { getTodayNeos } from "@/lib/fetchNeos";
import { Neo } from "@/types/neo";

export default async function Home() {
  const data = await getTodayNeos();

  const { date, count, neos } = data;

  // Find the closest approach in miles (smallest miss distance)
  const closestNeo: Neo | undefined =
    neos.length > 0
      ? [...neos].sort((a, b) => a.missMiles - b.missMiles)[0]
      : undefined;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-4xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Near-Earth Object Tracker
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Data from NASA&apos;s Near-Earth Object Web Service (NeoWs) for{" "}
            <span className="font-mono">{date}</span>.
          </p>
        </header>

        {closestNeo && (
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 shadow-md space-y-2">
            <p className="text-sm uppercase tracking-wide text-emerald-400">
              Today&apos;s closest visitor
            </p>
            <h2 className="text-2xl font-semibold">
              {closestNeo.name}
              {closestNeo.hazardous && (
                <span className="ml-2 inline-flex items-center rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-300">
                  Potentially Hazardous
                </span>
              )}
            </h2>
            <p className="text-slate-200">
              Closest approach:{" "}
              <span className="font-mono">
                {closestNeo.missMiles.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{" "}
                miles
              </span>{" "}
              (~
              <span className="font-mono">
                {closestNeo.missKm.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>{" "}
              km)
            </p>
            <p className="text-slate-300 text-sm">
              Traveling at{" "}
              <span className="font-mono">
                {closestNeo.velocityMph.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{" "}
                mph
              </span>{" "}
              (
              <span className="font-mono">
                {closestNeo.velocityKps.toFixed(2)} km/s
              </span>
              ). Absolute magnitude:{" "}
              <span className="font-mono">{closestNeo.magnitude}</span>.
            </p>
            <p className="text-slate-400 text-sm italic">
              In other words: don&apos;t panic. But maybe give the sky a
              respectful nod today.
            </p>
          </section>
        )}

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            All NEOs for {date} ({count})
          </h2>

          {neos.length === 0 && (
            <p className="text-slate-400 text-sm">
              No near-Earth objects in the catalog for today. The universe is
              giving us a breather.
            </p>
          )}

          <ul className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            {neos.map((neo) => (
              <li
                key={neo.id}
                className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 sm:p-4 text-sm space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold truncate">{neo.name}</p>
                  {neo.hazardous && (
                    <span className="ml-2 shrink-0 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-medium text-red-300">
                      Hazardous
                    </span>
                  )}
                </div>

                <p className="text-slate-300">
                  Miss distance:{" "}
                  <span className="font-mono">
                    {neo.missMiles.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}{" "}
                    mi
                  </span>
                </p>

                <p className="text-slate-400">
                  Speed:{" "}
                  <span className="font-mono">
                    {neo.velocityMph.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}{" "}
                    mph
                  </span>
                </p>

                <p className="text-slate-500 text-[11px]">
                  Mag: <span className="font-mono">{neo.magnitude}</span> | Date:{" "}
                  <span className="font-mono">{neo.closeApproachDate}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
