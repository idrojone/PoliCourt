import type { Court, CourtSurface } from "@/features/types/court/Court";
import type { GeneralStatusType } from "@/types";

export const mapCourtFromApi = (court: any): Court => ({
  name: court.name,
  slug: court.slug,
  location: court.location_details,
  imgUrl: court.img_url,
  priceH: court.price_h,
  capacity: court.capacity,
  isIndoor: court.is_indoor,
  surface: court.surface.toUpperCase() as CourtSurface,
  status: court.status.toUpperCase() as GeneralStatusType,
  isActive: court.is_active,
  sportsAvailable: [] // TODO: map if backend sends sports
});