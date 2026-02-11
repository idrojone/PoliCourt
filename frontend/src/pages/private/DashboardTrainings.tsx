import { DashboardLayout } from "@/layout/dashboard";
import { useBookingToggleActiveMutation } from "@/features/booking/mutations/useBookingToggleActiveMutation";
import { useBookingUpdateStatusMutation } from "@/features/booking/mutations/useBookingUpdateStatusMutation";
import { useCreateTrainingMutation } from "@/features/booking/mutations/useCreateTrainingMutation";
import { useUpdateTrainingMutation } from "@/features/booking/mutations/useUpdateTrainingMutation";
import { BookingCardList } from "@/features/booking/components/booking-card-list";
import { BookingFilters } from "@/features/booking/components/booking-filters";
import { BookingPagination } from "@/features/booking/components/booking-pagination";
import { TrainingFormDialog } from "@/features/booking/components/training/training-form-dialog";
import { useBookingFormLogic } from "@/features/booking/hooks/useBookingFormLogic";
import { useBookingsState } from "@/features/booking/hooks/useBookingsState";
import { useTrainingsPageQuery } from "@/features/booking/queries/useTrainingsPageQuery";
import { toast } from "sonner";
import type { Booking, BookingStatus } from "@/features/types/booking";

export const DashboardTrainings = () => {
  const { apiParams, page, setPage } = useBookingsState();

  const { data, isLoading, isError } = useTrainingsPageQuery(apiParams);

  const trainings = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;

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
        bookings={trainings}
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
        footer={
          <BookingPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        }
      >
        <BookingFilters />
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
