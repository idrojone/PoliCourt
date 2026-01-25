import { SportCardList } from "@/features/sport/components/sport-card-list";
import { SportFormDialog } from "@/features/sport/components/sport-form-dialog";
import { useSportFormLogic } from "@/features/sport/hooks/useSportFormLogic";
import { useCreateSportMutation } from "@/features/sport/mutations/useSportCreateMutation";
import { useSportUpdateMutations } from "@/features/sport/mutations/useSportUpdateMutations";
import { useSportsAllQuery } from "@/features/sport/queries/useSportsAllQuery";
import { DashboardLayout } from "@/layout/dashboard";

export const DashboardSport = () => {
  const { data: sports, isLoading, isError } = useSportsAllQuery();

  const createSportMutation = useCreateSportMutation();
  const updateSportMutation = useSportUpdateMutations();

  const isSaving =
    createSportMutation.isPending || updateSportMutation.isPending;

  const { isOpen, setIsOpen, editing, openCreate, openEdit, handleSave } =
    useSportFormLogic(createSportMutation.mutate, updateSportMutation.mutate);

  const renderContent = () => {
    if (isLoading) {
      return <div>Cargando deportes...</div>;
    }

    if (isError) {
      return <div>Error al cargar los deportes.</div>;
    }

    return <SportCardList sports={sports || []} onEditSport={openEdit} />;
  };

  return (
    <DashboardLayout
      title="Deportes"
      actionLabel="Nuevo Deporte"
      onAction={openCreate}
    >
      {renderContent()}

      <SportFormDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        sportToEdit={editing}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </DashboardLayout>
  );
};
