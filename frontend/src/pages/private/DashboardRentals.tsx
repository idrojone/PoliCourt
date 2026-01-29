import { DashboardLayout } from "@/layout/dashboard";
import { useRentalsQuery } from "@/features/booking/queries/useRentalsQuery";
import { useBookingToggleActiveMutation } from "@/features/booking/mutations/useBookingToggleActiveMutation";
import { useBookingUpdateStatusMutation } from "@/features/booking/mutations/useBookingUpdateStatusMutation";
import { useCreateRentalMutation } from "@/features/booking/mutations/useCreateRentalMutation";
import { BookingCardList } from "@/features/booking/components/booking-card-list";
import { BookingFormDialog } from "@/features/booking/components/booking-form-dialog";
import { useBookingFormLogic } from "@/features/booking/hooks/useBookingFormLogic";
import { toast } from "sonner";
import type { Booking, BookingStatus } from "@/features/types/booking";

export const DashboardRentals = () => {
  const { data: rentals, isLoading, isError } = useRentalsQuery();

  const toggleActiveMutation = useBookingToggleActiveMutation();
  const updateStatusMutation = useBookingUpdateStatusMutation();
  const createMutation = useCreateRentalMutation();

  const {
    isOpen,
    setIsOpen,
    editing,
    openCreate,
    openEdit,
    handleSave,
  } = useBookingFormLogic({
    bookingType: "RENTAL",
    createBooking: createMutation,
  });

  const isMutating =
    toggleActiveMutation.isPending || 
    updateStatusMutation.isPending || 
    createMutation.isPending;

  const handleToggleActive = (booking: Booking) => {
    toast.promise(toggleActiveMutation.mutateAsync(booking.slug), {
      loading: "Cambiando estado...",
      success: `Estado de "${booking.title || "Alquiler"}" actualizado.`,
      error: "Error al cambiar el estado.",
    });
  };

  const handleStatusChange = (slug: string, status: string) => {
    toast.promise(
      updateStatusMutation.mutateAsync({ slug, status: status as BookingStatus }),
      {
        loading: "Actualizando estado...",
        success: `Estado de la reserva actualizado a ${status}.`,
        error: "Error al actualizar el estado.",
      }
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <div>Cargando alquileres...</div>;
    }

    if (isError) {
      return <div>Error al cargar los alquileres.</div>;
    }

    return (
      <BookingCardList
        bookings={rentals || []}
        isPending={isMutating}
        toggleActive={handleToggleActive}
        handleStatusChange={handleStatusChange}
        onEdit={openEdit}
      />
    );
  };

  return (
    <>
      <DashboardLayout
        title="Alquileres"
        actionLabel="Nuevo Alquiler"
        onAction={openCreate}
      >
        {renderContent()}
      </DashboardLayout>

      <BookingFormDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        bookingType="RENTAL"
        bookingToEdit={editing}
        onSave={handleSave}
        isSaving={createMutation.isPending}
      />
    </>
  );
};
