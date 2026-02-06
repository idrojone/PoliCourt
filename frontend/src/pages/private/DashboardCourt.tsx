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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { getCourts } from "@/features/court/service/court.sp.service";
import {
  Pagination,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { useCourtsState } from "@/features/court/hooks/useCourtsState";
import { useCourtsPageQuery } from "@/features/court/queries/useCourtsPageQuery";
import { useState, useEffect } from "react";

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
    priceMin,
    setPriceMin,
    priceMax,
    setPriceMax,
    capacityMin,
    setCapacityMin,
    capacityMax,
    setCapacityMax,
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

  const [surfaceOpen, setSurfaceOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  // Local slider state for smooth dragging
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([priceMin ?? 0, priceMax ?? 5000]);
  const [localCapacityRange, setLocalCapacityRange] = useState<[number, number]>([capacityMin ?? 0, capacityMax ?? 500]);

  // Data-driven min/max (from all courts)
  const [dataPriceMin, setDataPriceMin] = useState<number | null>(null);
  const [dataPriceMax, setDataPriceMax] = useState<number | null>(null);
  const [dataCapacityMin, setDataCapacityMin] = useState<number | null>(null);
  const [dataCapacityMax, setDataCapacityMax] = useState<number | null>(null);

  // Update local sliders when external filters change or data min/max load
  useEffect(() => {
    const min = dataPriceMin ?? 0;
    const max = dataPriceMax ?? 5000;
    setLocalPriceRange([priceMin ?? min, priceMax ?? max]);
  }, [priceMin, priceMax, dataPriceMin, dataPriceMax]);

  useEffect(() => {
    const min = dataCapacityMin ?? 0;
    const max = dataCapacityMax ?? 500;
    setLocalCapacityRange([capacityMin ?? min, capacityMax ?? max]);
  }, [capacityMin, capacityMax, dataCapacityMin, dataCapacityMax]);

  // Fetch courts once to compute data min/max for sliders
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const all = await getCourts();
        if (!mounted || !Array.isArray(all) || all.length === 0) return;
        const prices = all.map((c) => Number(c.priceH ?? 0)).filter(Number.isFinite);
        const caps = all.map((c) => Number(c.capacity ?? 0)).filter(Number.isFinite);
        const pMin = prices.length ? Math.min(...prices) : 0;
        const pMax = prices.length ? Math.max(...prices) : 5000;
        const cMin = caps.length ? Math.min(...caps) : 0;
        const cMax = caps.length ? Math.max(...caps) : 500;
        setDataPriceMin(pMin);
        setDataPriceMax(pMax);
        setDataCapacityMin(cMin);
        setDataCapacityMax(cMax);
        // initialize local ranges when no filters present
        if (priceMin == null && priceMax == null) setLocalPriceRange([pMin, pMax]);
        if (capacityMin == null && capacityMax == null) setLocalCapacityRange([cMin, cMax]);
      } catch (e) {
        console.error("Failed to compute min/max for courts", e);
      }
    })();
    return () => { mounted = false };
  }, []);

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
          className="w-48"
        />

        <Input
          placeholder="Ubicación"
          value={locationDetails || ""}
          onChange={(e) => setLocationDetails(e.target.value)}
          className="w-48"
        />

        <div className="w-72">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Precio / h</div>
            <div className="text-sm text-muted-foreground">${localPriceRange[0]} - ${localPriceRange[1]}</div>
          </div>
          <Slider
            min={dataPriceMin ?? 0}
            max={dataPriceMax ?? 5000}
            step={5}
            value={localPriceRange}
            onValueChange={(v) => setLocalPriceRange([v[0] as number, v[1] as number])}
            onValueCommit={(v) => {
              setPriceMin(Number(v[0]));
              setPriceMax(Number(v[1]));
            }}
          />
        </div>

        <div className="w-56">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Capacidad</div>
            <div className="text-sm text-muted-foreground">{localCapacityRange[0]} - {localCapacityRange[1]} pers.</div>
          </div>
          <Slider
            min={dataCapacityMin ?? 0}
            max={dataCapacityMax ?? 500}
            step={1}
            value={localCapacityRange}
            onValueChange={(v) => setLocalCapacityRange([v[0] as number, v[1] as number])}
            onValueCommit={(v) => {
              setCapacityMin(Number(v[0]));
              setCapacityMax(Number(v[1]));
            }}
          />
        </div>

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

        <Popover open={surfaceOpen} onOpenChange={setSurfaceOpen}>
          <PopoverTrigger asChild>
            <button className="border-input flex items-center gap-2 rounded-md border bg-transparent px-3 py-2 text-sm h-9">
              Superficie
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="p-2 space-y-2">
              {[
                "HARD",
                "CLAY",
                "GRASS",
                "SYNTHETIC",
                "WOOD",
                "OTHER",
              ].map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 rounded">
                  <Checkbox checked={surface.includes(s)} onCheckedChange={(c) => setSurface(s, Boolean(c))} />
                  <span className="text-sm">{s}</span>
                </label>
              ))}
              <div className="pt-2 border-t mt-2 flex justify-end">
                <Button size="sm" variant="ghost" onClick={() => setSurfaceOpen(false)}>Cerrar</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={statusOpen} onOpenChange={setStatusOpen}>
          <PopoverTrigger asChild>
            <button className="border-input flex items-center gap-2 rounded-md border bg-transparent px-3 py-2 text-sm h-9">Estados</button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="p-2 space-y-2">
              {[
                "PUBLISHED",
                "DRAFT",
                "ARCHIVED",
                "DELETED",
              ].map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 rounded">
                  <Checkbox checked={status.includes(s)} onCheckedChange={(c) => setStatus(s, Boolean(c))} />
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
