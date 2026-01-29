import { DashboardLayout } from "@/layout/dashboard";
import { useTrainingsQuery } from "@/features/booking/queries/useTrainingsQuery";
import { useBookingToggleActiveMutation } from "@/features/booking/mutations/useBookingToggleActiveMutation";
import { useBookingUpdateStatusMutation } from "@/features/booking/mutations/useBookingUpdateStatusMutation";
import { useCreateTrainingMutation } from "@/features/booking/mutations/useCreateTrainingMutation";
import { BookingCardList } from "@/features/booking/components/booking-card-list";
import { BookingFormDialog } from "@/features/booking/components/booking-form-dialog";
import { useBookingFormLogic } from "@/features/booking/hooks/useBookingFormLogic";
import { toast } from "sonner";
import type { Booking, BookingStatus } from "@/features/types/booking";

export const DashboardTrainings = () => {
  const { data: trainings, isLoading, isError } = useTrainingsQuery();

  const toggleActiveMutation = useBookingToggleActiveMutation();
  const updateStatusMutation = useBookingUpdateStatusMutation();
  const createMutation = useCreateTrainingMutation();

  const {
    isOpen,
    setIsOpen,
    editing,
    openCreate,
    openEdit,
    handleSave,
  } = useBookingFormLogic({
    bookingType: "TRAINING",
    createBooking: createMutation,
  });

  const isMutating =
    toggleActiveMutation.isPending || 
    updateStatusMutation.isPending || 
    createMutation.isPending;

  const handleToggleActive = (booking: Booking) => {
    toast.promise(toggleActiveMutation.mutateAsync(booking.slug), {
      loading: "Cambiando estado...",
      success: `Estado de "${booking.title || "Entrenamiento"}" actualizado.`,
      error: "Error al cambiar el estado.",
    });
  };

  const handleStatusChange = (slug: string, status: string) => {
    toast.promise(
      updateStatusMutation.mutateAsync({ slug, status: status as BookingStatus }),
      {
        loading: "Actualizando estado...",
        success: `Estado del entrenamiento actualizado a ${status}.`,
        error: "Error al actualizar el estado.",
      }
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <div>Cargando entrenamientos...</div>;
    }

    if (isError) {
      return <div>Error al cargar los entrenamientos.</div>;
    }

    return (
      <BookingCardList
        bookings={trainings || []}
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
        title="Entrenamientos"
        actionLabel="Nuevo Entrenamiento"
        onAction={openCreate}
      >
        {renderContent()}
      </DashboardLayout>

      <BookingFormDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        bookingType="TRAINING"
        bookingToEdit={editing}
        onSave={handleSave}
        isSaving={createMutation.isPending}
      />
    </>
  );
};
