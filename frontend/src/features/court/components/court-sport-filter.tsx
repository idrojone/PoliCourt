import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterIcon } from "lucide-react";
import { useSportsSlugQuery } from "@/features/sport/queries/useSportsSlugQuery";

interface CourtSportFilterProps {
    selected: string[];
    onToggle: (slug: string, checked: boolean) => void;
}

export const CourtSportFilter = ({ selected, onToggle }: CourtSportFilterProps) => {
    const [open, setOpen] = useState(false);
    const { data: sportsSlugs, isLoading } = useSportsSlugQuery();

    const sports: { slug: string; name: string }[] = Array.isArray(sportsSlugs) ? sportsSlugs : [];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    aria-expanded={open}
                    className="border-input data-placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9"
                >
                    <FilterIcon size={14} className="mr-1" />
                    <span className="text-sm">Deportes {selected.length > 0 && `(${selected.length})`}</span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
                <div className="p-2 space-y-2">
                    {isLoading && (
                        <span className="text-sm text-muted-foreground">Cargando...</span>
                    )}

                    {!isLoading && sports.length === 0 && (
                        <span className="text-sm text-muted-foreground">Sin deportes</span>
                    )}

                    {sports.map((sport) => (
                        <label key={sport.slug} className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 rounded">
                            <Checkbox
                                checked={selected.includes(sport.slug)}
                                onCheckedChange={(c) => onToggle(sport.slug, Boolean(c))}
                            />
                            <span className="text-sm">{sport.name}</span>
                        </label>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
};
