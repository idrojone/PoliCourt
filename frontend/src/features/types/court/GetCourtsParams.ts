export interface GetCourtsParams {
  q?: string;
  name?: string;
  locationDetails?: string;
  price_h?: number;
  capacity?: number;
  isIndoor?: boolean;
  surface?: string;
  status?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}
