import { DashboardLayout } from "@/layout/dashboard";
import { useTrainingsQuery } from "@/features/booking/queries/useTrainingsQuery";
import { useBookingToggleActiveMutation } from "@/features/booking/mutations/useBookingToggleActiveMutation";
import { useBookingUpdateStatusMutation } from "@/features/booking/mutations/useBookingUpdateStatusMutation";
import { useCreateTrainingMutation } from "@/features/booking/mutations/useCreateTrainingMutation";
import { useUpdateTrainingMutation } from "@/features/booking/mutations/useUpdateTrainingMutation";
import { BookingCardList } from "@/features/booking/components/booking-card-list";
import { TrainingFormDialog } from "@/features/booking/components/training/training-form-dialog";
import { useBookingFormLogic } from "@/features/booking/hooks/useBookingFormLogic";
import { toast } from "sonner";
import type { Booking, BookingStatus } from "@/features/types/booking";

export const DashboardTrainings = () => {
  const { data: trainings, isLoading, isError } = useTrainingsQuery();

  const toggleActiveMutation = useBookingToggleActiveMutation();
  const updateStatusMutation = useBookingUpdateStatusMutation();
  const createMutation = useCreateTrainingMutation();
  const updateMutation = useUpdateTrainingMutation();

  const {
    isOpen,
    setIsOpen,
    editing,
    openCreate,
    openEdit,
    handleSave,
    isSaving,
  } = useBookingFormLogic({
    bookingType: "TRAINING",
    createBooking: createMutation,
    updateBooking: updateMutation,
  });

  const isMutating =
    toggleActiveMutation.isPending || 
    updateStatusMutation.isPending || 
    createMutation.isPending ||
    updateMutation.isPending;

  const handleToggleActive = (booking: Booking) => {
    toast.promise(toggleActiveMutation.mutateAsync(booking.slug), {
      loading: "Cambiando estado...",
      success: `Estado de "${booking.title || "Entrenamiento"}" actualizado.`,
      error: "Error al cambiar el estado.",
    });
  };

  const handleStatusChange = (slug: string, status: BookingStatus) => {
    toast.promise(
      updateStatusMutation.mutateAsync({ slug, status }),
      {
        loading: "Actualizando estado...",
        success: `Estado del entrenamiento actualizado a ${status}.`,
        error: "Error al actualizar el estado.",
      }
    );
  };

  const renderContent = () => {
    if (isError) {
      return (
        <div className="flex items-center justify-center h-64 text-destructive">
          Error al cargar los entrenamientos.
        </div>
      );
    }

    return (
      <BookingCardList
        bookings={trainings || []}
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
        title="Entrenamientos"
        actionLabel="Nuevo Entrenamiento"
        onAction={openCreate}
      >
        {renderContent()}
      </DashboardLayout>

      <TrainingFormDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        bookingToEdit={editing}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </>
  );
};
