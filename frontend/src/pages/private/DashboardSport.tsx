import { SportCardList } from "@/features/sport/components/sport-card-list";
import { SportFormDialog } from "@/features/sport/components/sport-form-dialog";
import { SportFiltersBar } from "@/features/sport/components/sport-filters-bar";
import { useSportFormLogic } from "@/features/sport/hooks/useSportFormLogic";
import { useCreateSportMutation } from "@/features/sport/mutations/useSportCreateMutation";
import { useSportUpdateMutations } from "@/features/sport/mutations/useSportUpdateMutations";
import { DashboardLayout } from "@/layout/dashboard";
import { useSportsState } from "@/features/sport/hooks/useSportsState";
import { useSportsPageQuery } from "@/features/sport/queries/useSportsPageQuery";
import { DashboardPagination } from "@/components/shared/dashboard-pagination";
import type { Sport } from "@/features/types/sport/Sport";


interface PageData {
    content: Sport[];
    totalPages: number;
    totalElements: number;
}

export const DashboardSport = () => {
    const {
        qInput,
        setQInput,
        status,
        setStatus,
        isActive,
        setIsActive,
        page,
        limit,
        setPage,
        setLimit,
        clearFilters,
        apiParams,
    } = useSportsState();

    const { data, isLoading, isError } = useSportsPageQuery(apiParams);
    const pageData = data as PageData;

    const createSportMutation = useCreateSportMutation();
    const updateSportMutation = useSportUpdateMutations();

    const isSaving =
        createSportMutation.isPending || updateSportMutation.isPending;

    const { isOpen, setIsOpen, editing, openCreate, openEdit, handleSave } =
        useSportFormLogic(createSportMutation.mutate, updateSportMutation.mutate);

    const renderContent = () => {
        if (isLoading) return <div>Cargando deportes...</div>;
        if (isError) return <div>Error al cargar los deportes.</div>;

        const sports = pageData?.content || [];

        return <SportCardList sports={sports} onEditSport={openEdit} />;
    };

    return (
        <DashboardLayout
            title="Deportes"
            actionLabel="Nuevo Deporte"
            onAction={openCreate}>
            <SportFiltersBar
                qInput={qInput}
                setQInput={setQInput}
                status={status}
                setStatus={setStatus}
                isActive={isActive}
                setIsActive={setIsActive}
                limit={limit}
                setLimit={setLimit}
                totalElements={pageData?.totalElements ?? 0}
                clearFilters={clearFilters}
            />

            {renderContent()}

            <DashboardPagination
                page={page}
                totalPages={pageData?.totalPages ?? 1}
                onPageChange={setPage}
            />

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
