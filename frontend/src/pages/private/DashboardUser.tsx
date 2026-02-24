import { UserFilters } from "../../features/user/components/UserFilters";
import { UserList } from "../../features/user/components/UserList";
import { useUsersPageQuery } from "../../features/user/queries/useUsersPageQuery";
import { useUsersState } from "../../features/user/hooks/useUsersState";
import { DashboardLayout } from "@/layout/dashboard";
import { DashboardPagination } from "@/components/shared/dashboard-pagination";
import type { User } from "@/features/types/user/User";

interface PageData {
    content: User[];
    totalPages: number;
    totalElements: number;
}

export const DashboardUser = () => {
    const {
        qInput,
        setQInput,
        status,
        setStatus,
        isActive,
        setIsActive,
        page,
        limit,
        sort,
        setSort,
        setPage,
        setLimit,
        clearFilters,
        apiParams,
    } = useUsersState();

    const { data, isLoading, isError } = useUsersPageQuery(apiParams);
    const pageData = data as PageData;

    const handleCreate = () => {
        console.log("Create user clicked");
    };

    const renderContent = () => {
        if (isLoading) return <div>Cargando usuarios...</div>;
        if (isError) return <div>Error al cargar usuarios.</div>;

        const users = pageData?.content || [];

        return <UserList users={users} sort={sort} onSort={setSort} />;
    };

    return (
        <DashboardLayout
            title="Gestión de Usuarios"
            actionLabel="Nuevo Usuario"
            onAction={handleCreate}
        >
            <UserFilters
                qInput={qInput}
                setQInput={setQInput}
                status={status}
                setStatus={setStatus}
                isActive={isActive}
                setIsActive={setIsActive}
                limit={limit}
                setLimit={setLimit}
                totalElements={pageData?.totalElements || 0}
                clearFilters={clearFilters}
            />

            {renderContent()}

            <DashboardPagination
                page={page}
                totalPages={pageData?.totalPages || 1}
                onPageChange={setPage}
            />
        </DashboardLayout>
    );
};
