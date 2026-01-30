import { DashboardLayout } from "@/layout/dashboard";
import { useClassesQuery } from "@/features/booking/queries/useClassesQuery";
import { useBookingToggleActiveMutation } from "@/features/booking/mutations/useBookingToggleActiveMutation";
import { useBookingUpdateStatusMutation } from "@/features/booking/mutations/useBookingUpdateStatusMutation";
import { useCreateClassMutation } from "@/features/booking/mutations/useCreateClassMutation";
import { useUpdateClassMutation } from "@/features/booking/mutations/useUpdateClassMutation";
import { BookingCardList } from "@/features/booking/components/booking-card-list";
import { ClassFormDialog } from "@/features/booking/components/class/class-form-dialog";
import { useBookingFormLogic } from "@/features/booking/hooks/useBookingFormLogic";
import { toast } from "sonner";
import type { Booking, BookingStatus } from "@/features/types/booking";

export const DashboardClasses = () => {
  const { data: classes, isLoading, isError } = useClassesQuery();

  const toggleActiveMutation = useBookingToggleActiveMutation();
  const updateStatusMutation = useBookingUpdateStatusMutation();
  const createMutation = useCreateClassMutation();
  const updateMutation = useUpdateClassMutation();

  const {
    isOpen,
    setIsOpen,
    editing,
    openCreate,
    openEdit,
    handleSave,
    isSaving,
  } = useBookingFormLogic({
    bookingType: "CLASS",
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
      success: `Estado de "${booking.title || "Clase"}" actualizado.`,
      error: "Error al cambiar el estado.",
    });
  };

  const handleStatusChange = (slug: string, status: BookingStatus) => {
    toast.promise(
      updateStatusMutation.mutateAsync({ slug, status }),
      {
        loading: "Actualizando estado...",
        success: `Estado de la clase actualizado a ${status}.`,
        error: "Error al actualizar el estado.",
      }
    );
  };

  const renderContent = () => {
    if (isError) {
      return (
        <div className="flex items-center justify-center h-64 text-destructive">
          Error al cargar las clases.
        </div>
      );
    }

    return (
      <BookingCardList
        bookings={classes || []}
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
        title="Clases"
        actionLabel="Nueva Clase"
        onAction={openCreate}
      >
        {renderContent()}
      </DashboardLayout>

      <ClassFormDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        bookingToEdit={editing}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </>
  );
};
