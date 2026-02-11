import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  DollarSign,
  GraduationCap,
  MapPin,
  User,
  Users,
} from "lucide-react";
import { useBookingsState } from "@/features/booking/hooks/useBookingsState";
import { useClassesPageQuery } from "@/features/booking/queries/useClassesPageQuery";
import { BookingPagination } from "../booking-pagination";
import type { Booking } from "@/features/types/booking";
import { formatDateTime } from "@/lib/dateTime";
import { BookingCardSkeleton } from "../shared";

export const ClasesListSection = () => {
  const { apiParams, page, setPage } = useBookingsState();

  const { data, isLoading, isError } = useClassesPageQuery(apiParams);

  const classes = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <BookingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive">
          Error al cargar las clases. Inténtalo nuevamente.
        </p>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No se encontraron clases con esos filtros.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls: Booking) => {
          const start = formatDateTime(cls.startTime);
          const end = formatDateTime(cls.endTime);

          return (
            <Card
              key={cls.slug}
              className="bg-card border-border overflow-hidden group hover:border-primary/50 transition-colors h-full flex flex-col rounded-lg p-0"
            >
              {/* Cabecera con badge */}
              <div className="px-4 pt-4 pb-2 flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-purple-500" />
                    {cls.title || "Clase"}
                  </h3>
                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <MapPin className="w-3 h-3" />
                    {cls.courtSlug}
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800 text-xs"
                >
                  <GraduationCap className="w-3 h-3 mr-1" />
                  Clase
                </Badge>
              </div>

              <CardContent className="p-4 pt-0 flex-1 flex flex-col gap-3 min-h-0">
                {/* Descripción */}
                {cls.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {cls.description}
                  </p>
                )}

                {/* Fecha y hora */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{start.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      {start.time} – {end.time}
                    </span>
                  </div>
                </div>

                {/* Monitor */}
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-purple-500" />
                  <span className="truncate" title={cls.organizerUsername}>
                    {cls.organizerUsername}
                  </span>
                </div>

                {/* Precios */}

                <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950 rounded-md border border-green-200 dark:border-green-800">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">
                    {(cls.attendeePrice ?? 0) > 0
                      ? `${cls.attendeePrice} € / persona`
                      : "Gratis"}
                  </span>
                </div>


                {/* Asistentes */}
                {cls.attendees && cls.attendees.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{cls.attendees.length} asistente(s)</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8">
        <BookingPagination
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </>
  );
};
