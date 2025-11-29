export type Neo = {
  id: string;
  name: string;
  closeApproachDate: string;
  missMiles: number;
  missKm: number;
  velocityMph: number;
  velocityKps: number;
  magnitude: number;
  hazardous: boolean;
  // moidAu: in astronomical units
  // moidLunar: in lunar distances (Earth–Moon distances)
  moidAu?: number | null;
  moidKm?: number | null;
};



export type NeoApiResponse = {
  date: string;   // the day you queried
  count: number;  // neos.length
  neos: Neo[];
};