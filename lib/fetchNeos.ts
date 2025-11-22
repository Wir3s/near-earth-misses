import { Neo } from "@/types/neo";

type NeoApiResponse = {
  date: string;
  count: number;
  neos: Neo[];
};

export async function getTodayNeos(): Promise<NeoApiResponse> {
  const res = await fetch("http://localhost:3000/api/neo/today", {
    // You can tweak this later; 3600 seconds = 1 hour
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch today's NEO data");
  }

  return res.json();
}