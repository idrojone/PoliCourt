import { HeaderPage } from "@/components/header-page"
import { MainLayout } from "@/layout/main"
import { useCourtsPageQuery } from "@/features/court/queries/useCourtsPageQuery.fa"
import { CourtFiltersPublic } from "@/features/court/components/court-filters-public"
import { CourtCardPublic } from "@/features/court/components/court-card-public"
import { usePublicCourtsState } from "@/features/court/hooks/usePublicCourtsState"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export const CourtPage = () => {
    // URL State
    const {
        qInput,
        setQInput,
        surfaces,
        setSurfaces,
        sports,
        setSports,
        isIndoorParam,
        setIsIndoor,
        page,
        setPage,
        clearFilters,
        apiParams
    } = usePublicCourtsState();

    // Query
    const { data, isLoading, isError } = useCourtsPageQuery(apiParams);

    return (
        <MainLayout>
            <HeaderPage
                title="Nuestras Instalaciones"
                description="Descubre todas nuestras pistas disponibles y reserva la que mejor se adapte a tus necesidades deportivas."
            />

            <div className="container mx-auto px-4 py-8">
                <CourtFiltersPublic
                    qInput={qInput}
                    setQInput={setQInput}
                    surfaces={surfaces}
                    setSurfaces={setSurfaces}
                    sports={sports}
                    setSports={setSports}
                    isIndoorParam={isIndoorParam}
                    setIsIndoor={setIsIndoor}
                    clearFilters={clearFilters}
                />

                {isLoading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : isError ? (
                    <div className="text-center py-20">
                        <p className="text-red-500 mb-2">Error al cargar las pistas.</p>
                        <button onClick={() => window.location.reload()} className="text-primary hover:underline">
                            Intentar de nuevo
                        </button>
                    </div>
                ) : !data || data.content.length === 0 ? (
                    <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed">
                        <p className="text-muted-foreground text-lg mb-2">No se encontraron pistas con los filtros seleccionados.</p>
                        <button onClick={clearFilters} className="text-primary hover:underline font-medium">
                            Limpiar filtros
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {data.content.map((court: any) => (
                                <div key={court.slug} className="h-full">
                                    <CourtCardPublic court={court} />
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
    )
}