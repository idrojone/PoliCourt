import type { Booking, BookingStatus } from "@/features/types/booking";
import { BookingCardAdmin } from "./booking-card-admin";

interface BookingCardListProps {
  bookings: Booking[];
  isPending: boolean;
  toggleActive: (booking: Booking) => void;
  handleStatusChange: (slug: string, status: BookingStatus) => void;
  onEdit?: (booking: Booking) => void;
}

export const BookingCardList = ({
  bookings,
  isPending,
  toggleActive,
  handleStatusChange,
  onEdit,
}: BookingCardListProps) => {
  if (bookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No hay reservas para mostrar.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {bookings.map((booking) => (
        <BookingCardAdmin
          key={booking.slug}
          booking={booking}
          toggleMutationPending={isPending}
          toggleActive={toggleActive}
          handleStatusChange={handleStatusChange}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};
