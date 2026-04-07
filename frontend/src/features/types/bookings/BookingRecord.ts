export const BookingStatus = {
  CONFIRMED: "CONFIRMED",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
  SUCCESS: "SUCCESS",
} as const;

export type BookingStatusType = (typeof BookingStatus)[keyof typeof BookingStatus];

export interface BookingRecord {
  uuid: string;
  status: BookingStatusType;
  startTime: string;
  endTime: string;
  totalPrice: number;
}

export interface BookingPage {
  content: BookingRecord[];
  page: number;
  limit: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface BookingResponse {
  uuid: string;
  type?: string;
  court?: any;
  organizer?: any;
  sport?: any;
  title?: string;
  description?: string;
  totalPrice?: number;
  attendeePrice?: number;
  startTime?: string;
  endTime?: string;
  status?: BookingStatusType;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookingSearchParams {
  q?: string;
  sportSlug?: string;
  courtSlug?: string;
  organizerUsername?: string;
  status?: BookingStatusType;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}
