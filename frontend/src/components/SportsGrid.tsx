import React from "react";
import { type Sport, SportCard } from "./SportCard";

export const SportsGrid: React.FC<{ deportes: Sport[] }> = ({ deportes }) => {
  return (
    <section className="mt-8 mx-auto px-4 sm:px-6 max-w-6xl">
      <div>
        <hr className="mb-4 border-gray-200 dark:border-gray-700" />
        <h2 className="text-4xl font-semibold mb-10 text-center">Deportes Disponibles</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {deportes.map((d) => (
          <SportCard key={d.id} sport={d} />
        ))}
      </div>
    </section>
  );
};

export default SportsGrid;
