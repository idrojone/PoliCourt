import type { ApiResponse, GeneralStatusType } from "@/types";
import type { Sport } from "../sport/Sport";

// From OpenAPI
// "name": "Pista Central",
// "slug": "pista-central",
// "location": "Calle Falsa 123",
// "imgUrl": "http://example.com/image.jpg",
// "priceH": 25.5,
// "capacity": 10,
// "isIndoor": true,
// "surface": "HARD",
// "status": "PUBLISHED",
// "isActive": true,
// "sportsAvailable": ["FUTBOL", "BALONCESTO"]

export type CourtSurface =
  | "HARD"
  | "CLAY"
  | "GRASS"
  | "SYNTHETIC"
  | "WOOD"
  | "OTHER";

export interface Court {
  name: string;
  slug: string;
  location: string;
  imgUrl: string;
  priceH: number;
  capacity: number;
  isIndoor: boolean;
  surface: CourtSurface;
  status: GeneralStatusType;
  isActive: boolean;
  sportsAvailable: string[];
}

export type CourtResponse = ApiResponse<Court>;
