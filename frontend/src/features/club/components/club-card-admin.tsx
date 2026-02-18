import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Club } from "@/features/types/club/Club";
import type { ClubStatus } from "@/features/types/club/Club";
import { PencilIcon, MapPin } from "lucide-react";
import { useClubToggleActiveMutation } from "../mutations/useClubToggleActiveMutation";
import { useUpdateClubStatusMutation } from "../mutations/useUpdateClubStatusMutation";
import { cn } from "@/lib/utils";
import { useSportSlugsQuery } from "@/features/sport/queries/useSportSlugsQuery";

interface ClubCardAdminProps {
    club: Club;
    onEdit: (club: Club) => void;
}

const getStatusStyles = (status: string) => {
    switch (status) {
        case "PUBLISHED":
            return "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 border-emerald-200/50";
        case "DRAFT":
            return "bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 border-amber-200/50";
        case "ARCHIVED":
        case "SUSPENDED":
            return "bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 border-rose-200/50";
        default:
            return "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200/50";
    }
};

export const ClubCardAdmin: React.FC<ClubCardAdminProps> = ({
    club,
    onEdit,
}) => {
    const toggleActiveMutation = useClubToggleActiveMutation();
    const statusMutation = useUpdateClubStatusMutation();

    const handleToggleActive = () => {
        toggleActiveMutation.mutate({ slug: club.slug, isActive: club.isActive });
    };

    const handleStatusChange = (status: ClubStatus) => {
        statusMutation.mutate({ slug: club.slug, status });
    };

    const isMutationPending = toggleActiveMutation.isPending || statusMutation.isPending;

    const { data: sportsSlugs } = useSportSlugsQuery();
    const sportName = sportsSlugs?.find((s) => s.slug === club.sportSlug)?.name || club.sportSlug;

    return (
        <div
            className={`relative group overflow-hidden border rounded-lg p-4 flex flex-col gap-4 bg-card text-card-foreground shadow-sm transition-all h-full`}
        >
            <div className="flex gap-4 items-start">
                <div className="w-24 h-24 shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center border">
                    {club.imgUrl ? (
                        <img
                            src={club.imgUrl}
                            alt={club.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-xs text-muted-foreground text-center px-1">Sin imagen</span>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-lg truncate pr-2" title={club.name}>{club.name}</h3>
                        <Switch
                            checked={club.isActive}
                            onCheckedChange={handleToggleActive}
                            disabled={isMutationPending}
                            title={club.isActive ? "Desactivar" : "Activar"}
                        />
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px] mb-2">
                        {club.description || "Sin descripción"}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {club.sportSlug && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                                {sportName}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            <div
                className="flex justify-between items-center mt-auto pt-4 border-t border-border/50"
                onPointerDown={(e) => e.stopPropagation()}
            >
                <Select
                    defaultValue={club.status}
                    onValueChange={handleStatusChange}
                    disabled={isMutationPending}
                >
                    <SelectTrigger
                        className={cn(
                            "w-28 h-8 text-xs font-medium border",
                            getStatusStyles(club.status),
                        )}
                    >
                        <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
                        <SelectItem value="DRAFT">DRAFT</SelectItem>
                        <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
                        <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(club)}
                    className="h-8 px-2"
                >
                    <PencilIcon size={14} className="mr-1" />
                    Editar
                </Button>
            </div>
        </div>
    );
};
