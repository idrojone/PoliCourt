import React from "react";
import { Button } from "@/components/ui/button";

export type Sport = {
  slug: string;
  name: string;
  description: string;
  image: string;
};

export const SportCard: React.FC<{ sport: Sport }> = ({ sport }) => {
  console.log("Rendering SportCard for:", sport.image);
  return (
    <article className="rounded-lg border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="h-40 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
        <img
          src={sport.image || "/src/assets/boxeo.svg"}
          alt={sport.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start gap-4">
          <h3 className="text-lg font-semibold leading-snug">{sport.name}</h3>
        </div> 

        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
          {sport.description}
        </p>
      </div>

      <div className="p-4 pt-0 flex items-center justify-end">
        <Button variant="outline" size="sm">Ver pistas</Button>
      </div>
    </article>
  );
};

export default SportCard;
