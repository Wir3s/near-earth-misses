import type { Neo } from "@/types/neo";
import type { DangerLevel } from "@/types/danger";

export function getDangerLevel(neos: Neo[]): DangerLevel {
  // No NEOs today – all clear!
  if (!neos || neos.length === 0) {
    return {
      label: "ALL CLEAR",
      tagline: "No near-Earth objects buzzing by today.",
      percent: 5,
      hazardousCount: 0,
    };
  }

  // Find closest by miss distance
  const sortedByDistance = [...neos].sort(
    (a, b) => a.missMiles - b.missMiles
  );
  const closest = sortedByDistance[0];
  const closestMiles = closest.missMiles;

  // Count hazardous ones
  const hazardousCount = neos.filter((n) => n.hazardous).length;

  // Super simple, silly heuristic for “danger percent”
  let percent = 15;

  if (closestMiles < 250_000) {
    percent = 95;
  } else if (closestMiles < 1_000_000) {
    percent = 80;
  } else if (closestMiles < 5_000_000) {
    percent = 60;
  } else if (closestMiles < 15_000_000) {
    percent = 40;
  } else {
    percent = 20;
  }

  if (hazardousCount > 0) {
    percent = Math.min(100, percent + 10);
  }

  // Pick label + tagline based on percent
  let label: string;
  let tagline: string;

  if (percent >= 90) {
    label = "SPICY CLOSE";
    tagline = "Maybe don’t look up. Just kidding. Mostly.";
  } else if (percent >= 70) {
    label = "COSMICALLY TINGLY";
    tagline = "Nothing to file with the insurance company, but still… 👀";
  } else if (percent >= 40) {
    label = "BACKGROUND RADIATION";
    tagline = "Just a normal day in the solar system.";
  } else {
    label = "SNOOZE CRUISE";
    tagline = "Space rocks are keeping a respectful distance today.";
  }

  return {
    label,
    tagline,
    percent,
    closest,
    hazardousCount,
    closestMiles,
  };
}