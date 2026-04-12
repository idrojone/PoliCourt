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
        <Card className="glass-card h-full flex flex-col gap-0 overflow-hidden border-white/10 bg-card/70 py-0 transition-all hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(8,12,24,0.6)]">
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
                <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="border-white/20 bg-background/80 text-foreground backdrop-blur-sm">
                        {court.priceH}€ / h
                    </Badge>
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,13,24,0),rgba(9,13,24,0.7))]" />
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
                        <Badge key={sport.slug} variant="outline" className="border-white/10 text-[10px] px-2 h-5 font-normal text-foreground/80">
                            {sport.name}
                        </Badge>
                    ))}
                    {sportBadges.length > 3 && (
                        <Badge variant="outline" className="border-white/10 text-[10px] px-2 h-5 font-normal text-muted-foreground">
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
                    <BookingFlowDialog
                        court={court}
                        triggerClassName="w-full bg-[linear-gradient(135deg,#7dd3fc_0%,#4fd1ff_45%,#5eead4_100%)] text-[#001f2e] shadow-[0_0_20px_rgba(125,211,252,0.25)]"
                        triggerLabel="Reservar"
                    />
                </div>
            </CardFooter>
        </Card>
    );
};
