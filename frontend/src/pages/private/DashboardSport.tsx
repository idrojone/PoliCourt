import { SportCardList } from "@/features/sport/components/sport-card-list";
import { SportFormDialog } from "@/features/sport/components/sport-form-dialog";
import { useSportFormLogic } from "@/features/sport/hooks/useSportFormLogic";
import { useCreateSportMutation } from "@/features/sport/mutations/useSportCreateMutation";
import { useSportUpdateMutations } from "@/features/sport/mutations/useSportUpdateMutations";
import { DashboardLayout } from "@/layout/dashboard";
import { useSportsState } from "@/features/sport/hooks/useSportsState";
import { useSportsPageQuery } from "@/features/sport/queries/useSportsPageQuery";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Pagination,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { useState } from "react";
import type { Sport } from "@/features/types/sport/Sport";


interface PageData {
  content: Sport[];
  totalPages: number;
  totalElements: number;
}

export const DashboardSport = () => {
  const {
    qInput,
    setQInput,
    status,
    setStatus,
    isActive,
    setIsActive,
    page,
    limit,
    setPage,
    setLimit,
    clearFilters,
    apiParams,
  } = useSportsState();

  const [statusOpen, setStatusOpen] = useState(false);

  const { data, isLoading, isError } = useSportsPageQuery(apiParams);
  const pageData = data as PageData;

  const createSportMutation = useCreateSportMutation();
  const updateSportMutation = useSportUpdateMutations();

  const isSaving =
    createSportMutation.isPending || updateSportMutation.isPending;

  const { isOpen, setIsOpen, editing, openCreate, openEdit, handleSave } =
    useSportFormLogic(createSportMutation.mutate, updateSportMutation.mutate);

  const renderContent = () => {
    if (isLoading) return <div>Cargando deportes...</div>;
    if (isError) return <div>Error al cargar los deportes.</div>;
    
    const sports = pageData?.content || [];

    return <SportCardList sports={sports} onEditSport={openEdit} />;
  };

  return (
    <DashboardLayout
      title="Deportes"
      actionLabel="Nuevo Deporte"
      onAction={openCreate}>
      {/* Search */}
      <div className="mb-4 flex gap-2 flex-wrap items-center">
        <Input
          placeholder="Buscar deporte..."
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
          className="max-w-sm"
        />

        <Popover open={statusOpen} onOpenChange={setStatusOpen}>
          <PopoverTrigger asChild>
            <button
              aria-expanded={statusOpen}
              className="border-input data-placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9"
            >
              <span className="text-sm">Estados</span>
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="p-2 space-y-2">
              {[
                "PUBLISHED",
                "DRAFT",
                "ARCHIVED",
                "SUSPENDED",
              ].map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 rounded">
                  <Checkbox
                    checked={status.includes(s)}
                    onCheckedChange={(c) => setStatus(s, Boolean(c))}
                  />
                  <span className="text-sm">{s}</span>
                </label>
              ))}

              <div className="pt-2 border-t mt-2 flex justify-end">
                <Button size="sm" variant="ghost" onClick={() => setStatusOpen(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Select
          value={isActive || ""}
          onValueChange={(v) => setIsActive(v === "all" ? "" : v)}>
          <SelectTrigger className="w-36">
        <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
        <SelectItem value="all">Todos</SelectItem>
        <SelectItem value="true">Activos</SelectItem>
        <SelectItem value="false">Inactivos</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" onClick={clearFilters}>
          Limpiar filtros
        </Button>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
        Total: {pageData?.totalElements ?? 0}
          </span>
          <Select
        value={String(limit)}
        onValueChange={(v) => setLimit(Number(v))}>
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5 / pág</SelectItem>
          <SelectItem value="10">10 / pág</SelectItem>
          <SelectItem value="20">20 / pág</SelectItem>
        </SelectContent>
          </Select>
        </div>
      </div>

      {renderContent()}

      {/* Pagination */}
      <div className="fixed bottom-0 left-64 right-0 flex justify-between items-center border-t pt-4 pb-4 bg-background z-10 px-6">
        <PaginationPrevious
          onClick={() => setPage(Math.max(1, page - 1))}
          className={page === 1 ? "opacity-50 pointer-events-none" : ""}
        />

        <div className="flex items-center gap-2">
          <Pagination className="mt-0">
        <span className="text-sm">
          Página {page} / {pageData?.totalPages ?? 1}
        </span>
          </Pagination>
        </div>

        <PaginationNext onClick={() =>
          setPage(Math.min(pageData?.totalPages ?? 1, page + 1))
          }
          className={
        page >= (pageData?.totalPages ?? 1)
          ? "opacity-50 pointer-events-none"
          : ""
          }
        />
      </div>

      <SportFormDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        sportToEdit={editing}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </DashboardLayout>
  );
};
