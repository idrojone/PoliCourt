import type { Sport } from "@/features/types/sport/Sport";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface SportCardPublicProps {
    sport: Sport;
}

export const SportCardPublic: React.FC<SportCardPublicProps> = ({ sport }) => {
    return (
        <Card className="glass-card group h-full flex flex-col gap-0 overflow-hidden border-white/10 bg-card/70 py-0 transition-all hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(8,12,24,0.6)]">
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {sport.imgUrl ? (
                    <img
                        src={sport.imgUrl}
                        alt={sport.name}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                        <span className="text-sm">Sin imagen</span>
                    </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Button variant="secondary" size="sm" asChild className="translate-y-4 border-white/20 bg-card/70 text-foreground backdrop-blur-xl transition-transform duration-300 group-hover:translate-y-0">
                        <Link to={`/pistas?sports=${sport.slug}`}>Ver Detalles</Link>
                    </Button>
                </div>
            </div>

            <CardHeader className="p-4 pb-2">
                <h3 className="font-bold text-lg line-clamp-1" title={sport.name}>
                    {sport.name}
                </h3>
            </CardHeader>

            <CardContent className="p-4 pt-2 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {sport.description || "Sin descripción disponible."}
                </p>
            </CardContent>

            <CardFooter className="p-4 pt-0 mt-auto border-t border-white/10 bg-muted/10">
                <Link
                    to={`/pistas?sports=${sport.slug}`}
                    className="w-full flex items-center justify-between text-sm font-medium text-primary hover:text-primary/80 py-3"
                >
                    <span>Explorar {sport.name}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </CardFooter>
        </Card>
    );
};
