
import { BookingModal } from "@/features/bookings/components/booking-modal";
import { CourtCard } from "@/features/court/components/court-card";
import { CourtFilters } from "@/features/court/components/court-filtres";
import type { Court } from "@/features/court/types";
import { MainLayout } from "@/layout/main";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { useAllSportsQuery } from "@/features/sport/queries/queries";

import { useCourtData } from "@/features/court/hooks/useCourtData";
import { Pagination } from "@/components/Pagination";
import { HeaderPage } from "@/components/header-page";


export const CourtPage = () => {

  const { courts, page, setPage, totalPages} = useCourtData();

  const { data: sportsResponse } = useAllSportsQuery(1, 100);
  const sports = sportsResponse?.data || [];

  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [selectedSurface, setSelectedSurface] = useState<string>("all");
  const [isIndoorFilter, setIsIndoorFilter] = useState<string>("all");
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const filteredCourts = courts.filter((court: Court) => {
    const c = court as any;
    if (selectedSport !== "all" && (!c.sports || !c.sports.some((s: any) => s.id === selectedSport)))
      return false;
    if (selectedSurface !== "all" && court.surface !== selectedSurface)
      return false;
    if (isIndoorFilter !== "all") {
      if (isIndoorFilter === "indoor" && !court.is_indoor) return false;
      if (isIndoorFilter === "outdoor" && court.is_indoor) return false;
    }
    return true;
  });

  const surfaces = [...new Set(courts.map((c: Court) => c.surface).filter((s: any): s is string => !!s))];

    const handleBookCourt = (court: Court) => { 
      setSelectedCourt(court); 
      setIsBookingModalOpen(true);
    };

  return (
    <MainLayout>
      <HeaderPage title="Nuestras Instalaciones" description="Descubre todas nuestras pistas disponibles y reserva la que mejor se adapte a tus necesidades deportivas." />

      <CourtFilters sports={sports} surfaces={surfaces} selectedSport={selectedSport} selectedSurface={selectedSurface} isIndoorFilter={isIndoorFilter} onSportChange={setSelectedSport} onSurfaceChange={setSelectedSurface} onIndoorChange={setIsIndoorFilter}/>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              {filteredCourts.length}
            </span>{" "}
            {filteredCourts.length === 1
              ? "pista encontrada"
              : "pistas encontradas"}
          </p>
        </div>

        {filteredCourts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourts.map((court: Court) => (
              <CourtCard
                key={court.id}
                court={court}
                onBook={handleBookCourt}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">
              No hay pistas disponibles
            </h3>
            <p className="mt-2 text-muted-foreground">
              Prueba a cambiar los filtros para ver más opciones.
            </p>
          </div>
        )}
        <div className="mt-8 flex justify-center">
          <Pagination className="w-full bg-background" page={page} totalPages={totalPages} onPageChange={setPage}/>
        </div>
      </main>
      <BookingModal court={selectedCourt} isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)}/>
    </MainLayout>
  );
};