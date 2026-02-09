import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users } from "lucide-react";
import { useCourtsState } from "@/features/court/hooks/useCourtsState";
import { useCourtsPageQuery } from "@/features/court/queries/useCourtsPageQuery";
import { CourtPagination } from "./court-pagination";
import type { Court } from "@/features/types/court/Court";

export const CourtListSection = () => {
  const { apiParams, page, setPage } = useCourtsState();

  const { data, isLoading, isError } = useCourtsPageQuery(apiParams);

  const courts = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Cargando pistas...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive">Error al cargar las pistas. Intentá nuevamente.</p>
      </div>
    );
  }

  return (
    <section id="pistas-grid" className="py-8">
      <div className="container mx-auto px-4">
        {courts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No se encontraron pistas con esos filtros.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courts.map((court: Court) => (
              <Card
                key={court.slug}
                className="bg-card border-border overflow-hidden group hover:border-primary/50 transition-colors h-full flex flex-col rounded-lg p-0">
                <div className="relative aspect-4/3 overflow-hidden rounded-t-lg">
                  <img
                    src={court.imgUrl}
                    alt={court.name}
                    className="w-full h-full object-cover block rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge
                    className={`absolute top-4 left-4 py-1 px-2 rounded-full text-xs ${court.isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {court.isActive ? "Disponible" : "No disponible"}
                  </Badge>
                </div>
                <CardContent className="p-4 pt-3 flex-1 flex flex-col min-h-0">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {court.sportsAvailable.map((s) => s.name).join(", ")}
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-1 flex items-center gap-2">
                    {court.name}
                    {court.surface && (
                      <Badge variant="outline" className="text-xs">
                        {court.surface}
                      </Badge>
                    )}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {court.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {court.priceH}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {court.capacity ? `${court.capacity} pers.` : "—"}
                    </span>
                  </div>

                  <div className="mt-auto flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-md"
                      disabled={!court.isActive}
                      // onClick={() => handleBookCourt(court)}
                    >
                      Reservar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* <div className="mt-8">
          <CourtPagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div> */}
      </div>
    </section>
  );
};
