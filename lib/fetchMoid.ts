const NASA_API_KEY = process.env.NASA_API_KEY;
const NASA_NEO_LOOKUP_URL = "https://api.nasa.gov/neo/rest/v1/neo";

// Return shape for MOID data
export type MoidInfo = {
  moidAu: number | null;
  moidKm: number | null;
};

export async function fetchMoidForNeo(id: string): Promise<MoidInfo> {
  if (!NASA_API_KEY) {
    throw new Error("Missing NASA_API_KEY in environment variables.");
  }

  const url = `${NASA_NEO_LOOKUP_URL}/${id}?api_key=${NASA_API_KEY}`;

  const res = await fetch(url, {
    // We can safely revalidate this every few hours — orbital data doesn’t change daily
    next: { revalidate: 60 * 60 * 6 },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`NASA NEO lookup error for ${id}:`, res.status, text);
    throw new Error(`Failed to fetch MOID for NEO ${id}`);
  }

  const data = await res.json();

  const moidAuRaw = data?.orbital_data?.minimum_orbit_intersection;
  const moidAu =
    moidAuRaw !== undefined && moidAuRaw !== null
      ? Number(moidAuRaw)
      : null;

  const AU_IN_KM = 149_597_870.7;
  const moidKm =
    typeof moidAu === "number" && !Number.isNaN(moidAu)
      ? moidAu * AU_IN_KM
      : null;

  return { moidAu, moidKm };
}