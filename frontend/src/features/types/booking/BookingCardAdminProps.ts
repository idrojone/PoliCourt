import type { Booking, BookingStatus } from "./Booking";

export interface BookingCardAdminProps {
  booking: Booking;
  isOverlay?: boolean;
  toggleMutationPending: boolean;
  toggleActive: (booking: Booking) => void;
  handleStatusChange: (slug: string, status: BookingStatus) => void;
  onEdit?: (booking: Booking) => void;
}
