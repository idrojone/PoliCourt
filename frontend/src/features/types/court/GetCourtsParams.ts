import type { CourtSurfaceType } from "./Court";
import type { GeneralStatusType } from "@/types";

export interface GetCourtsParams {
    q?: string;
    name?: string;
    locationDetails?: string;
    priceMin?: number;
    priceMax?: number;
    capacityMin?: number;
    capacityMax?: number;
    isIndoor?: boolean;
    surfaces?: CourtSurfaceType[];
    statuses?: GeneralStatusType[];
    sports?: string[]; // slugs
    isActive?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
}
