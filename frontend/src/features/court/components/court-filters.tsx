import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useCourtsState } from "@/features/court/hooks/useCourtsState";
import { useCourtsMaxMinPriceCapacity } from "@/features/court/queries/useCourtsMaxMinPriceCapacity";
import { useSportsSlugQuery } from "@/features/sport/queries/useSportsSlugQuery";

export const CourtFilters = () => {
    const {
        name,
        setName,
        locationDetails,
        setLocationDetails,
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
        status,
        setStatus,
        sports,
        setSports,
        isActive,
        setIsActive,
        limit,
        setLimit,
        clearFilters,
    } = useCourtsState();

    const { data } = useCourtsMaxMinPriceCapacity();

    const { data: sportsSlugs } = useSportsSlugQuery();

    const [sportsOpen, setSportsOpen] = useState(false);

    const dataPriceMin = data?.min_price ?? 0;
    const dataPriceMax = data?.max_price ?? 5000;
    const dataCapacityMin = data?.min_capacity ?? 0;
    const dataCapacityMax = data?.max_capacity ?? 500;

    const [surfaceOpen, setSurfaceOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);

    const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([priceMin ?? dataPriceMin, priceMax ?? dataPriceMax]);
    const [localCapacityRange, setLocalCapacityRange] = useState<[number, number]>([capacityMin ?? dataCapacityMin, capacityMax ?? dataCapacityMax]);

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

    return (
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
                setPriceRange(Number(v[0]), Number(v[1]));
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
                setCapacityRange(Number(v[0]), Number(v[1]));
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

        <Popover open={sportsOpen} onOpenChange={setSportsOpen}>
            <PopoverTrigger asChild>
            <button className="border-input flex items-center gap-2 rounded-md border bg-transparent px-3 py-2 text-sm h-9">Deportes</button>
            </PopoverTrigger>
            <PopoverContent>
            <div className="p-2 space-y-2 max-h-64 overflow-auto">
                {(sportsSlugs || []).map((s: any) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 rounded">
                    <Checkbox checked={(Array.isArray(sports) ? sports : []).includes(s)} onCheckedChange={(c) => setSports(s, Boolean(c))} />
                    <span className="text-sm">{s}</span>
                </label>
                ))}

                <div className="pt-2 border-t mt-2 flex justify-end">
                <Button size="sm" variant="ghost" onClick={() => setSportsOpen(false)}>Cerrar</Button>
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
            {/* total count se muestra en Dashboard */}
        </div>
        </div>
    );
};
