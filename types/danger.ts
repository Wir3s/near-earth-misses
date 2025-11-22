import { Neo } from "./neo";

export type DangerSummary = {
  label: string;          // e.g. "Totally Fine", "Mildly Alarming", etc.
  tagline: string;        // the whimsical line
  percent: number;        // 0–100 danger meter fill
  closest: Neo;    // the closest-approaching asteroid
  hazardousCount: number; // how many are flagged as hazardous
  closestMiles: number;   // distance in miles of the closest approach
};