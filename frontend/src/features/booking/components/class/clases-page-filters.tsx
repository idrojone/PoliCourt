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

export const ClasesPageFilters = () => {
  const {
    organizerUsername,
    setOrganizerUsername,
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
    <div className="bg-card border border-border rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold">Filtrar Clases</h3>
      </div>

      <div className="flex items-center gap-4 flex-wrap w-full">
        {/* Organizador */}
        <Input
          placeholder="Monitor"
          value={organizerUsername || ""}
          onChange={(e) => setOrganizerUsername(e.target.value)}
          className="h-8 text-xs w-44"
        />

        {/* Rango de fechas */}
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium whitespace-nowrap">Desde</span>
          <Input
            type="datetime-local"
            value={startTime || ""}
            onChange={(e) => setStartTime(e.target.value)}
            className="h-8 text-xs w-44"
          />
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs font-medium whitespace-nowrap">Hasta</span>
          <Input
            type="datetime-local"
            value={endTime || ""}
            onChange={(e) => setEndTime(e.target.value)}
            className="h-8 text-xs w-44"
          />
        </div>

        {/* Rango de precio */}
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium whitespace-nowrap">Precio</span>
          <Input
            type="number"
            placeholder="Mín"
            min={0}
            step={0.01}
            value={minPrice ?? ""}
            onChange={(e) =>
              setMinPrice(e.target.value !== "" ? Number(e.target.value) : null)
            }
            className="h-8 text-xs w-24"
          />
          <span className="text-xs text-muted-foreground">–</span>
          <Input
            type="number"
            placeholder="Máx"
            min={0}
            step={0.01}
            value={maxPrice ?? ""}
            onChange={(e) =>
              setMaxPrice(e.target.value !== "" ? Number(e.target.value) : null)
            }
            className="h-8 text-xs w-24"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="w-28">
            <Select
              value={String(limit)}
              onValueChange={(v) => setLimit(Number(v))}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Mostrar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 / pág</SelectItem>
                <SelectItem value="10">10 / pág</SelectItem>
                <SelectItem value="20">20 / pág</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 px-2 text-xs">
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  );
};
