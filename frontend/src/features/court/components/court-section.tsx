import type { Court } from "@/features/types/court/Court";
import type { Sport } from "@/features/types/sport/Sport";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

export function CourtsSection({ courts, sports }: { courts: Court[]; sports: Sport[]; }) {

  return (
    <section id="pistas" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              Instalaciones
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Reserva tu Pista
            </h2>
          </div>
          <Link
            to="/pistas"
            className="text-primary hover:underline flex items-center gap-1 mt-4 md:mt-0">
            Ver todas las pistas <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <Carousel
          className=" items-stretch"
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}>
          <CarouselContent>
            {courts.map((court: Court) => {
              console.log(court);
              const image = court.imgUrl;
              const isActive = court.isActive;
              const price = `${court.priceH} €/h`;
              const location = court.location;
              const capacity = court.capacity ?? "";
              const sportLabel = court.sportsAvailable
                ? court.sportsAvailable.map((s) => s.name).join(", ")
                : "";
              const surface = court.surface ?? "";

              return (
                <CarouselItem
                  key={court.slug}
                  className="md:basis-1/2 lg:basis-1/3">
                  <Card
                    key={court.slug}
                    className="bg-card border-border overflow-hidden group hover:border-primary/50 transition-colors h-full flex flex-col rounded-lg p-0">
                    <div className="relative aspect-4/3 overflow-hidden rounded-t-lg">
                      <img
                        src={image}
                        alt={court.name}
                        className="w-full h-full object-cover block rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge
                        className={`absolute top-4 left-4 py-1 px-2 rounded-full text-xs ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {isActive ? "Disponible" : "No disponible"}
                      </Badge>
                    </div>
                    <CardContent className="p-4 pt-3 flex-1 flex flex-col min-h-0">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        {sportLabel}
                      </div>
                      <h3 className="font-semibold text-foreground text-lg mb-1 flex items-center gap-2">
                        {court.name}
                        {surface && (
                          <Badge variant="outline" className="text-xs">
                            {surface}
                          </Badge>
                        )}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {price}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {capacity ? `${capacity} pers.` : "—"}
                        </span>
                      </div>

                      <div className="mt-auto flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-md"
                          disabled={!isActive}
                          // onClick={() => handleBookCourt(court)}
                        >
                          Reservar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
