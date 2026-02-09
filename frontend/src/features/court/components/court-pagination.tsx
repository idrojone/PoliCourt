import type { FC } from "react";
import {
  Pagination,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export const CourtPagination: FC<Props> = ({ page, totalPages, onPageChange }) => {
  return (
    <div className="fixed bottom-0 left-64 right-0 flex justify-between items-center border-t pt-4 pb-4 bg-background z-10 px-6">
      <PaginationPrevious
        onClick={() => onPageChange(Math.max(1, page - 1))}
        className={page === 1 ? "opacity-50 pointer-events-none" : ""}
      />

      <div className="flex items-center gap-2">
        <Pagination className="mt-0">
          <span className="text-sm">
            Página {page} / {totalPages ?? 1}
          </span>
        </Pagination>
      </div>

      <PaginationNext
        onClick={() => onPageChange(Math.min(totalPages ?? 1, page + 1))}
        className={page >= (totalPages ?? 1) ? "opacity-50 pointer-events-none" : ""}
      />
    </div>
  );
};
