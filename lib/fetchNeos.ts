import type { NeoApiResponse } from "@/types/neo";

function getBaseUrl() {
  // Use NEXT_PUBLIC_BASE_URL if you’ve set it, otherwise fall back.
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export async function getTodayNeos(): Promise<NeoApiResponse> {
  const baseUrl = getBaseUrl();

  const res = await fetch(`${baseUrl}/api/neo/today`, {
    // cache rules as you like; this keeps it reasonably fresh
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch NEO data");
  }

  const data: NeoApiResponse = await res.json();

  // 🔍 Optional: sanity check
  if (data.neos.length > 0) {
    console.log("fetchNeos sample NEO:", data.neos[0]);
  }

  return data;
}