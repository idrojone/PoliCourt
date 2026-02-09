import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useCourtsState } from "@/features/court/hooks/useCourtsState";
import { useCourtsMaxMinPriceCapacity } from "@/features/court/queries/useCourtsMaxMinPriceCapacity";
import { useSportsSlugQuery } from "@/features/sport/queries/useSportsSlugQuery";
import { ChevronDown } from "lucide-react";

export const CourtPageFilters = () => {
  const {
    priceMin,
    priceMax,
    setPriceRange,
    capacityMin,
    capacityMax,
    setCapacityRange,
    isIndoor,
    setIsIndoor,
    surface,
    setSurface,
    sports,
    setSports,
    limit,
    setLimit,
    clearFilters,
  } = useCourtsState();

  const { data } = useCourtsMaxMinPriceCapacity();
  const { data: sportsSlugs } = useSportsSlugQuery();

  const dataPriceMin = data?.min_price ?? 0;
  const dataPriceMax = data?.max_price ?? 5000;
  const dataCapacityMin = data?.min_capacity ?? 0;
  const dataCapacityMax = data?.max_capacity ?? 500;

  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
    priceMin ?? dataPriceMin,
    priceMax ?? dataPriceMax,
  ]);
  const [localCapacityRange, setLocalCapacityRange] = useState<[number, number]>([
    capacityMin ?? dataCapacityMin,
    capacityMax ?? dataCapacityMax,
  ]);

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

  const [surfaceOpen, setSurfaceOpen] = useState(false);
  const [sportsOpen, setSportsOpen] = useState(false);

  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold">Filtrar Pistas</h3>
        {/* <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-7 px-2 text-xs">
          Limpiar
        </Button> */}
      </div>

      <div className="flex items-center gap-4 flex-wrap w-full">
        {/* Precio */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium">Precio/h</span>
            <span className="text-xs text-muted-foreground">
              ${localPriceRange[0]} - ${localPriceRange[1]}
            </span>
          </div>
          <div className="w-56 md:w-72 lg:w-80">
            <Slider
              min={dataPriceMin}
              max={dataPriceMax}
              step={5}
              value={localPriceRange}
              onValueChange={(v) =>
                setLocalPriceRange([v[0] as number, v[1] as number])
              }
              onValueCommit={(v) => setPriceRange(Number(v[0]), Number(v[1]))}
              className="w-full py-1"
            />
          </div>
        </div>

        {/* Capacidad */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium">Capacidad</span>
            <span className="text-xs text-muted-foreground">
              {localCapacityRange[0]} - {localCapacityRange[1]} pers.
            </span>
          </div>
          <div className="w-48 md:w-64 lg:w-72">
            <Slider
              min={dataCapacityMin}
              max={dataCapacityMax}
              step={1}
              value={localCapacityRange}
              onValueChange={(v) =>
                setLocalCapacityRange([v[0] as number, v[1] as number])
              }
              onValueCommit={(v) =>
                setCapacityRange(Number(v[0]), Number(v[1]))
              }
              className="w-full py-1"
            />
          </div>
        </div>

        {/* Filtros adicionales */}
        <div className="flex items-center gap-2">
          <Select
            value={isIndoor || ""}
            onValueChange={(v) => setIsIndoor(v === "all" ? "" : v)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Interior/Exterior" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="true">Interior</SelectItem>
              <SelectItem value="false">Exterior</SelectItem>
            </SelectContent>
          </Select>

          <Popover open={surfaceOpen} onOpenChange={setSurfaceOpen}>
            <PopoverTrigger asChild>
              <button className="border-input flex items-center justify-between rounded-md border bg-transparent px-3 py-1.5 text-xs h-8">
                <span className="mr-1">Superficie</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="start">
              <div className="space-y-1">
                {["HARD", "CLAY", "GRASS", "SYNTHETIC", "WOOD", "OTHER"].map(
                  (s) => (
                    <label
                      key={s}
                      className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 rounded text-xs">
                      <Checkbox
                        checked={surface.includes(s)}
                        onCheckedChange={(c) => setSurface(s, Boolean(c))}
                        className="h-3 w-3"
                      />
                      <span>{s}</span>
                    </label>
                  ),
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={sportsOpen} onOpenChange={setSportsOpen}>
            <PopoverTrigger asChild>
              <button className="border-input flex items-center justify-between rounded-md border bg-transparent px-3 py-1.5 text-xs h-8">
                <span className="mr-1">Deportes</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="start">
              <div className="space-y-1 max-h-48 overflow-auto">
                {(sportsSlugs || []).map((s: any) => (
                  <label
                    key={s}
                    className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 rounded text-xs">
                    <Checkbox
                      checked={(Array.isArray(sports) ? sports : []).includes(
                        s,
                      )}
                      onCheckedChange={(c) => setSports(s, Boolean(c))}
                      className="h-3 w-3"
                    />
                    <span className="truncate">{s}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
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

          {/* <Button
            size="sm"
            className="h-8 px-3 text-xs"
            onClick={() => {
              setPriceRange(localPriceRange[0], localPriceRange[1]);
              setCapacityRange(localCapacityRange[0], localCapacityRange[1]);
            }}>
            Aplicar
          </Button> */}
        </div>
      </div>
    </div>
  );
};
