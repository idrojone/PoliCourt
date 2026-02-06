import { DashboardLayout } from "@/layout/dashboard";
import { useCreateCourtMutation } from "@/features/court/mutations/useCourtCreateMutation";
import { useCourtUpdateMutation } from "@/features/court/mutations/useCourtUpdateMutation";
import { useCourtFormLogic } from "@/features/court/hooks/useCourtFormLogic";
import { CourtCardList } from "@/features/court/components/court-card-list";
import { CourtFormDialog } from "@/features/court/components/court-form-dialog";
import { useCourtToggleActiveMutation } from "@/features/court/mutations/useCourtToggleActiveMutation";
import { useCourtUpdateStatusMutation } from "@/features/court/mutations/useCourtUpdateStatusMutation";
import { toast } from "sonner";
import type { Court } from "@/features/types/court/Court";
import type { GeneralStatusType } from "@/types";
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
import { useCourtsState } from "@/features/court/hooks/useCourtsState";
import { useCourtsPageQuery } from "@/features/court/queries/useCourtsPageQuery";

interface PageData {
  content: any[]; // Consider typing properly as Court[]
  totalPages: number;
  totalElements: number;
}

export const DashboardCourt = () => {
  const {
    name,
    setName,
    locationDetails,
    setLocationDetails,
    price_h,
    setPriceH,
    capacity,
    setCapacity,
    isIndoor,
    setIsIndoor,
    surface,
    setSurface,
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
  } = useCourtsState();

  const { data, isLoading, isError } = useCourtsPageQuery(apiParams);
  const pageData = data as PageData;

  const createCourtMutation = useCreateCourtMutation();
  const updateCourtMutation = useCourtUpdateMutation();
  const toggleActiveMutation = useCourtToggleActiveMutation();
  const updateStatusMutation = useCourtUpdateStatusMutation();

  const isMutating =
    createCourtMutation.isPending ||
    updateCourtMutation.isPending ||
    toggleActiveMutation.isPending ||
    updateStatusMutation.isPending;

  const { isOpen, setIsOpen, editing, openCreate, openEdit, handleSave } =
    useCourtFormLogic(createCourtMutation.mutate, updateCourtMutation.mutate);

  const handleToggleActive = (court: Court) => {
    toast.promise(toggleActiveMutation.mutateAsync(court.slug), {
      loading: "Cambiando visibilidad...",
      success: `Visibilidad de "${court.name}" actualizada.`,
      error: "Error al cambiar la visibilidad.",
    });
  };

  const handleStatusChange = (slug: string, status: GeneralStatusType) => {
    toast.promise(updateStatusMutation.mutateAsync({ slug, status }), {
      loading: "Actualizando estado...",
      success: `Estado de la pista actualizado a ${status}.`,
      error: "Error al actualizar el estado.",
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return <div>Cargando pistas...</div>;
    }

    if (isError) {
      return <div>Error al cargar las pistas.</div>;
    }

    const courts = pageData?.content || [];

    return (
      <CourtCardList
        courts={courts}
        isPending={isMutating}
        openEdit={openEdit}
        toggleActive={handleToggleActive}
        handleStatusChange={handleStatusChange}
      />
    );
  };

  return (
    <DashboardLayout
      title="Pistas"
      actionLabel="Nueva Pista"
      onAction={openCreate}
    >
      {/* Filters */}
      <div className="mb-4 flex gap-2 flex-wrap items-center">
        <Input
          placeholder="Nombre"
          value={name || ""}
          onChange={(e) => setName(e.target.value)}
          className="max-w-sm"
        />

        <Input
          placeholder="Ubicación"
          value={locationDetails || ""}
          onChange={(e) => setLocationDetails(e.target.value)}
          className="max-w-sm"
        />

        <Input
          type="number"
          placeholder="Precio / h"
          value={price_h ?? ""}
          onChange={(e) => setPriceH(e.target.value ? Number(e.target.value) : null)}
          className="w-40"
        />

        <Input
          type="number"
          placeholder="Capacidad"
          value={capacity ?? ""}
          onChange={(e) => setCapacity(Number(e.target.value || 0))}
          className="w-36"
        />

        <Select value={isIndoor || ""} onValueChange={(v) => setIsIndoor(v === "all" ? "" : v)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Interior" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">Interior</SelectItem>
            <SelectItem value="false">Exterior</SelectItem>
          </SelectContent>
        </Select>

        <Select value={surface || ""} onValueChange={(v) => setSurface(v === "all" ? "" : v)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Superficie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="HARD">HARD</SelectItem>
            <SelectItem value="CLAY">CLAY</SelectItem>
            <SelectItem value="GRASS">GRASS</SelectItem>
            <SelectItem value="SYNTHETIC">SYNTHETIC</SelectItem>
            <SelectItem value="WOOD">WOOD</SelectItem>
            <SelectItem value="OTHER">OTHER</SelectItem>
          </SelectContent>
        </Select>

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
            <SelectItem value="DELETED">DELETED</SelectItem>
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

        <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 / pág</SelectItem>
            <SelectItem value="10">10 / pág</SelectItem>
            <SelectItem value="20">20 / pág</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" onClick={clearFilters}>
          Limpiar filtros
        </Button>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Total: {pageData?.totalElements ?? 0}</span>
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

        <PaginationNext
          onClick={() => setPage(Math.min(pageData?.totalPages ?? 1, page + 1))}
          className={
            page >= (pageData?.totalPages ?? 1) ? "opacity-50 pointer-events-none" : ""
          }
        />
      </div>

      <CourtFormDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        courtToEdit={editing}
        onSave={handleSave}
        isSaving={createCourtMutation.isPending || updateCourtMutation.isPending}
      />
    </DashboardLayout>
  );
};
