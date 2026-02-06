export interface GetCourtsParams {
  q?: string;
  name?: string;
  locationDetails?: string;
  priceMin?: number;
  priceMax?: number;
  capacityMin?: number;
  capacityMax?: number;
  isIndoor?: boolean;
  surface?: string[];
  status?: string[];
  isActive?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}
