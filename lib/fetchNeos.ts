// lib/fetchNeos.ts
import type { NeoApiResponse } from "@/types/neo";

function todayISO() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

const EMPTY_RESPONSE: NeoApiResponse = {
  date: todayISO(),
  count: 0,
  neos: [],
};

export async function getTodayNeos(): Promise<NeoApiResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // If we somehow don't have a base URL in this environment,
  // log it and return an empty dataset instead of throwing.
  if (!baseUrl) {
    console.error(
      "[getTodayNeos] NEXT_PUBLIC_BASE_URL is not set. Returning empty NEO data."
    );
    return EMPTY_RESPONSE;
  }

  const url = `${baseUrl}/api/neo/today`;

  try {
    const res = await fetch(url, {
      // You can tweak this; revalidate keeps it from refetching constantly
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error(
        `[getTodayNeos] API returned ${res.status} for ${url}. Falling back to empty data.`
      );
      return EMPTY_RESPONSE;
    }

    const data = (await res.json()) as NeoApiResponse;
    return data;
  } catch (error) {
    console.error("[getTodayNeos] Fetch failed:", error);
    return EMPTY_RESPONSE;
  }
}