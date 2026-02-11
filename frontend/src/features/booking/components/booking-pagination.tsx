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

export const BookingPagination: FC<Props> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex justify-between items-center py-2">
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
        className={
          page >= (totalPages ?? 1) ? "opacity-50 pointer-events-none" : ""
        }
      />
    </div>
  );
};
