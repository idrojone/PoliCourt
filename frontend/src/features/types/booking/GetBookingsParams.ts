export interface GetBookingsParams {
  courtSlug?: string;
  organizerUsername?: string;
  status?: string;
  isActive?: boolean;
  startTime?: string;
  endTime?: string;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
  page?: number;
  limit?: number;
  sort?: string;
}
