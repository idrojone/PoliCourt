import { useState } from "react";
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
import { FilterIcon } from "lucide-react";
import type { GeneralStatusType } from "@/types";

interface SportFiltersBarProps {
    qInput: string;
    setQInput: (v: string) => void;

    status: string[];
    setStatus: (value: string, checked: boolean) => void;

    isActive: string;
    setIsActive: (v: string) => void;

    limit: number;
    setLimit: (v: number) => void;
    totalElements: number;

    clearFilters: () => void;
}

const STATUS_OPTIONS: GeneralStatusType[] = [
    "PUBLISHED",
    "DRAFT",
    "ARCHIVED",
    "SUSPENDED",
];

export const SportFiltersBar = ({
    qInput,
    setQInput,
    status,
    setStatus,
    isActive,
    setIsActive,
    limit,
    setLimit,
    totalElements,
    clearFilters,
}: SportFiltersBarProps) => {
    const [statusOpen, setStatusOpen] = useState(false);

    return (
        <div className="mb-4 flex gap-2 flex-wrap items-center">
            {/* Search */}
            <Input
                placeholder="Buscar deporte..."
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
                className="max-w-sm"
            />

            {/* Status Filter */}
            <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                <PopoverTrigger asChild>
                    <button
                        aria-expanded={statusOpen}
                        className="border-input data-placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9"
                    >
                        <FilterIcon size={14} className="mr-1" />
                        <span className="text-sm">Estados {status.length > 0 && `(${status.length})`}</span>
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-48">
                    <div className="p-2 space-y-2">
                        {STATUS_OPTIONS.map((s) => (
                            <label key={s} className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 rounded">
                                <Checkbox
                                    checked={status.includes(s)}
                                    onCheckedChange={(c) => setStatus(s, Boolean(c))}
                                />
                                <span className="text-sm">{s}</span>
                            </label>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>

            {/* Active Filter */}
            <Select
                value={isActive || "all"}
                onValueChange={(v) => setIsActive(v === "all" ? "" : v)}>
                <SelectTrigger className="w-36 h-9">
                    <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="true">Activos</SelectItem>
                    <SelectItem value="false">Inactivos</SelectItem>
                </SelectContent>
            </Select>

            <Button variant="ghost" onClick={clearFilters} size="sm">
                Limpiar filtros
            </Button>

            {/* Right-aligned: total + page-size */}
            <div className="ml-auto flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                    Total: {totalElements}
                </span>
                <Select
                    value={String(limit)}
                    onValueChange={(v) => setLimit(Number(v))}>
                    <SelectTrigger className="w-24 h-9">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5 / pág</SelectItem>
                        <SelectItem value="10">10 / pág</SelectItem>
                        <SelectItem value="20">20 / pág</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
