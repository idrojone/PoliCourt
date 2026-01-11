import React from "react";
import { type Sport, SportCard } from "./SportCard";

export const SportsGrid: React.FC<{ deportes: Sport[] }> = ({ deportes }) => {
  return (
    <section className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Deportes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {deportes.map((d) => (
          <SportCard key={d.id} sport={d} />
        ))}
      </div>
    </section>
  );
};

export default SportsGrid;
