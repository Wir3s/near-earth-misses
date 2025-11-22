import type { Neo } from "@/types/neo";
import type { DangerSummary } from "@/types/danger";

export function getDangerLevel(neos: Neo[]): DangerSummary {
  // We expect the caller to guard against an empty array.
  // If you want an extra safety net, you *can* add a runtime check here too.
  const hazardousCount = neos.filter((n) => n.hazardous).length;

  const closest = neos.reduce((min, neo) =>
    neo.missMiles < min.missMiles ? neo : min,
    neos[0]
  );

  const closestMiles = closest.missMiles;

  // Super simple "danger" scaling based on distance
  const normalized = Math.max(0, Math.min(1, 1_000_000 / (closestMiles + 1)));
  const percent = 5 + Math.round(normalized * 90); // clamp ~5–95%

  let label: string;
  let tagline: string;

  if (closestMiles < 1_000_000) {
    label = "Very Close";
    tagline = "Maybe don’t schedule any rooftop stargazing tonight.";
  } else if (closestMiles < 5_000_000) {
    label = "Kinda Close";
    tagline = "A dramatic, but statistically harmless, flyby.";
  } else if (closestMiles < 20_000_000) {
    label = "Comfortably Distant";
    tagline = "Cosmic neighbors keeping a respectful distance.";
  } else {
    label = "Chill";
    tagline = "Space rocks are minding their own business today.";
  }

  return {
    label,
    tagline,
    percent,
    closest,
    closestMiles,
    hazardousCount,
  };
}