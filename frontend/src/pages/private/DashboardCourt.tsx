import { CourtCardList } from "@/features/court/components/court-card-list";
import { CourtFiltersBar } from "@/features/court/components/court-filters-bar";
import { CourtFormDialog } from "@/features/court/components/court-form-dialog";
import { useCourtFormLogic } from "@/features/court/hooks/useCourtFormLogic";
import { useCreateCourtMutation } from "@/features/court/mutations/useCreateCourtMutation";
import { useUpdateCourtMutation } from "@/features/court/mutations/useUpdateCourtMutation";
import { DashboardLayout } from "@/layout/dashboard";
import { useCourtsState } from "@/features/court/hooks/useCourtsState";
import { useCourtsPageQuery } from "@/features/court/queries/useCourtsPageQuery";
import { DashboardPagination } from "@/components/shared/dashboard-pagination";
import type { Court } from "@/features/types/court/Court";

interface PageData {
    content: Court[];
    totalPages: number;
    totalElements: number;
}

export const DashboardCourt = () => {
    const courtsState = useCourtsState();
    const { page, setPage, apiParams } = courtsState;

    const { data, isLoading, isError } = useCourtsPageQuery(apiParams);
    const pageData = data as PageData;

    const createCourtMutation = useCreateCourtMutation();
    const updateCourtMutation = useUpdateCourtMutation();

    const isSaving =
        createCourtMutation.isPending || updateCourtMutation.isPending;

    const { isOpen, setIsOpen, editing, openCreate, openEdit, handleSave } =
        useCourtFormLogic(createCourtMutation.mutate, updateCourtMutation.mutate);

    const renderContent = () => {
        if (isLoading) return <div>Cargando pistas...</div>;
        if (isError) return <div>Error al cargar las pistas.</div>;

        const courts = pageData?.content || [];

        return <CourtCardList courts={courts} onEditCourt={openEdit} />;
    };

    return (
        <DashboardLayout
            title="Pistas"
            actionLabel="Nueva Pista"
            onAction={openCreate}>

            <CourtFiltersBar
                {...courtsState}
                totalElements={pageData?.totalElements ?? 0}
            />

            {renderContent()}

            <DashboardPagination
                page={page}
                totalPages={pageData?.totalPages ?? 1}
                onPageChange={setPage}
            />

            <CourtFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                courtToEdit={editing}
                onSave={handleSave}
                isSaving={isSaving}
            />
        </DashboardLayout >
    );
};
