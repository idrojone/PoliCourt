import {
    Pagination,
    PaginationPrevious,
    PaginationNext,
} from "@/components/ui/pagination";

interface DashboardPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const DashboardPagination = ({
    page,
    totalPages,
    onPageChange,
}: DashboardPaginationProps) => {
    const isFirstPage = page <= 1;
    const isLastPage = page >= totalPages;

    return (
        <div className="fixed bottom-0 left-64 right-0 flex justify-between items-center border-t pt-4 pb-4 bg-background z-10 px-6">
            <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, page - 1))}
                className={isFirstPage ? "opacity-50 pointer-events-none" : "cursor-pointer"}
            />

            <div className="flex items-center gap-2">
                <Pagination className="mt-0">
                    <span className="text-sm">
                        Página {page} / {totalPages}
                    </span>
                </Pagination>
            </div>

            <PaginationNext
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                className={isLastPage ? "opacity-50 pointer-events-none" : "cursor-pointer"}
            />
        </div>
    );
};
