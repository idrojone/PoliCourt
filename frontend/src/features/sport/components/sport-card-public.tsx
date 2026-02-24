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
        <Card className="h-full flex flex-col gap-0 py-0 overflow-hidden transition-all hover:shadow-md border-border/50 group">
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
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="secondary" size="sm" asChild className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
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

            <CardFooter className="p-4 pt-0 mt-auto border-t border-border/50 bg-muted/20">
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
