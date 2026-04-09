import { HeaderPage } from "@/components/header-page";
import { MainLayout } from "@/layout/main";
import { useClassesPageQuery } from "@/features/bookings/queries/useClassesPageQuery.sp";
import { ClassesFiltersPublic } from "@/features/bookings/components/classes-filters-public";
import ClassItem from "@/features/bookings/components/ClassItem";
import { usePublicClassesState } from "@/features/bookings/hooks/usePublicClassesState";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export const ClassesPage = () => {
    const {
        qInput,
        setQInput,
        sportSlug,
        setSportSlug,
        courtSlug,
        setCourtSlug,
        organizerInput,
        setOrganizerInput,
        page,
        setPage,
        clearFilters,
        apiParams,
    } = usePublicClassesState();

    const { data, isLoading, isError } = useClassesPageQuery(apiParams as any);

    return (
        <MainLayout>
            <HeaderPage
                title="Clases"
                description="Busca y descubre clases organizadas por monitores y clubes. Filtra por deporte, pista u organizador."
                backgroundImage="/src/assets/tennis-court-indoor-clay-surface-professional.jpg"
            />

            <div className="container mx-auto px-4 py-8">
                <ClassesFiltersPublic
                    qInput={qInput}
                    setQInput={setQInput}
                    sportSlug={sportSlug}
                    setSportSlug={setSportSlug}
                    courtSlug={courtSlug}
                    setCourtSlug={setCourtSlug}
                    organizerInput={organizerInput}
                    setOrganizerInput={setOrganizerInput}
                    clearFilters={clearFilters}
                />

                {isLoading ? (
                    <div className="flex items-center justify-center min-h-100">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : isError ? (
                    <div className="text-center py-20">
                        <p className="text-red-500 mb-2">Error al cargar las clases.</p>
                        <button onClick={() => window.location.reload()} className="text-primary hover:underline">Intentar de nuevo</button>
                    </div>
                ) : !data || data.content.length === 0 ? (
                    <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed">
                        <p className="text-muted-foreground text-lg mb-2">No se encontraron clases con los filtros seleccionados.</p>
                        <button onClick={clearFilters} className="text-primary hover:underline font-medium">Limpiar filtros</button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                            {data.content.map((c: any) => (
                                <div key={c.uuid} className="h-full">
                                    <ClassItem item={c} showActions={false} />
                                </div>
                            ))}
                        </div>

                        {data.totalPages > 1 && (
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (page > 1) setPage(page - 1);
                                            }}
                                            className={page === 1 ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: Math.min(5, data.totalPages) }).map((_, i) => {
                                        let pageNum = i + 1;
                                        if (data.totalPages > 5 && page > 3) {
                                            pageNum = page - 2 + i;
                                            if (pageNum > data.totalPages) pageNum = data.totalPages - (4 - i);
                                        }

                                        return (
                                            <PaginationItem key={pageNum}>
                                                <PaginationLink
                                                    href="#"
                                                    isActive={page === pageNum}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setPage(pageNum);
                                                    }}
                                                >
                                                    {pageNum}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    })}

                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (page < data.totalPages) setPage(page + 1);
                                            }}
                                            className={page === data.totalPages ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </>
                )}
            </div>
        </MainLayout>
    );
};

export default ClassesPage;
