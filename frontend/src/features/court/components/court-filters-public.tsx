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
import { FilterIcon, Search } from "lucide-react";
import { CourtSurface } from "@/features/types/court/Court";
import type { CourtSurfaceType } from "@/features/types/court/Court";
import { CourtSportFilter } from "./court-sport-filter";

interface CourtFiltersPublicProps {
    qInput: string;
    setQInput: (v: string) => void;

    surfaces: CourtSurfaceType[];
    setSurfaces: (value: CourtSurfaceType, checked: boolean) => void;

    sports: string[];
    setSports: (value: string, checked: boolean) => void;

    isIndoorParam: string;
    setIsIndoor: (v: string) => void;

    clearFilters: () => void;
}

export const CourtFiltersPublic = ({
    qInput,
    setQInput,
    surfaces,
    setSurfaces,
    sports,
    setSports,
    isIndoorParam,
    setIsIndoor,
    clearFilters,
}: CourtFiltersPublicProps) => {
    return (
        <div className="mb-8 flex gap-3 flex-wrap items-center bg-card p-4 rounded-lg border shadow-sm">
            {/* Search */}
            <div className="relative max-w-sm w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por nombre o ubicación..."
                    value={qInput}
                    onChange={(e) => setQInput(e.target.value)}
                    className="pl-9 w-full md:w-[300px]"
                />
            </div>

            <div className="h-8 w-[1px] bg-border mx-1 hidden md:block" />

            {/* Surface Filter */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="border-dashed">
                        <FilterIcon size={14} className="mr-2" />
                        Superficie {surfaces.length > 0 && `(${surfaces.length})`}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="start">
                    <div className="p-2 space-y-2">
                        <h4 className="font-medium text-sm mb-2 text-muted-foreground">Tipo de superficie</h4>
                        {Object.values(CourtSurface).map((s) => (
                            <label key={s} className="flex items-center gap-2 cursor-pointer hover:bg-accent p-2 rounded-sm transition-colors">
                                <Checkbox
                                    checked={surfaces.includes(s)}
                                    onCheckedChange={(c) => setSurfaces(s, Boolean(c))}
                                />
                                <span className="text-sm capitalize">{s.toLowerCase()}</span>
                            </label>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>

            {/* Sport Filter */}
            <CourtSportFilter selected={sports} onToggle={setSports} />

            {/* Indoor/Outdoor Filter */}
            <Select
                value={isIndoorParam || "all"}
                onValueChange={(v) => setIsIndoor(v)}>
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Ubicación" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Cualquiera</SelectItem>
                    <SelectItem value="true">Interior / Cubierta</SelectItem>
                    <SelectItem value="false">Exterior / Aire libre</SelectItem>
                </SelectContent>
            </Select>

            {(qInput || surfaces.length > 0 || sports.length > 0 || isIndoorParam !== "all" && isIndoorParam !== "") && (
                <Button variant="ghost" onClick={clearFilters} size="sm" className="ml-auto text-muted-foreground hover:text-foreground">
                    Limpiar filtros
                </Button>
            )}
        </div>
    );
};
