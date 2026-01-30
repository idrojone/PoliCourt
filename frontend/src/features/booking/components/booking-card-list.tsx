import type { Booking, BookingStatus } from "@/features/types/booking";
import { BookingCardAdmin } from "./booking-card-admin";
import { Skeleton } from "@/components/ui/skeleton";

interface BookingCardListProps {
  bookings: Booking[];
  isPending: boolean;
  isLoading?: boolean;
  toggleActive: (booking: Booking) => void;
  handleStatusChange: (slug: string, status: BookingStatus) => void;
  onEdit?: (booking: Booking) => void;
}

const BookingCardSkeleton = () => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
    <div className="flex justify-between items-center pt-2">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-6 w-12 rounded-full" />
    </div>
  </div>
);

export const BookingCardList = ({
  bookings,
  isPending,
  isLoading = false,
  toggleActive,
  handleStatusChange,
  onEdit,
}: BookingCardListProps) => {
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
