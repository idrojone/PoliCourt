export interface UserRentalCourt {
  name: string;
  slug: string;
  locationDetails?: string;
  imgUrl?: string;
  priceH?: number;
  capacity?: number;
  isIndoor?: boolean;
  surface?: string;
  status?: string;
  isActive?: boolean;
}

export interface UserRentalTicket {
  code: string;
  type: string;
  status: string;
  createdAt: string;
}

export interface UserRentalBooking {
  uuid: string;
  type: string;
  court?: UserRentalCourt;
  title?: string;
  description?: string;
  totalPrice?: number;
  attendeePrice?: number;
  startTime: string;
  endTime: string;
  status: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserRentalRecord {
  booking: UserRentalBooking;
  ticket: UserRentalTicket;
}

export interface UserRentalsPage {
  content: UserRentalRecord[];
  page: number;
  limit: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
