import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Court } from "@/features/types/court/Court";
import type { GeneralStatusType } from "@/types";
import {
  Cloud,
  DollarSign,
  Edit,
  MapPin,
  Sun,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useSportsAllQuery } from "@/features/sport/queries/useSportsAllQuery";
import type { Sport } from "@/features/types/sport/Sport";

interface CourtCardAdminProps {
  court: Court;
  isOverlay?: boolean;
  toggleMutationPending: boolean;
  openEdit: (court: Court) => void;
  toggleActive: (court: Court) => void;
  handleStatusChange: (slug: string, status: GeneralStatusType) => void;
}

const getStatusColor = (status: GeneralStatusType) => {
  switch (status) {
    case "PUBLISHED":
      return "text-green-600 border-green-200 bg-green-50";
    case "DRAFT":
      return "text-yellow-600 border-yellow-200 bg-yellow-50";
    case "ARCHIVED":
      return "text-gray-600 border-gray-200 bg-gray-50";
    case "SUSPENDED":
      return "text-red-600 border-red-200 bg-red-50";
    default:
      return "text-gray-500 border-gray-200";
  }
};

export const CourtCardAdmin = ({
  court,
  isOverlay,
  toggleMutationPending,
  openEdit,
  toggleActive,
  handleStatusChange,
}: CourtCardAdminProps) => {
  const [imgError, setImgError] = useState(false);
  const { data: allSports } = useSportsAllQuery();

  const sportsForThisCourt =
    court.sportsAvailable
      ?.map((slug) => allSports?.find((s: Sport) => s.slug === slug))
      .filter(Boolean) ?? [];

  return (
    <Card
      className={`relative group overflow-hidden transition-all h-full flex flex-col ${
        isOverlay
          ? "shadow-2xl scale-105 rotate-2 cursor-grabbing"
          : "hover:shadow-md"
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              {court.name}
              {court.status === "DRAFT" && (
                <Badge variant="outline" className="text-xs">
                  Borrador
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center text-xs text-muted-foreground gap-1">
              <MapPin size={12} />
              {court.location || "Sin ubicación"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={court.isActive}
              onCheckedChange={() => toggleActive(court)}
              disabled={toggleMutationPending}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="w-full h-40 overflow-hidden rounded-md bg-muted">
          {court.imgUrl && !imgError ? (
            <img
              src={court.imgUrl}
              alt={court.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              Sin imagen
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 p-2 bg-secondary/20 rounded-md">
            <Users size={16} className="text-primary" />
            <span>{court.capacity} pers.</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-secondary/20 rounded-md">
            <DollarSign size={16} className="text-green-600" />
            <span>{court.priceH} €/h</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-secondary/20 rounded-md col-span-2">
            {court.isIndoor ? (
              <Cloud size={16} className="text-blue-500" />
            ) : (
              <Sun size={16} className="text-orange-500" />
            )}
            <span>{court.isIndoor ? "Indoor" : "Outdoor"}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="secondary">{court.surface}</Badge>
          <div className="flex -space-x-2">
            {sportsForThisCourt.slice(0, 3).map((s: Sport) => (
              <div
                key={s.slug}
                className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center overflow-hidden"
                title={s.name}
              >
                {s.imgUrl ? (
                  <img
                    src={s.imgUrl}
                    alt={s.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Trophy size={12} />
                )}
              </div>
            ))}
            {sportsForThisCourt.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold">
                +{sportsForThisCourt.length - 3}
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center mt-auto">
          <div onPointerDown={(e) => e.stopPropagation()}>
            <Select
              defaultValue={court.status}
              onValueChange={(value) =>
                handleStatusChange(court.slug, value as GeneralStatusType)
              }
              disabled={toggleMutationPending}
            >
              <SelectTrigger
                className={`w-27.5 h-8 text-xs font-medium border ${getStatusColor(
                  court.status,
                )}`}
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Borrador</SelectItem>
                <SelectItem value="PUBLISHED">Publicado</SelectItem>
                <SelectItem value="ARCHIVED">Archivado</SelectItem>
                <SelectItem value="SUSPENDED">Suspendido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEdit(court)}
            className="h-8"
          >
            <Edit size={14} className="mr-1" />
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
