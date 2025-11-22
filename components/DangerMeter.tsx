import { Neo } from "@/types/neo";
import { getDangerLevel } from "@/lib/getDangerLevel";

type DangerMeterProps = {
  neos: Neo[];
};

export function DangerMeter({ neos }: DangerMeterProps) {
  // Handle "no data" days gracefully
  if (!neos || neos.length === 0) {
    return (
      <section
        aria-label="Near Earth Object danger meter"
        className="rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-5 shadow-xl shadow-sky-950/60"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[0.65rem] font-mono uppercase tracking-[0.25em] text-sky-300">
              Planetary Status Console
            </p>
            <p className="mt-1 text-xs text-slate-400">
              No NEO data available for this time slice. The universe is
              suspiciously quiet.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const { label, tagline, percent, closest, hazardousCount, closestMiles } =
    getDangerLevel(neos);

  // Clamp percent so we never break the bar visually
  const clamped = Math.max(0, Math.min(percent, 100));

  return (
    <section
      aria-label="Near Earth Object danger meter"
      className="rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-5 shadow-xl shadow-sky-950/60"
    >
      {/* HEADER: RETRO CONSOLE TOP BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-mono uppercase tracking-[0.25em] text-sky-300">
            Planetary Status Console
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Live NEO risk signal, direct from NASA&apos;s data firehose.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[0.65rem] font-mono uppercase tracking-[0.2em] text-slate-300">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          <span>Monitoring</span>
        </div>
      </div>

      {/* MAIN PANEL BORDER LINE */}
      <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-sky-500/60 to-transparent opacity-60" />

      {/* DANGER BAR + STATUS TEXT */}
      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] md:items-center">
        {/* A + B: RETRO BAR WITH ANIMATION */}
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <p className="text-[0.65rem] font-mono uppercase tracking-[0.25em] text-slate-400">
                NEO Proximity Index
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-50">
                {label}
              </p>
            </div>

            <p className="text-xs font-mono text-slate-400">
              {Math.round(clamped)}%
            </p>
          </div>

          {/* DANGER TRACK */}
          <div className="mt-3 relative h-4 w-full overflow-hidden rounded-full border border-slate-600/70 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900">
            {/* Background hazard gradient band */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/60 via-amber-900/60 to-rose-900/60 opacity-80" />

            {/* Animated fill bar */}
            <div
              className="relative h-full origin-left rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-500 shadow-[0_0_16px_rgba(248,250,252,0.45)] transition-[width] duration-700 ease-out"
              style={{ width: `${clamped}%` }}
            />

            {/* Indicator puck */}
            <div
              className="pointer-events-none absolute -top-1 h-6 w-6 rounded-full border border-slate-950/80 bg-slate-100/95 shadow-lg shadow-rose-500/40 transition-[left] duration-700 ease-out"
              style={{ left: `calc(${clamped}% - 12px)` }}
            >
              <div className="absolute inset-[5px] rounded-full bg-slate-900" />
            </div>

            {/* Tick marks */}
            <div className="pointer-events-none absolute inset-0 flex justify-between px-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-full w-px bg-slate-600/60 last:bg-rose-500/70"
                />
              ))}
            </div>
          </div>

          {/* C: STATUS TEXT BLOCK */}
          <p className="mt-3 text-xs text-slate-300">{tagline}</p>
        </div>

        {/* SIDE INFO: CLOSEST & HAZARDOUS */}
        <div className="space-y-3 rounded-xl border border-slate-700/70 bg-slate-950/80 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[0.65rem] font-mono uppercase tracking-[0.22em] text-slate-400">
              Quick telemetry
            </p>
            <p className="text-[0.6rem] font-mono text-slate-500">
              {hazardousCount} flagged ⚠️
            </p>
          </div>

          <div className="grid gap-2 text-xs sm:grid-cols-2">
            <div>
              <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">
                Nearest visitor
              </p>
              <p className="mt-1 text-sm font-semibold text-sky-200">
                {closest.name}
              </p>
              <p className="text-[0.7rem] text-slate-400">
                ~
                {Math.round(closestMiles).toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{" "}
                mi from Earth
              </p>
            </div>

            <div>
              <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">
                Hazard report
              </p>
              <p className="mt-1 text-sm font-semibold text-amber-300">
                {hazardousCount > 0 ? "Mildly Concerning" : "Probably Fine"}
              </p>
              <p className="text-[0.7rem] text-slate-400">
                Based on NASA&apos;s &quot;potentially hazardous&quot;
                classification, not our anxiety levels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}