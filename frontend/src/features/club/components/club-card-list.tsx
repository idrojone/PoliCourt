import type { Club } from "@/features/types/club/Club";
import { ClubCardAdmin } from "./club-card-admin";

interface ClubCardListProps {
    clubs: Club[];
    onEditClub: (club: Club) => void;
}

export const ClubCardList: React.FC<ClubCardListProps> = ({ clubs, onEditClub }) => {
    if (clubs.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                No hay clubes que coincidan con los filtros.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubs.map((club) => (
                <ClubCardAdmin
                    key={club.slug}
                    club={club}
                    onEdit={onEditClub}
                />
            ))}
        </div>
    );
};
