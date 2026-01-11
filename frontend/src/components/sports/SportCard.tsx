import React from "react";
import { Button } from "@/components/ui/button";

export type Sport = {
  id: number;
  nombre: string;
  tipo: string;
  jugadores_por_equipo: number | null;
  olímpico: boolean;
  descripcion: string;
};

export const SportCard: React.FC<{ sport: Sport }> = ({ sport }) => {
  return (
    <article className="rounded-lg border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Imagen / placeholder */}
      <div className="h-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          {/* Dejá el hueco para la imagen, la agregás después */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12 text-gray-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <rect x="3" y="3" width="18" height="14" rx="2" />
            <path d="M3 17l4-4 4 4 4-4 6 6" />
          </svg>
          <div className="mt-2">Imagen (placeholder)</div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold leading-snug">{sport.nombre}</h3>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              sport.olímpico
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                : "bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-300"
            }`}
          >
            {sport.olímpico ? "Olímpico" : "No olímpico"}
          </span>
        </div>

        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{sport.descripcion}</p>
      </div>

      {/* Footer */}
      <div className="p-4 pt-0 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {sport.jugadores_por_equipo ? `${sport.jugadores_por_equipo} jugadores` : "Individual / Varios"}
        </div>
        <Button variant="outline" size="sm">Ver pistas</Button>
      </div>
    </article>
  );
};

export default SportCard;
