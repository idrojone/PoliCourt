import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Wrench,
  Pencil,
  Trash2,
} from "lucide-react";
import type { Maintenance, MaintenanceStatus } from "@/features/types/maintenance";

interface MaintenanceCardAdminProps {
  maintenance: Maintenance;
  isOverlay?: boolean;
  isPending?: boolean;
  handleStatusChange: (slug: string, status: MaintenanceStatus) => void;
  onEdit?: (maintenance: Maintenance) => void;
  onDelete?: (maintenance: Maintenance) => void;
}

const getStatusColor = (status: MaintenanceStatus) => {
  const colors: Record<MaintenanceStatus, string> = {
    SCHEDULED: "bg-blue-100 text-blue-800 border-blue-300",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800 border-yellow-300",
    COMPLETED: "bg-green-100 text-green-800 border-green-300",
    CANCELLED: "bg-red-100 text-red-800 border-red-300",
  };
  return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
};

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return {
    date: date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

export const MaintenanceCardAdmin = ({
  maintenance,
  isOverlay,
  isPending,
  handleStatusChange,
  onEdit,
  onDelete,
}: MaintenanceCardAdminProps) => {
  const startDateTime = formatDateTime(maintenance.startTime);
  const endDateTime = formatDateTime(maintenance.endTime);

  const isFinalized =
    maintenance.status === "COMPLETED" || maintenance.status === "CANCELLED";

  return (
    <Card
      className={`relative group overflow-hidden transition-all h-full flex flex-col ${
        isOverlay
          ? "shadow-2xl scale-105 rotate-2 cursor-grabbing"
          : "hover:shadow-md"
      } ${!maintenance.isActive ? "opacity-60" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Wrench size={16} className="text-orange-500" />
              {maintenance.title}
            </CardTitle>
            <div className="flex items-center text-xs text-muted-foreground gap-1">
              <MapPin size={12} />
              {maintenance.courtName || maintenance.courtSlug}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onEdit && !isFinalized && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(maintenance)}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <Pencil size={16} />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onDelete(maintenance)}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col">
        {/* Descripción */}
        {maintenance.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {maintenance.description}
          </p>
        )}

        {/* Fecha y hora */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-secondary/20 rounded-md">
            <Calendar size={16} className="text-primary" />
            <span className="text-sm">{startDateTime.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock size={14} className="text-muted-foreground" />
            <span>
              {startDateTime.time} - {endDateTime.time}
            </span>
          </div>
        </div>

        {/* Responsable */}
        <div className="flex items-center gap-2 p-2 bg-secondary/20 rounded-md text-sm">
          <User size={16} className="text-primary" />
          <span className="truncate" title={maintenance.createdByUsername}>
            {maintenance.createdByUsername}
          </span>
        </div>

        {/* Tipo badge */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="flex items-center gap-1 bg-orange-50 border-orange-200 text-orange-700">
            <Wrench size={12} />
            Mantenimiento
          </Badge>
        </div>

        {/* Status selector */}
        <div className="pt-2 flex justify-between items-center mt-auto">
          <div onPointerDown={(e) => e.stopPropagation()}>
            <Select
              defaultValue={maintenance.status}
              onValueChange={(value) =>
                handleStatusChange(maintenance.slug, value as MaintenanceStatus)
              }
              disabled={isPending || isFinalized}
            >
              <SelectTrigger
                className={`w-32 h-8 text-xs font-medium border ${getStatusColor(
                  maintenance.status
                )}`}
              >
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SCHEDULED">Programado</SelectItem>
                <SelectItem value="IN_PROGRESS">En progreso</SelectItem>
                <SelectItem value="COMPLETED">Completado</SelectItem>
                <SelectItem value="CANCELLED">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(maintenance.createdAt).toLocaleDateString("es-ES")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
