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
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";


interface PageData {
  content: any[]; // Deberías tipar esto según tu modelo de deporte
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

        <Select
          value={status || ""}
          onValueChange={(v) => setStatus(v === "all" ? "" : v)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
            <SelectItem value="DRAFT">DRAFT</SelectItem>
            <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
            <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
          </SelectContent>
        </Select>

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

        <div className="ml-auto">
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
        <Pagination className="mt-4 flex items-center gap-2">
          <PaginationPrevious
            onClick={() => setPage(Math.max(1, page - 1))}
            className={page === 1 ? "opacity-50 pointer-events-none" : ""}
          />

          <div className="px-2">
            Página {page} / {pageData?.totalPages ?? 1}
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            Total: {pageData?.totalElements ?? 0}
          </div>

          <PaginationNext
            onClick={() =>
              setPage(Math.min(pageData?.totalPages ?? 1, page + 1))
            }
            className={
              page >= (pageData?.totalPages ?? 1)
                ? "opacity-50 pointer-events-none"
                : ""
            }
          />
        </Pagination>
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
