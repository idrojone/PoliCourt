// Tipos de reserva según OpenAPI
export type BookingType =
  | "RENTAL"
  | "CLASS"
  | "TRAINING";

// Estados de reserva según OpenAPI
export type BookingStatus = "CONFIRMED" | "PENDING" | "CANCELLED" | "COMPLETED";

export interface BookingAttendee {
  username: string;
  status: string;
}

export interface Booking {
  slug: string;
  courtSlug: string;
  organizerUsername: string;
  type: BookingType;
  title: string;
  description: string;
  startTime: string; // ISO date-time
  endTime: string; // ISO date-time
  totalPrice: number;
  attendeePrice: number; // Precio que paga cada asistente (para CLASS)
  status: BookingStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  attendees: BookingAttendee[];
}
