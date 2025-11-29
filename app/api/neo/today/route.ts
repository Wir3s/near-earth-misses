import { NextResponse } from "next/server";
import { Neo } from "@/types/neo";
import { fetchMoidForNeo } from "@/lib/fetchMoid";

const NASA_API_KEY = process.env.NASA_API_KEY;
const NASA_NEO_FEED_URL = "https://api.nasa.gov/neo/rest/v1/feed";

function formatDate(date = new Date()): string {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

export async function GET() {
  if (!NASA_API_KEY) {
    return NextResponse.json(
      { error: "Missing NASA_API_KEY in environment variables." },
      { status: 500 }
    );
  }

  const today = formatDate();

  const url = `${NASA_NEO_FEED_URL}?start_date=${today}&end_date=${today}&api_key=${NASA_API_KEY}`;

  try {
    const res = await fetch(url, {
      // avoid using stale cached responses
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("NASA NEO API error:", res.status, text);
      return NextResponse.json(
        { error: "Failed to fetch NEO data from NASA." },
        { status: res.status }
      );
    }

    const data = await res.json();

    // NASA returns an object keyed by date: near_earth_objects["2025-11-22"]
    const neosRaw: any[] = data.near_earth_objects?.[today] ?? [];

    const baseNeos: Neo[] = neosRaw.map((neo) => {
      const approach = neo.close_approach_data?.[0];

      const missMiles = Number(
        approach?.miss_distance?.miles ?? neo.missMiles ?? 0
      );
      const missKm = Number(
        approach?.miss_distance?.kilometers ?? neo.missKm ?? 0
      );
      const velocityMph = Number(
        approach?.relative_velocity?.miles_per_hour ?? neo.velocityMph ?? 0
      );
      const velocityKps = Number(
        approach?.relative_velocity?.kilometers_per_second ??
          neo.velocityKps ??
          0
      );

      const closeApproachDate =
        approach?.close_approach_date ?? neo.closeApproachDate ?? today;

      const hazardous = Boolean(neo.is_potentially_hazardous_asteroid);

      return {
        id: String(neo.id),
        name: String(neo.name),
        closeApproachDate,
        missMiles,
        missKm,
        velocityMph,
        velocityKps,
        magnitude: Number(neo.absolute_magnitude_h ?? neo.magnitude ?? 0),
        hazardous,
        // moidAu / moidKm will be added in the next step
      } as Neo;
    });

    // 🔭 NEW: Enrich a subset of NEOs with MOID
    // Strategy:
    //  - Always enrich hazardous ones
    //  - Also enrich the first few closest objects
    const sortedByDistance = [...baseNeos].sort(
      (a, b) => a.missMiles - b.missMiles
    );

    const closestIds = new Set(
      sortedByDistance.slice(0, 5).map((neo) => neo.id)
    );

    const neosWithMoid: Neo[] = await Promise.all(
      baseNeos.map(async (neo) => {
        const shouldEnrich =
          neo.hazardous || closestIds.has(neo.id);

        if (!shouldEnrich) {
          return neo;
        }

        try {
          const { moidAu, moidKm } = await fetchMoidForNeo(neo.id);
          return {
            ...neo,
            moidAu,
            moidKm,
          };
        } catch (error) {
          console.error(`Error fetching MOID for NEO ${neo.id}:`, error);
          return neo; // fall back gracefully
        }
      })
    );

    return NextResponse.json({
      date: today,
      count: neosWithMoid.length,
      neos: neosWithMoid,
    });
  } catch (error) {
    console.error("Error fetching NEO data:", error);
    return NextResponse.json(
      { error: "Unexpected error fetching NEO data." },
      { status: 500 }
    );
  }
}