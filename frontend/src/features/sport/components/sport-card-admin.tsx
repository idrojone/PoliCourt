import type { Sport } from "@/features/types/sport/Sport";
import { useSportToggleActiveMutation } from "../mutations/useSportToggleActiveMutation";
import { useSportUpdateStatusMutation } from "../mutations/useSportUpdateStatusMutation";
import { GeneralStatus, type GeneralStatusType } from "@/types";
import { PencilIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const getStatusStyles = (status: string) => {
    switch (status) {
        case "PUBLISHED":
        case "ACTIVE":
            return "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 border-emerald-200/50";
        case "DRAFT":
        case "INACTIVE":
            return "bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 border-amber-200/50";
        case "ARCHIVED":
        case "DELETED":
            return "bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 border-rose-200/50";
        default:
            return "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200/50";
    }
};

interface SportCardProps {
    sport: Sport;
    onEdit: (sport: Sport) => void;
}

export const SportCard: React.FC<SportCardProps> = ({ sport, onEdit }) => {
    const toggleActiveMutation = useSportToggleActiveMutation();
    const updateStatusMutation = useSportUpdateStatusMutation();

    const handleToggleActive = () => {
        toggleActiveMutation.mutate({ slug: sport.slug, isActive: sport.isActive });
    };

    const handleStatusChange = (status: GeneralStatusType) => {
        updateStatusMutation.mutate({ slug: sport.slug, status });
    };

    const isMutationPending =
        toggleActiveMutation.isPending || updateStatusMutation.isPending;

    return (
        <div
            className={`relative group overflow-hidden border rounded-lg p-4 flex gap-4 items-start bg-card text-card-foreground shadow-sm transition-all`}
        >
            <div className="w-24 h-24 shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center border">
                {sport.imgUrl ? (
                    <img
                        src={sport.imgUrl}
                        alt={sport.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-xs text-muted-foreground">Sin imagen</span>
                )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between h-24">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg truncate pr-2">{sport.name}</h3>
                        <Switch
                            checked={sport.isActive}
                            onCheckedChange={handleToggleActive}
                            disabled={isMutationPending}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                        {sport.description || "Sin descripción"}
                    </p>
                </div>

                <div
                    className="flex justify-between items-center mt-2"
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <Select
                        defaultValue={sport.status}
                        onValueChange={handleStatusChange}
                        disabled={isMutationPending}
                    >
                        <SelectTrigger
                            className={cn(
                                "w-27.5 h-7 text-xs font-medium border",
                                getStatusStyles(sport.status),
                            )}
                        >
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(GeneralStatus).map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(sport)}
                        className="h-7 px-2"
                    >
                        <PencilIcon size={14} className="mr-1" />
                        Editar
                    </Button>
                </div>
            </div>
        </div>
    );
};
