import type { Booking, BookingStatus } from "@/features/types/booking";
import { TrainingCard } from "./training-card";
import { BookingCardSkeleton } from "../shared";

interface TrainingCardListProps {
  bookings: Booking[];
  isPending: boolean;
  isLoading?: boolean;
  toggleActive: (booking: Booking) => void;
  handleStatusChange: (slug: string, status: BookingStatus) => void;
  onEdit?: (booking: Booking) => void;
}

export const TrainingCardList = ({
  bookings,
  isPending,
  isLoading = false,
  toggleActive,
  handleStatusChange,
  onEdit,
}: TrainingCardListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <BookingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No hay entrenamientos para mostrar.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {bookings.map((booking) => (
        <TrainingCard
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
