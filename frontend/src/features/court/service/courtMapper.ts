import type { Court, CourtSurface } from "@/features/types/court/Court";
import type { GeneralStatusType } from "@/types";

export const mapCourtFromApi = (court: any): Court => ({
    name: court.name,
    slug: court.slug,
    locationDetails: court.locationDetails || court.location_details,
    imgUrl: court.imgUrl || court.img_url,
    priceH: court.priceH || court.price_h,
    capacity: court.capacity,
    isIndoor: court.isIndoor || court.is_indoor,
    surface: (court.surface?.toUpperCase() as CourtSurface) || "HARD",
    status: (court.status?.toUpperCase() as GeneralStatusType) || "DRAFT",
    isActive: court.isActive !== undefined ? court.isActive : court.is_active,
    sports: court.sports || [],
});