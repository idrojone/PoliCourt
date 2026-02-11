import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useBookingsState } from "@/features/booking/hooks/useBookingsState";

export const BookingFilters = () => {
  const {
    qInput,
    setQInput,
    courtSlug,
    setCourtSlug,
    organizerUsername,
    setOrganizerUsername,
    status,
    setStatus,
    isActive,
    setIsActive,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    limit,
    setLimit,
    clearFilters,
  } = useBookingsState();

  return (
    <div className="mb-4 flex gap-2 flex-wrap items-center">
      <Input
        placeholder="Buscar..."
        value={qInput}
        onChange={(e) => setQInput(e.target.value)}
        className="w-48"
      />

      <Input
        placeholder="Pista (slug)"
        value={courtSlug || ""}
        onChange={(e) => setCourtSlug(e.target.value)}
        className="w-40"
      />

      <Input
        placeholder="Organizador"
        value={organizerUsername || ""}
        onChange={(e) => setOrganizerUsername(e.target.value)}
        className="w-40"
      />

      <Select
        value={status || ""}
        onValueChange={(v) => setStatus(v === "all" ? "" : v)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="CONFIRMED">Confirmado</SelectItem>
          <SelectItem value="PENDING">Pendiente</SelectItem>
          <SelectItem value="CANCELLED">Cancelado</SelectItem>
          <SelectItem value="COMPLETED">Completado</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={isActive || ""}
        onValueChange={(v) => setIsActive(v === "all" ? "" : v)}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Activo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="true">Activos</SelectItem>
          <SelectItem value="false">Inactivos</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="datetime-local"
        placeholder="Desde"
        title="Fecha inicio"
        value={startTime || ""}
        onChange={(e) => setStartTime(e.target.value)}
        className="w-48"
      />

      <Input
        type="datetime-local"
        placeholder="Hasta"
        title="Fecha fin"
        value={endTime || ""}
        onChange={(e) => setEndTime(e.target.value)}
        className="w-48"
      />

      <Input
        type="number"
        placeholder="Precio mín"
        min={0}
        step={0.01}
        value={minPrice ?? ""}
        onChange={(e) =>
          setMinPrice(e.target.value !== "" ? Number(e.target.value) : null)
        }
        className="w-32"
      />

      <Input
        type="number"
        placeholder="Precio máx"
        min={0}
        step={0.01}
        value={maxPrice ?? ""}
        onChange={(e) =>
          setMaxPrice(e.target.value !== "" ? Number(e.target.value) : null)
        }
        className="w-32"
      />

      <Select
        value={String(limit)}
        onValueChange={(v) => setLimit(Number(v))}
      >
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
    </div>
  );
};
