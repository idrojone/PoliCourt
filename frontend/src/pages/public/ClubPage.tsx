import { HeaderPage } from "@/components/header-page"
import { MainLayout } from "@/layout/main"
import { useClubsPageQuery } from "@/features/club/queries/useClubsPageQuery.fa"
import { ClubFiltersPublic } from "@/features/club/components/club-filters-public"
import { ClubCardPublic } from "@/features/club/components/club-card-public"
import { usePublicClubsState } from "@/features/club/hooks/usePublicClubsState"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import type { Club } from "@/features/types/club/Club"

export const ClubPage = () => {
    // URL State
    const {
        qInput,
        setQInput,
        sports,
        setSports,
        page,
        setPage,
        clearFilters,
        apiParams
    } = usePublicClubsState();

    // Query
    const { data, isLoading, isError } = useClubsPageQuery(apiParams);

    return (
        <MainLayout>
            <HeaderPage
                title="Nuestros Clubes"
                description="Únete a una comunidad apasionada. Descubre clubes deportivos, participa en torneos y mejora tu juego con los mejores."
            />

            <div className="container mx-auto px-4 py-8">
                <ClubFiltersPublic
                    qInput={qInput}
                    setQInput={setQInput}
                    sports={sports}
                    setSports={setSports}
                    clearFilters={clearFilters}
                />

                {isLoading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : isError ? (
                    <div className="text-center py-20">
                        <p className="text-red-500 mb-2">Error al cargar los clubes.</p>
                        <button onClick={() => window.location.reload()} className="text-primary hover:underline">
                            Intentar de nuevo
                        </button>
                    </div>
                ) : !data || data.content.length === 0 ? (
                    <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed">
                        <p className="text-muted-foreground text-lg mb-2">No se encontraron clubes con los filtros seleccionados.</p>
                        <button onClick={clearFilters} className="text-primary hover:underline font-medium">
                            Limpiar filtros
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {data.content.map((club: Club) => (
                                <div key={club.slug} className="h-full">
                                    <ClubCardPublic club={club} />
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
