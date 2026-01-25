import type { Sport } from "@/features/types/sport/Sport";
import { SportCard } from "./sport-card-admin";

interface SportCardListProps {
  sports: Sport[];
  onEditSport: (sport: Sport) => void;
}

export const SportCardList: React.FC<SportCardListProps> = ({
  sports,
  onEditSport,
}) => {
  if (!sports || sports.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No se encontraron deportes.</p>
        <p className="text-sm text-muted-foreground">
          Crea un nuevo deporte para comenzar.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {sports.map((sport) => (
        <SportCard key={sport.slug} sport={sport} onEdit={onEditSport} />
      ))}
    </div>
  );
};
