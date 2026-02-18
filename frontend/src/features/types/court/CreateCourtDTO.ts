import type { CourtSurfaceType } from "./Court";

export interface CreateCourtDTO {
    name: string;
    locationDetails?: string;
    imgUrl?: string;
    priceH: number;
    capacity: number;
    isIndoor: boolean;
    surface: CourtSurfaceType;
    sportSlugs?: string[];
}
