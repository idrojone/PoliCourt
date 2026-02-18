import type { Court } from "@/features/types/court/Court";
import { useCourtToggleActiveMutation } from "../mutations/useCourtToggleActiveMutation";
import { useCourtUpdateStatusMutation } from "../mutations/useCourtUpdateStatusMutation";
import { GeneralStatus, type GeneralStatusType } from "@/types";
import { PencilIcon, MapPin, Users, DollarSign, Layers, Warehouse } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

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

interface CourtCardProps {
    court: Court;
    onEdit: (court: Court) => void;
}

export const CourtCardAdmin: React.FC<CourtCardProps> = ({ court, onEdit }) => {
    const toggleActiveMutation = useCourtToggleActiveMutation();
    const updateStatusMutation = useCourtUpdateStatusMutation();

    const handleToggleActive = () => {
        toggleActiveMutation.mutate({ slug: court.slug, isActive: court.isActive });
    };

    const handleStatusChange = (status: GeneralStatusType) => {
        updateStatusMutation.mutate({ slug: court.slug, status });
    };

    const isMutationPending =
        toggleActiveMutation.isPending || updateStatusMutation.isPending;

    return (
        <div
            className={`relative group overflow-hidden border rounded-lg p-4 flex flex-col gap-4 bg-card text-card-foreground shadow-sm transition-all h-full`}
        >
            <div className="flex gap-4 items-start">
                <div className="w-24 h-24 shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center border">
                    {court.imgUrl ? (
                        <img
                            src={court.imgUrl}
                            alt={court.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-xs text-muted-foreground text-center px-1">Sin imagen</span>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-lg truncate pr-2" title={court.name}>{court.name}</h3>
                        <Switch
                            checked={court.isActive}
                            onCheckedChange={handleToggleActive}
                            disabled={isMutationPending}
                            title={court.isActive ? "Desactivar" : "Activar"}
                        />
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                        <MapPin size={14} className="shrink-0" />
                        <span className="truncate" title={court.locationDetails || "Sin ubicación"}>
                            {court.locationDetails || "Sin ubicación"}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                        {court.sports?.map(s => (
                            <Badge key={s.slug} variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                                {s.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm pt-2 border-t border-border/50">
                <div className="flex items-center gap-2">
                    <DollarSign size={14} className="text-muted-foreground" />
                    <span className="font-medium">{court.priceH}€ / h</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users size={14} className="text-muted-foreground" />
                    <span>Capacidad: {court.capacity}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Layers size={14} className="text-muted-foreground" />
                    <span className="capitalize">{court.surface.toLowerCase()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Warehouse size={14} className="text-muted-foreground" />
                    <span>{court.isIndoor ? "Interior" : "Exterior"}</span>
                </div>
            </div>

            <div
                className="flex justify-between items-center mt-auto pt-2"
                onPointerDown={(e) => e.stopPropagation()}
            >
                <Select
                    defaultValue={court.status}
                    onValueChange={handleStatusChange}
                    disabled={isMutationPending}
                >
                    <SelectTrigger
                        className={cn(
                            "w-28 h-8 text-xs font-medium border",
                            getStatusStyles(court.status),
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
                    onClick={() => onEdit(court)}
                    className="h-8 px-2"
                >
                    <PencilIcon size={14} className="mr-1" />
                    Editar
                </Button>
            </div>
        </div>
    );
};
