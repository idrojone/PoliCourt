import type { Court } from "@/features/types/court/Court";
import { CourtCardAdmin } from "./court-card-admin";

interface CourtCardListProps {
    courts: Court[];
    onEditCourt: (court: Court) => void;
}

export const CourtCardList: React.FC<CourtCardListProps> = ({
    courts,
    onEditCourt,
}) => {
    if (!courts || courts.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">No se encontraron pistas.</p>
                <p className="text-sm text-muted-foreground">
                    Crea una nueva pista para comenzar.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {courts.map((court) => (
                <CourtCardAdmin key={court.slug} court={court} onEdit={onEditCourt} />
            ))}
        </div>
    );
};
