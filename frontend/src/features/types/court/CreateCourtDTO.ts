import type { CourtSurface } from "./Court";

// From OpenAPI
// "name": "Pista Central",
// "locationDetails": "Calle Falsa 123, Ciudad",
// "imgUrl": "https://policourt.com/images/court1.jpg",
// "priceH": 50,
// "capacity": 5000,
// "isIndoor": true,
// "surface": "HARD",
// "sports": ["TENNIS", "SQUASH"]

export interface CreateCourtDTO {
  name: string;
  locationDetails: string;
  imgUrl: string;
  priceH: number;
  capacity: number;
  isIndoor: boolean;
  surface: CourtSurface;
  sports: string[]; // Array of sport slugs
}
