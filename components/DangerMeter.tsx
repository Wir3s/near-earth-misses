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

         {/* DANGER TRACK — upgraded border + inset glowing track */}
<div className="mt-3 relative h-5 w-full rounded-full border border-slate-700/80 bg-slate-950/80 px-2 shadow-inner shadow-black/40">

  {/* Inner glowing hazard band */}
  <div className="absolute inset-y-1 left-2 right-2 rounded-full bg-gradient-to-r from-emerald-400/25 via-amber-300/25 to-rose-500/25 blur-[1px]" />

  {/* FILL BAR */}
  <div
    className="absolute inset-y-1 left-2 rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-500 shadow-[0_0_12px_rgba(255,255,255,0.35)] transition-[width] duration-700 ease-out"
    style={{ width: `${clamped}%` }}
  />

           {/* 🔧 NEW: Mechanical-style needle */}
            <div
              className="pointer-events-none absolute inset-y-[-6px] flex items-center"
              style={{ left: `calc(${clamped}% - 1px)` }}
            >
              <div className="relative h-9 w-[2px] bg-slate-100 shadow-[0_0_8px_rgba(248,250,252,0.8)]">
                {/* Hub at the top */}
                <div className="absolute -top-[4px] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-slate-900 bg-slate-200 shadow-[0_0_6px_rgba(15,23,42,0.8)]" />
                {/* Pointer at bottom */}
                {/* <div className="absolute -bottom-[4px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-[2px] bg-slate-100 shadow-[0_0_6px_rgba(248,250,252,0.9)]" /> */}
              </div>
            </div>

  {/* Tick marks */}
  {/* <div className="pointer-events-none absolute inset-0 flex justify-between px-3">
    {Array.from({ length: 6 }).map((_, idx) => (
      <div
        key={idx}
        className={`h-full w-px ${
          idx === 5 ? "bg-rose-500/80" : "bg-slate-600/50"
        }`}
      />
    ))}
  </div> */}
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