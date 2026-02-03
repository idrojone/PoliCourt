import type { Sport } from "@/features/types/sport/Sport";
import { SportCard } from "./sport-card";

interface SportsListProps {
  sports: Sport[];
}

export const SportsList: React.FC<SportsListProps> = ({ sports }) => {
  if (!sports || sports.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No se encontraron deportes.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {sports.map((sport) => (
        <SportCard key={sport.slug} sport={sport} />
      ))}
    </div>
  );
};
