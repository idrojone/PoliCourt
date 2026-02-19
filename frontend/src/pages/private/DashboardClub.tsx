import { ClubCardList } from "@/features/club/components/club-card-list";
import { ClubFiltersBar } from "@/features/club/components/club-filters-bar";
import { ClubFormDialog } from "@/features/club/components/club-form-dialog";
import { useClubFormLogic } from "@/features/club/hooks/useClubFormLogic";
import { useCreateClubMutation } from "@/features/club/mutations/useCreateClubMutation";
import { useUpdateClubMutation } from "@/features/club/mutations/useUpdateClubMutation";
import { DashboardLayout } from "@/layout/dashboard";
import { useClubsState } from "@/features/club/hooks/useClubsState";
import { useClubsPageQuery } from "@/features/club/queries/useClubsPageQuery.sb";
import { DashboardPagination } from "@/components/shared/dashboard-pagination";
import type { Club } from "@/features/types/club/Club";

interface PageData {
    content: Club[];
    totalPages: number;
    totalElements: number;
}

export const DashboardClub = () => {
    const clubsState = useClubsState();
    const { page, setPage, apiParams } = clubsState;

    const { data: pageData, isLoading, isError } = useClubsPageQuery(apiParams);

    const createClubMutation = useCreateClubMutation();
    const updateClubMutation = useUpdateClubMutation();

    const isSaving =
        createClubMutation.isPending || updateClubMutation.isPending;

    const { isOpen, setIsOpen, editing, openCreate, openEdit, handleSave } =
        useClubFormLogic(createClubMutation.mutate, updateClubMutation.mutate);

    const renderContent = () => {
        if (isLoading) return <div>Cargando clubes...</div>;
        if (isError) return <div>Error al cargar los clubes.</div>;

        const clubs = (pageData as PageData)?.content || [];

        return <ClubCardList clubs={clubs} onEditClub={openEdit} />;
    };

    return (
        <DashboardLayout
            title="Clubes"
            actionLabel="Nuevo Club"
            onAction={openCreate}>

            <ClubFiltersBar
                {...clubsState}
                totalElements={(pageData as PageData)?.totalElements ?? 0}
            />

            {renderContent()}

            <DashboardPagination
                page={page}
                totalPages={(pageData as PageData)?.totalPages ?? 1}
                onPageChange={setPage}
            />

            <ClubFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                clubToEdit={editing}
                onSave={handleSave}
                isSaving={isSaving}
            />
        </DashboardLayout >
    );
};
