import type { Sport } from "@/features/types/sport/Sport";
import { SportCardPublic } from "./sport-card-public";

interface SportsGridProps {
    sports: Sport[];
}

export const SportsGrid: React.FC<SportsGridProps> = ({ sports }) => {
    if (!sports || sports.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">No se encontraron deportes disponibles.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sports.map((sport) => (
                <div key={sport.slug} className="h-full">
                    <SportCardPublic sport={sport} />
                </div>
            ))}
        </div>
    );
};
