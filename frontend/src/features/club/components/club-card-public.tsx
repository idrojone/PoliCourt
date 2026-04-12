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
        <Card className="glass-card h-full flex flex-col gap-0 overflow-hidden border-white/10 bg-card/70 py-0 transition-all hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(8,12,24,0.6)]">
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
                <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="border-white/20 bg-background/80 text-foreground backdrop-blur-sm capitalize">
                        {club.sportSlug}
                    </Badge>
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,13,24,0),rgba(9,13,24,0.7))]" />
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
                <Button
                    asChild
                    className="w-full group bg-[linear-gradient(135deg,#7dd3fc_0%,#4fd1ff_45%,#5eead4_100%)] text-[#001f2e] shadow-[0_0_20px_rgba(125,211,252,0.25)]"
                    variant="default"
                >
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
