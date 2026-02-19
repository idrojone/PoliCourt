import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { ClubSportFilter } from "./club-sport-filter";

interface ClubFiltersPublicProps {
    qInput: string;
    setQInput: (v: string) => void;

    sports: string[];
    setSports: (value: string, checked: boolean) => void;

    clearFilters: () => void;
}

export const ClubFiltersPublic = ({
    qInput,
    setQInput,
    sports,
    setSports,
    clearFilters,
}: ClubFiltersPublicProps) => {
    return (
        <div className="mb-8 flex gap-3 flex-wrap items-center bg-card p-4 rounded-lg border shadow-sm">
            {/* Search */}
            <div className="relative max-w-sm w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar club..."
                    value={qInput}
                    onChange={(e) => setQInput(e.target.value)}
                    className="pl-9 w-full md:w-[300px]"
                />
            </div>

            <div className="h-8 w-[1px] bg-border mx-1 hidden md:block" />

            {/* Sport Filter */}
            <ClubSportFilter selected={sports} onToggle={setSports} />

            {(qInput || sports.length > 0) && (
                <Button variant="ghost" onClick={clearFilters} className="ml-auto h-8 px-2 lg:px-3 text-muted-foreground hover:text-foreground">
                    Limpiar filtros
                    <X className="ml-2 h-4 w-4" />
                </Button>
            )}
        </div>
    );
};
