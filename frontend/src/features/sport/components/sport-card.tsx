import type { Sport } from "@/features/types/sport/Sport";
import { Link } from "react-router-dom";

interface SportCardProps {
  sport: Sport;
}

export const SportCard: React.FC<SportCardProps> = ({ sport }) => {
  return (
    <Link to={`/sports/${sport.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
        <div className="aspect-4/3 w-full overflow-hidden bg-muted">
          {sport.imgUrl ? (
            <img
              src={sport.imgUrl}
              alt={sport.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-xs text-muted-foreground">Sin imagen</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg">{sport.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 h-[2.5em]">
            {sport.description || "Sin descripción"}
          </p>
        </div>
      </div>
    </Link>
  );
};
