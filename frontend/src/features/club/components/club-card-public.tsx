import type { Club } from "@/features/types/club/Club";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Trophy, ArrowRight, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

interface ClubCardPublicProps {
    club: Club;
}

export const ClubCardPublic: React.FC<ClubCardPublicProps> = ({ club }) => {
    return (
        <Card className="h-full flex flex-col gap-0 py-0 overflow-hidden transition-all hover:shadow-md border-border/50">
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {club.imgUrl ? (
                    <img
                        src={club.imgUrl}
                        alt={club.name}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                        <span className="text-sm">Sin imagen</span>
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm border-white/20 capitalize">
                        {club.sportSlug}
                    </Badge>
                </div>
            </div>

            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-lg line-clamp-1" title={club.name}>
                        {club.name}
                    </h3>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-2 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {club.description || "Sin descripción disponible."}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Trophy size={14} className="text-primary" />
                    <span className="capitalize">{club.sportSlug} Club</span>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 mt-auto">
                <Button asChild className="w-full group" variant="default">
                    <Link to={`/clubs/${club.slug}`}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Inscribirse
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};
