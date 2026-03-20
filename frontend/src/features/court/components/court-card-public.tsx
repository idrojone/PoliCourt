import type { Court } from "@/features/types/court/Court";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MapPin, Users, Info } from "lucide-react";
import { BookingFlowDialog } from "@/features/bookings/components/booking-flow-dialog";
import type { Sport } from "@/features/types/sport/Sport";

interface CourtCardPublicProps {
    court: Court;
}

const toReadableSportName = (slug: string) => {
    if (!slug) {
        return "Deporte";
    }
    const normalized = slug.replace(/[-_]+/g, " ").trim();
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

export const CourtCardPublic: React.FC<CourtCardPublicProps> = ({ court }) => {
    const sportBadges = ((court.sports ?? []) as Array<string | Sport>).map((sport) => {
        if (typeof sport === "string") {
            return {
                slug: sport,
                name: toReadableSportName(sport),
            };
        }

        return {
            slug: sport.slug,
            name: sport.name || toReadableSportName(sport.slug),
        };
    });

    return (
        <Card className="h-full flex flex-col gap-0 py-0 overflow-hidden transition-all hover:shadow-md border-border/50">
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {court.imgUrl ? (
                    <img
                        src={court.imgUrl}
                        alt={court.name}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                        <span className="text-sm">Sin imagen</span>
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm border-white/20">
                        {court.priceH}€ / h
                    </Badge>
                </div>
            </div>

            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-lg line-clamp-1" title={court.name}>
                        {court.name}
                    </h3>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin size={14} className="shrink-0" />
                    <span className="line-clamp-1">{court.locationDetails || "Ubicación no disponible"}</span>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-2 grow">
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {sportBadges.slice(0, 3).map((sport) => (
                        <Badge key={sport.slug} variant="outline" className="text-[10px] px-2 h-5 font-normal">
                            {sport.name}
                        </Badge>
                    ))}
                    {sportBadges.length > 3 && (
                        <Badge variant="outline" className="text-[10px] px-2 h-5 font-normal text-muted-foreground">
                            +{sportBadges.length - 3}
                        </Badge>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Users size={14} />
                        <span>Capacidad: {court.capacity}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Info size={14} />
                        <span className="capitalize">{court.surface.toLowerCase()}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 mt-auto">
                <div className="flex w-full flex-col gap-2">
                    <BookingFlowDialog court={court} triggerClassName="w-full" triggerLabel="Reservar" />
                </div>
            </CardFooter>
        </Card>
    );
};
