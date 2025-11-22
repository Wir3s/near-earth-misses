import { Neo } from "@/types/neo";

interface NeoTableProps {
  neos: Neo[];
}

export function NeoTable({ neos }: NeoTableProps) {
  if (!neos.length) return null;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800/70 bg-slate-950/70">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-right">Miss distance</th>
            <th className="px-4 py-3 text-right hidden sm:table-cell">Speed</th>
            <th className="px-4 py-3 text-center">Hazard</th>
            <th className="px-4 py-3 text-right hidden md:table-cell">Mag</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {neos.map((neo) => (
            <tr key={neo.id} className="hover:bg-slate-900/60">
              <td className="px-4 py-3">
                <div className="font-medium text-slate-100">{neo.name}</div>
                <div className="text-xs text-slate-500">
                  {neo.closeApproachDate}
                </div>
              </td>

              <td className="px-4 py-3 text-right text-sky-200">
                {neo.missMiles.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{" "}
                mi
              </td>

              <td className="px-4 py-3 text-right text-slate-200 hidden sm:table-cell">
                {neo.velocityMph.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{" "}
                mph
              </td>

              <td className="px-4 py-3 text-center">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                    neo.hazardous
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  }`}
                >
                  {neo.hazardous ? "Potentially hazardous" : "Mostly harmless"}
                </span>
              </td>

              <td className="px-4 py-3 text-right text-slate-300 hidden md:table-cell">
                {neo.magnitude.toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}