import type { Neo } from "@/types/neo";
import { getDangerLevel } from "@/lib/getDangerLevel";

type DangerMeterProps = {
  neos: Neo[];
};

export function DangerMeter({ neos }: DangerMeterProps) {
  const { label, tagline, percent, closest, hazardousCount, closestMiles } =
    getDangerLevel(neos);

  return (
    <section className="space-y-4 rounded-xl border p-4 md:p-6">
      <header className="flex items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold tracking-wide uppercase">
          Neo Danger Meter
        </h2>
        <span className="text-sm font-mono opacity-70">
          {percent.toFixed(0)}%
        </span>
      </header>

      {/* Meter bar */}
      <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-800">
        <div
          className="h-full rounded-full bg-emerald-400 transition-[width]"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Copy */}
      <div className="space-y-1 text-sm">
        <p className="font-semibold">{label}</p>
        <p className="opacity-80">{tagline}</p>

        {closest && (
          <p className="text-xs opacity-70">
            Closest rock today:{" "}
            <span className="font-mono">
              {closest.name} ({closest.id})
            </span>{" "}
            at{" "}
            <span className="font-mono">
              {closestMiles?.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}{" "}
              miles
            </span>
            .
          </p>
        )}

        <p className="text-xs opacity-70">
          Potentially hazardous today:{" "}
          <span className="font-mono">{hazardousCount}</span>
        </p>
      </div>
    </section>
  );
}