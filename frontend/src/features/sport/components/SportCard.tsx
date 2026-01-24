import type { Sport } from "@/features/types/sport";
import { useSportToggleActiveMutation } from "../mutations/useSportToggleActiveMutation";
import { useSportUpdateStatusMutation } from "../mutations/useSportUpdateStatusMutation";
import { GeneralStatus, type GeneralStatusType } from "@/types";
import { PencilIcon, CircleDot } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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

interface SportCardProps {
  sport: Sport;
  onEdit: (sport: Sport) => void;
}

// Función para obtener estilos minimalistas tipo "Badge" según el estado
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

export const SportCard: React.FC<SportCardProps> = ({ sport, onEdit }) => {
  const toggleActiveMutation = useSportToggleActiveMutation();
  const updateStatusMutation = useSportUpdateStatusMutation();

  const handleToggleActive = (isActive: boolean) => {
    toggleActiveMutation.mutate(sport.slug);
  };

  const handleStatusChange = (status: GeneralStatusType) => {
    updateStatusMutation.mutate({ slug: sport.slug, status });
  };

  const isMutationPending =
    toggleActiveMutation.isPending || updateStatusMutation.isPending;

  return (
    <Card className="group relative flex flex-col overflow-hidden border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:border-border">
      {/* SECCIÓN IMAGEN + SWITCH FLOTANTE */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        <img
          src={sport.imgUrl || "https://via.placeholder.com/400x200"}
          alt={sport.name}
          // Se han eliminado las clases de animación CSS (transition, scale, etc.)
          className="h-full w-full object-cover "
        />

        {/* Switch flotante (Minimalista: cápsula con blur) */}
        <div className="absolute top-3 right-3 flex items-center gap-2 rounded-full bg-background/60 p-1 pl-2 pr-1 backdrop-blur-md transition-colors hover:bg-background/80 shadow-sm border border-white/10">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground select-none">
            {sport.isActive ? "On" : "Off"}
          </span>
          <Switch
            id={`active-switch-${sport.slug}`}
            checked={sport.isActive}
            onCheckedChange={handleToggleActive}
            disabled={isMutationPending}
            className="data-[state=checked]:bg-emerald-500 scale-75 origin-right"
            aria-label="Activar o desactivar deporte"
          />
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <CardContent className="flex flex-1 flex-col gap-1.5 p-4 pb-2">
        <CardTitle className="text-lg font-medium leading-tight tracking-tight text-foreground">
          {sport.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm text-muted-foreground/80 leading-relaxed">
          {sport.description}
        </CardDescription>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-4 pt-2">
        {/* Selector de Estado (Estilo Pill/Badge) */}
        <Select
          onValueChange={handleStatusChange}
          defaultValue={sport.status}
          disabled={isMutationPending}
        >
          <SelectTrigger
            id={`status-select-${sport.slug}`}
            className={cn(
              "h-7 w-auto min-w-[90px] gap-2 rounded-full border px-3 text-xs font-medium transition-all focus:ring-0 focus:ring-offset-0",
              getStatusStyles(sport.status),
            )}
          >
            <div className="flex items-center gap-1.5">
              <CircleDot className="h-2 w-2 opacity-60" />{" "}
              {/* Icono pequeño decorativo */}
              <SelectValue placeholder="Estado" />
            </div>
          </SelectTrigger>
          <SelectContent align="start">
            {Object.values(GeneralStatus).map((status) => (
              <SelectItem key={status} value={status} className="text-xs">
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Botón Editar (Ghost para reducir ruido) */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors"
          onClick={() => onEdit(sport)}
          disabled={isMutationPending}
        >
          <PencilIcon className="h-3.5 w-3.5" />
          <span className="sr-only">Editar</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
