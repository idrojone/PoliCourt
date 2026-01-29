import { DashboardLayout } from "@/layout/dashboard";
import { useTournamentsQuery } from "@/features/booking/queries/useTournamentsQuery";
import { useBookingToggleActiveMutation } from "@/features/booking/mutations/useBookingToggleActiveMutation";
import { useBookingUpdateStatusMutation } from "@/features/booking/mutations/useBookingUpdateStatusMutation";
import { useCreateTournamentMutation } from "@/features/booking/mutations/useCreateTournamentMutation";
import { BookingCardList } from "@/features/booking/components/booking-card-list";
import { BookingFormDialog } from "@/features/booking/components/booking-form-dialog";
import { useBookingFormLogic } from "@/features/booking/hooks/useBookingFormLogic";
import { toast } from "sonner";
import type { Booking, BookingStatus } from "@/features/types/booking";

export const DashboardTournaments = () => {
  const { data: tournaments, isLoading, isError } = useTournamentsQuery();

  const toggleActiveMutation = useBookingToggleActiveMutation();
  const updateStatusMutation = useBookingUpdateStatusMutation();
  const createMutation = useCreateTournamentMutation();

  const {
    isOpen,
    setIsOpen,
    editing,
    openCreate,
    openEdit,
    handleSave,
  } = useBookingFormLogic({
    bookingType: "TOURNAMENT",
    createBooking: createMutation,
  });

  const isMutating =
    toggleActiveMutation.isPending || 
    updateStatusMutation.isPending || 
    createMutation.isPending;

  const handleToggleActive = (booking: Booking) => {
    toast.promise(toggleActiveMutation.mutateAsync(booking.slug), {
      loading: "Cambiando estado...",
      success: `Estado de "${booking.title || "Torneo"}" actualizado.`,
      error: "Error al cambiar el estado.",
    });
  };

  const handleStatusChange = (slug: string, status: string) => {
    toast.promise(
      updateStatusMutation.mutateAsync({ slug, status: status as BookingStatus }),
      {
        loading: "Actualizando estado...",
        success: `Estado del torneo actualizado a ${status}.`,
        error: "Error al actualizar el estado.",
      }
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <div>Cargando torneos...</div>;
    }

    if (isError) {
      return <div>Error al cargar los torneos.</div>;
    }

    return (
      <BookingCardList
        bookings={tournaments || []}
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
        title="Torneos"
        actionLabel="Nuevo Torneo"
        onAction={openCreate}
      >
        {renderContent()}
      </DashboardLayout>

      <BookingFormDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        bookingType="TOURNAMENT"
        bookingToEdit={editing}
        onSave={handleSave}
        isSaving={createMutation.isPending}
      />
    </>
  );
};
