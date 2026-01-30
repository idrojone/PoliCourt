import { DashboardLayout } from "@/layout/dashboard";
import { useRentalsQuery } from "@/features/booking/queries/useRentalsQuery";
import { useBookingToggleActiveMutation } from "@/features/booking/mutations/useBookingToggleActiveMutation";
import { useBookingUpdateStatusMutation } from "@/features/booking/mutations/useBookingUpdateStatusMutation";
import { useCreateRentalMutation } from "@/features/booking/mutations/useCreateRentalMutation";
import { useUpdateRentalMutation } from "@/features/booking/mutations/useUpdateRentalMutation";
import { BookingCardList } from "@/features/booking/components/booking-card-list";
import { RentalFormDialog } from "@/features/booking/components/rental/rental-form-dialog";
import { useRentalFormLogic } from "@/features/booking/hooks/useRentalFormLogic";
import { toast } from "sonner";
import type { Booking, BookingStatus } from "@/features/types/booking";

export const DashboardRentals = () => {
  const { data: rentals, isLoading, isError } = useRentalsQuery();

  const toggleActiveMutation = useBookingToggleActiveMutation();
  const updateStatusMutation = useBookingUpdateStatusMutation();
  const createMutation = useCreateRentalMutation();
  const updateMutation = useUpdateRentalMutation();

  const {
    isOpen,
    setIsOpen,
    editing,
    openCreate,
    openEdit,
    handleSave,
    isSaving,
  } = useRentalFormLogic({
    createRental: createMutation,
    updateRental: updateMutation,
  });

  const isMutating =
    toggleActiveMutation.isPending || 
    updateStatusMutation.isPending || 
    createMutation.isPending ||
    updateMutation.isPending;

  const handleToggleActive = (booking: Booking) => {
    toast.promise(toggleActiveMutation.mutateAsync(booking.slug), {
      loading: "Cambiando estado...",
      success: `Estado de "${booking.title || "Alquiler"}" actualizado.`,
      error: "Error al cambiar el estado.",
    });
  };

  const handleStatusChange = (slug: string, status: BookingStatus) => {
    toast.promise(
      updateStatusMutation.mutateAsync({ slug, status }),
      {
        loading: "Actualizando estado...",
        success: `Estado de la reserva actualizado a ${status}.`,
        error: "Error al actualizar el estado.",
      }
    );
  };

  const renderContent = () => {
    if (isError) {
      return (
        <div className="flex items-center justify-center h-64 text-destructive">
          Error al cargar los alquileres.
        </div>
      );
    }

    return (
      <BookingCardList
        bookings={rentals || []}
        isPending={isMutating}
        isLoading={isLoading}
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

      <RentalFormDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        bookingToEdit={editing}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </>
  );
};
