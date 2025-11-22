import { Neo, NeoApiResponse } from "@/types/neo";

export async function getTodayNeos(): Promise<NeoApiResponse> {
  const apiKey = process.env.NASA_API_KEY;
  if (!apiKey) {
    throw new Error("NASA_API_KEY is not set");
  }

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const url = new URL("https://api.nasa.gov/neo/rest/v1/feed");
  url.searchParams.set("start_date", today);
  url.searchParams.set("end_date", today);
  url.searchParams.set("api_key", apiKey);

  const res = await fetch(url.toString(), {
    // optional: make it clearly dynamic
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`NASA API request failed with ${res.status}`);
  }

  const data = await res.json();

  const rawNeos = data.near_earth_objects?.[today] ?? [];

  const neos: Neo[] = rawNeos.map((n: any) => {
    const closeApproach = n.close_approach_data[0];

    return {
      id: n.id,
      name: n.name,
      closeApproachDate: closeApproach.close_approach_date,
      missMiles: Number(closeApproach.miss_distance.miles),
      missKm: Number(closeApproach.miss_distance.kilometers),
      velocityMph: Number(closeApproach.relative_velocity.miles_per_hour),
      velocityKps: Number(closeApproach.relative_velocity.kilometers_per_second),
      magnitude: n.absolute_magnitude_h,
      hazardous: n.is_potentially_hazardous_asteroid,
    };
  });

  return {
    date: today,
    count: neos.length,
    neos,
  };
}