import type { ApiResponse, GeneralStatusType } from "@/types";
import type { SportSummary } from "../sport/SportSummary";

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
// "sportsAvailable": [{slug: "futbol", name: "Futbol", imgUrl: "..."}]

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
    locationDetails: string;
    imgUrl: string;
    priceH: number;
    capacity: number;
    isIndoor: boolean;
    surface: CourtSurface;
    status: GeneralStatusType;
    isActive: boolean;
    sports: SportSummary[]; // Updated from sportsAvailable
}

export type CourtResponse = ApiResponse<Court>;
