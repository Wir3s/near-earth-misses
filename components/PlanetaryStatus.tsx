// components/PlanetaryStatus.tsx
"use client";

import type { Neo } from "@/types/neo";

type PlanetaryStatusProps = {
  neos: Neo[];
};

export function PlanetaryStatus({ neos }: PlanetaryStatusProps) {
  if (!neos || neos.length === 0) {
    return (
      <aside className="rounded-2xl border border-slate-700/70 bg-slate-900/75 p-4 shadow-lg shadow-sky-950/60 backdrop-blur">
        <p className="text-xs font-mono uppercase tracking-[0.25em] text-sky-300">
          Planetary Status
        </p>
        <p className="mt-3 text-sm text-slate-200">
          System check complete. No NEOs on the console. Space is quiet…
          suspiciously quiet.
        </p>
      </aside>
    );
  }

  // Find something interesting to talk about:
  // 1) hazardous with MOID
  // 2) otherwise, smallest MOID
  // 3) otherwise, closest approach distance
  const withMoid = neos.filter(
    (neo) => typeof neo.moidKm === "number" && neo.moidKm! > 0
  );

  const hazardousWithMoid = withMoid.filter((neo) => neo.hazardous);

  let focusNeo: Neo | undefined;

  if (hazardousWithMoid.length > 0) {
    focusNeo = hazardousWithMoid.sort(
      (a, b) => (a.moidKm ?? Infinity) - (b.moidKm ?? Infinity)
    )[0];
  } else if (withMoid.length > 0) {
    focusNeo = withMoid.sort(
      (a, b) => (a.moidKm ?? Infinity) - (b.moidKm ?? Infinity)
    )[0];
  } else {
    focusNeo = [...neos].sort((a, b) => a.missMiles - b.missMiles)[0];
  }

  const moidKm =
    focusNeo && typeof focusNeo.moidKm === "number" ? focusNeo.moidKm : null;

  const hasMoid = moidKm !== null && moidKm > 0;

  return (
    <aside className="rounded-2xl border border-slate-700/70 bg-slate-900/75 p-4 shadow-lg shadow-sky-950/60 backdrop-blur">
      <p className="text-xs font-mono uppercase tracking-[0.25em] text-sky-300">
        Planetary Status
      </p>

      <div className="mt-3 rounded-xl border border-slate-700/70 bg-slate-950/80 p-4 flex flex-col gap-2 text-sm text-slate-200">
        {hasMoid ? (
          <>
            <p>
              Today&apos;s orbital headline:{" "}
              <span className="font-semibold text-sky-200">
                {focusNeo?.name}
              </span>{" "}
              makes its closest *orbital* pass at roughly{" "}
              <span className="font-mono text-emerald-300">
                {Math.round(moidKm / 1_000).toLocaleString()} km
              </span>{" "}
              from Earth&apos;s orbit (MOID).
            </p>
            <p className="text-xs text-slate-400">
              MOID (Minimum Orbit Intersection Distance) isn&apos;t today&apos;s
              flyby distance — it&apos;s how close the two{" "}
              <em>paths</em> come over time. That&apos;s why something farther
              away today can still be flagged as &quot;potentially
              hazardous.&quot;
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-200">
              Orbit miss distance (MOID) not available for today&apos;s
              visitors. NASA either hasn&apos;t solved that piece yet, or this
              batch just isn&apos;t interesting enough.
            </p>
            <p className="text-xs text-slate-500">
              When MOID data is present, we&apos;ll show how close an orbit
              comes to Earth&apos;s orbit — not just today&apos;s flyby.
            </p>
          </>
        )}
      </div>
    </aside>
  );
}
