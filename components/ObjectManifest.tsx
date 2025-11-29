// components/ObjectManifest.tsx
import { Neo } from "@/types/neo";
import { getDangerLevel } from "@/lib/getDangerLevel";

type ObjectManifestProps = {
  neos: Neo[];
};



export function ObjectManifest({ neos }: ObjectManifestProps) {
  if (!neos || neos.length === 0) {
    return (
      <section className="mt-4 rounded-2xl border border-slate-800/70 bg-slate-950/80 p-4 sm:p-5 text-sm text-slate-200">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
          Object manifest
        </p>
        <p className="text-slate-400">
          No NEOs in the log for this time slice. Either space is quiet, or the
          console intern fell asleep.
        </p>
      </section>
    );
  }

  const { closest, hazardousCount } = getDangerLevel(neos);

  return (
    <section className="mt-4 rounded-2xl border border-slate-800/70 bg-slate-950/80 p-4 sm:p-5 text-sm text-slate-200">
      {/* HEADER STRIP */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Object manifest
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Today&apos;s near-Earth visitors, straight from NASA&apos;s NEO
            catalog. Sorted from closest to &quot;chill, it&apos;s way out
            there.&quot;
          </p>
        </div>

        {/* QUICK STATS PILL ROW */}
        <div className="flex flex-wrap items-center gap-2 text-[0.7rem]">
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.9)]" />
            <span className="font-mono uppercase tracking-[0.18em] text-slate-300">
              {neos.length} tracked
            </span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-600/60 bg-amber-950/40 px-3 py-1">
            <span className="text-amber-300">⚠️</span>
            <span className="font-mono uppercase tracking-[0.18em] text-amber-100">
              {hazardousCount} hazardous
            </span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1">
            <span className="text-sky-300">🛰️</span>
            <span className="font-mono uppercase tracking-[0.18em] text-slate-300">
              Nearest: {closest.name}
            </span>
          </span>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-sky-500/50 to-transparent opacity-60" />

      {/* HYBRID CONSOLE: CARDS ON MOBILE, TABLE ON DESKTOP */}
      <div className="mt-4 space-y-4">
        {/* Mobile: stacked cards */}
        <div className="grid gap-3 sm:hidden">
          {neos
            .slice()
            .sort((a, b) => a.missMiles - b.missMiles)
            .map((neo) => {
              const hasMoid =
                typeof neo.moidKm === "number" && neo.moidKm > 0;

              return (
                <article
                  key={neo.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/80 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-sky-200">
                      {neo.name}
                    </h3>
                    {neo.hazardous && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/70 bg-amber-950/40 px-2 py-0.5 text-[0.65rem] font-mono uppercase tracking-[0.16em] text-amber-200">
                        ⚠️ Hazardous
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-[0.7rem] text-slate-400">
                    Closest approach:{" "}
                    <span className="font-mono text-slate-200">
                      {neo.closeApproachDate}
                    </span>
                  </p>

                  <div className="mt-2 grid grid-cols-2 gap-2 text-[0.7rem]">
                    <div>
                      <p className="text-slate-500">Miss distance</p>
                      <p className="font-mono text-slate-100">
                        {neo.missMiles.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}{" "}
                        mi
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Speed</p>
                      <p className="font-mono text-slate-100">
                        {Math.round(neo.velocityMph).toLocaleString()} mph
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Brightness (H)</p>
                      <p className="font-mono text-slate-100">
                        {neo.magnitude.toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Vibe check</p>
                      <p
                        className={
                          neo.hazardous
                            ? "font-mono text-amber-200"
                            : "font-mono text-emerald-200"
                        }
                      >
                        {neo.hazardous ? "Cosmically sus" : "Probably fine"}
                      </p>
                    </div>
                  </div>

                  {/* Mobile MOID line */}
                  <p className="mt-2 text-[0.7rem] text-slate-400">
                    {hasMoid
                      ? `Orbit miss distance (MOID): ~${Math.round(
                          neo.moidKm!
                        ).toLocaleString()} km`
                      : "Orbit miss distance (MOID) not available."}
                  </p>
                </article>
              );
            })}
        </div>

        {/* Desktop: compact table */}
        <div className="hidden sm:block overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
          <table className="min-w-full divide-y divide-slate-800 text-xs">
            <thead className="bg-slate-950/60">
              <tr className="text-[0.7rem] uppercase tracking-[0.14em] text-slate-400">
                <th className="px-3 py-2 text-left font-medium">Object</th>
                <th className="px-3 py-2 text-right font-medium">
                  Miss distance (mi)
                </th>
                <th className="px-3 py-2 text-right font-medium">
                  Speed (mph)
                </th>
                <th className="px-3 py-2 text-right font-medium">Mag (H)</th>
                <th className="px-3 py-2 text-left font-medium">Hazard</th>
                <th className="px-3 py-2 text-left font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {neos
                .slice()
                .sort((a, b) => a.missMiles - b.missMiles)
                .map((neo) => {
                  const distanceLabel =
                    neo.missMiles < 1_000_000
                      ? "That’s uncomfortably close."
                      : neo.missMiles < 10_000_000
                      ? "Close-ish in cosmic terms."
                      : "Plenty of breathing room.";

                  const hazardLabel = neo.hazardous
                    ? "Potentially hazardous"
                    : "Not classified as hazardous";

                  const hasMoid =
                    typeof neo.moidKm === "number" && neo.moidKm > 0;

                  return (
                    <tr key={neo.id} className="hover:bg-slate-900/70">
                      <td className="px-3 py-2 align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-sky-200">
                            {neo.name}
                          </span>
                          <span className="font-mono text-[0.65rem] text-slate-500">
                            {neo.closeApproachDate}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right align-top font-mono text-slate-100">
                        {neo.missMiles.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td className="px-3 py-2 text-right align-top font-mono text-slate-100">
                        {Math.round(neo.velocityMph).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-right align-top font-mono text-slate-100">
                        {neo.magnitude.toFixed(1)}
                      </td>
                      <td className="px-3 py-2 align-top">
                        <span
                          className={[
                            "inline-flex rounded-full px-2 py-0.5 text-[0.65rem] font-mono uppercase tracking-[0.16em]",
                            neo.hazardous
                              ? "border border-amber-500/70 bg-amber-950/40 text-amber-200"
                              : "border border-emerald-500/70 bg-emerald-950/40 text-emerald-200",
                          ].join(" ")}
                        >
                          {neo.hazardous ? "Hazardous" : "Chill"}
                        </span>
                      </td>
<td className="px-3 py-2 align-top text-[0.7rem] text-slate-300">
  {distanceLabel}{" "}
  <span className="text-slate-500">({hazardLabel}.)</span>
  <br />
  {typeof neo.moidKm === "number" ? (
    <span className="text-sky-300">
      Orbit miss distance (MOID):{" "}
      {neo.moidKm.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}{" "}
      km
    </span>
  ) : (
    <span className="text-slate-500">
      Orbit miss distance (MOID) not available.
    </span>
  )}
</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
