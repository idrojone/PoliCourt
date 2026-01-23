import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange, className }) => {
  return (
    <div className={`flex justify-between items-center ${className || ""}`}>
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.max(page - 1, 1))}
        disabled={page === 1}
      >
        Anterior
      </Button>
      <span className="text-sm text-muted-foreground">
        Página {page} de {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
        disabled={page >= totalPages}
      >
        Siguiente
      </Button>
    </div>
  );
};