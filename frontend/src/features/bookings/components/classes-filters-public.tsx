import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useSportSlugsQuery } from "@/features/sport/queries/useSportSlugsQuery";
import { useCourtsPageQuery } from "@/features/court/queries/useCourtsPageQuery.fa";

interface Props {
    qInput: string;
    setQInput: (v: string) => void;
    sportSlug: string;
    setSportSlug: (v: string | null) => void;
    courtSlug: string;
    setCourtSlug: (v: string | null) => void;
    organizerInput: string;
    setOrganizerInput: (v: string) => void;
    clearFilters: () => void;
}

export const ClassesFiltersPublic: React.FC<Props> = ({
    qInput,
    setQInput,
    sportSlug,
    setSportSlug,
    courtSlug,
    setCourtSlug,
    organizerInput,
    setOrganizerInput,
    clearFilters,
}) => {
    const { data: sports = [] } = useSportSlugsQuery();
    const { data: courtsPage } = useCourtsPageQuery({ limit: 100 });

    return (
        <div className="mb-8 flex gap-3 flex-wrap items-center bg-card p-4 rounded-lg border shadow-sm">
            <div className="relative max-w-sm w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar clases..."
                    value={qInput}
                    onChange={(e) => setQInput(e.target.value)}
                    className="pl-9 w-full md:w-[300px]"
                />
            </div>

            <Select value={sportSlug || "ALL"} onValueChange={(val) => setSportSlug(val === "ALL" ? null : val)}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Deporte" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">Todos los deportes</SelectItem>
                    {Array.isArray(sports) && sports.map((s) => (
                        <SelectItem key={s.slug} value={s.slug}>{s.name || s.slug}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={courtSlug || "ALL"} onValueChange={(val) => setCourtSlug(val === "ALL" ? null : val)}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Pista" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">Todas las pistas</SelectItem>
                    {(courtsPage?.content || []).map((c: any) => (
                        <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className="relative max-w-sm w-full md:w-auto">
                <Input
                    placeholder="Organizador (username)"
                    value={organizerInput}
                    onChange={(e) => setOrganizerInput(e.target.value)}
                    className="w-full md:w-[220px]"
                />
            </div>

            <div className="ml-auto">
                <Button variant="ghost" onClick={clearFilters} className="h-8 px-3 text-muted-foreground hover:text-foreground">
                    Limpiar filtros
                    <X className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default ClassesFiltersPublic;
