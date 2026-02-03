import { DashboardLayout } from "@/layout/dashboard";
import { useCourtsAllQuery } from "@/features/court/queries/useCourtsAllQuery.sb";
import { useCreateCourtMutation } from "@/features/court/mutations/useCourtCreateMutation";
import { useCourtUpdateMutation } from "@/features/court/mutations/useCourtUpdateMutation";
import { useCourtFormLogic } from "@/features/court/hooks/useCourtFormLogic";
import { CourtCardList } from "@/features/court/components/court-card-list";
import { CourtFormDialog } from "@/features/court/components/court-form-dialog";
import { useCourtToggleActiveMutation } from "@/features/court/mutations/useCourtToggleActiveMutation";
import { useCourtUpdateStatusMutation } from "@/features/court/mutations/useCourtUpdateStatusMutation";
import { toast } from "sonner";
import type { Court } from "@/features/types/court/Court";
import type { GeneralStatusType } from "@/types";

export const DashboardCourt = () => {
  const { data: courts, isLoading, isError } = useCourtsAllQuery();

  const createCourtMutation = useCreateCourtMutation();
  const updateCourtMutation = useCourtUpdateMutation();
  const toggleActiveMutation = useCourtToggleActiveMutation();
  const updateStatusMutation = useCourtUpdateStatusMutation();

  const isMutating =
    createCourtMutation.isPending ||
    updateCourtMutation.isPending ||
    toggleActiveMutation.isPending ||
    updateStatusMutation.isPending;

  const { isOpen, setIsOpen, editing, openCreate, openEdit, handleSave } =
    useCourtFormLogic(createCourtMutation.mutate, updateCourtMutation.mutate);

  const handleToggleActive = (court: Court) => {
    toast.promise(toggleActiveMutation.mutateAsync(court.slug), {
      loading: "Cambiando visibilidad...",
      success: `Visibilidad de "${court.name}" actualizada.`,
      error: "Error al cambiar la visibilidad.",
    });
  };

  const handleStatusChange = (slug: string, status: GeneralStatusType) => {
    toast.promise(updateStatusMutation.mutateAsync({ slug, status }), {
      loading: "Actualizando estado...",
      success: `Estado de la pista actualizado a ${status}.`,
      error: "Error al actualizar el estado.",
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return <div>Cargando pistas...</div>;
    }

    if (isError) {
      return <div>Error al cargar las pistas.</div>;
    }

    return (
      <CourtCardList
        courts={courts || []}
        isPending={isMutating}
        openEdit={openEdit}
        toggleActive={handleToggleActive}
        handleStatusChange={handleStatusChange}
      />
    );
  };

  return (
    <DashboardLayout
      title="Pistas"
      actionLabel="Nueva Pista"
      onAction={openCreate}
    >
      {renderContent()}

      <CourtFormDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        courtToEdit={editing}
        onSave={handleSave}
        isSaving={
          createCourtMutation.isPending || updateCourtMutation.isPending
        }
      />
    </DashboardLayout>
  );
};
