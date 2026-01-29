import { DashboardLayout } from "@/layout/dashboard";
import { useClassesQuery } from "@/features/booking/queries/useClassesQuery";
import { useBookingToggleActiveMutation } from "@/features/booking/mutations/useBookingToggleActiveMutation";
import { useBookingUpdateStatusMutation } from "@/features/booking/mutations/useBookingUpdateStatusMutation";
import { useCreateClassMutation } from "@/features/booking/mutations/useCreateClassMutation";
import { BookingCardList } from "@/features/booking/components/booking-card-list";
import { BookingFormDialog } from "@/features/booking/components/booking-form-dialog";
import { useBookingFormLogic } from "@/features/booking/hooks/useBookingFormLogic";
import { toast } from "sonner";
import type { Booking, BookingStatus } from "@/features/types/booking";

export const DashboardClasses = () => {
  const { data: classes, isLoading, isError } = useClassesQuery();

  const toggleActiveMutation = useBookingToggleActiveMutation();
  const updateStatusMutation = useBookingUpdateStatusMutation();
  const createMutation = useCreateClassMutation();

  const {
    isOpen,
    setIsOpen,
    editing,
    openCreate,
    openEdit,
    handleSave,
  } = useBookingFormLogic({
    bookingType: "CLASS",
    createBooking: createMutation,
  });

  const isMutating =
    toggleActiveMutation.isPending || 
    updateStatusMutation.isPending || 
    createMutation.isPending;

  const handleToggleActive = (booking: Booking) => {
    toast.promise(toggleActiveMutation.mutateAsync(booking.slug), {
      loading: "Cambiando estado...",
      success: `Estado de "${booking.title || "Clase"}" actualizado.`,
      error: "Error al cambiar el estado.",
    });
  };

  const handleStatusChange = (slug: string, status: string) => {
    toast.promise(
      updateStatusMutation.mutateAsync({ slug, status: status as BookingStatus }),
      {
        loading: "Actualizando estado...",
        success: `Estado de la clase actualizado a ${status}.`,
        error: "Error al actualizar el estado.",
      }
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <div>Cargando clases...</div>;
    }

    if (isError) {
      return <div>Error al cargar las clases.</div>;
    }

    return (
      <BookingCardList
        bookings={classes || []}
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
        title="Clases"
        actionLabel="Nueva Clase"
        onAction={openCreate}
      >
        {renderContent()}
      </DashboardLayout>

      <BookingFormDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        bookingType="CLASS"
        bookingToEdit={editing}
        onSave={handleSave}
        isSaving={createMutation.isPending}
      />
    </>
  );
};
