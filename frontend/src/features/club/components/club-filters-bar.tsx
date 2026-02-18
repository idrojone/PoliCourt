import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { ClubStatus } from "@/features/types/club/Club";
import { ClubSportFilter } from "./club-sport-filter";

interface ClubFiltersBarProps {
    filters: {
        name: string;
        status?: ClubStatus;
        sports: string[];
        isActive?: boolean;
    };
    setFilters: (filters: any) => void;
    totalElements: number;
}

export const ClubFiltersBar: React.FC<ClubFiltersBarProps> = ({
    filters,
    setFilters,
    totalElements,
}) => {
    const handleIsActiveChange = (value: string) => {
        if (value === "all") {
            setFilters({ isActive: undefined });
        } else {
            setFilters({ isActive: value === "true" });
        }
    };

    const handleSportsToggle = (slug: string, checked: boolean) => {
        const currentSports = filters.sports || [];
        let newSports;
        if (checked) {
            newSports = [...currentSports, slug];
        } else {
            newSports = currentSports.filter((s) => s !== slug);
        }
        setFilters({ sports: newSports });
    };

    return (
        <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-wrap items-center gap-2">
                <Input
                    placeholder="Buscar clubes..."
                    value={filters.name}
                    onChange={(e) => setFilters({ name: e.target.value })}
                    className="max-w-xs"
                />

                <Select
                    value={filters.status || "ALL"}
                    onValueChange={(val) =>
                        setFilters({ status: val === "ALL" ? undefined : val })
                    }
                >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Estado: Todos</SelectItem>
                        <SelectItem value="PUBLISHED">Publicado</SelectItem>
                        <SelectItem value="DRAFT">Borrador</SelectItem>
                        <SelectItem value="ARCHIVED">Archivado</SelectItem>
                        <SelectItem value="SUSPENDED">Suspendido</SelectItem>
                    </SelectContent>
                </Select>

                <ClubSportFilter
                    selected={filters.sports}
                    onToggle={handleSportsToggle}
                />

                <Select
                    value={filters.isActive === undefined ? "all" : String(filters.isActive)}
                    onValueChange={handleIsActiveChange}
                >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Activo?" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Activo: Todos</SelectItem>
                        <SelectItem value="true">Activos</SelectItem>
                        <SelectItem value="false">Inactivos</SelectItem>
                    </SelectContent>
                </Select>

                <div className="ml-auto text-sm text-muted-foreground">
                    Total: {totalElements}
                </div>
            </div>
        </div>
    );
};
