import type { ApiResponse, GeneralStatusType } from "@/types";
import type { Sport } from "../sport/Sport";

export const CourtSurface = {
    HARD: "HARD",
    CLAY: "CLAY",
    GRASS: "GRASS",
    SYNTHETIC: "SYNTHETIC",
    WOOD: "WOOD",
    OTHER: "OTHER",
} as const;

export type CourtSurfaceType = (typeof CourtSurface)[keyof typeof CourtSurface];

export interface Court {
    name: string;
    slug: string;
    locationDetails: string;
    imgUrl: string;
    priceH: number;
    capacity: number;
    isIndoor: boolean;
    surface: CourtSurfaceType;
    sports: Sport[];
    status: GeneralStatusType;
    isActive: boolean;
}

export type CourtResponse = ApiResponse<Court>;
