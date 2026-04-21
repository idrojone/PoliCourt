import { CalendarClock } from "lucide-react";
import { formatTimeRange } from "@/lib";
import type { BookingResponse } from "@/features/types/bookings/BookingRecord";
import { Button } from "@/components/ui/button";

interface ProfileClassEnrollmentsProps {
  enrollments: BookingResponse[];
  isLoading: boolean;
  isError: boolean;
}

export const ProfileClassEnrollments = ({
  enrollments,
  isLoading,
  isError,
}: ProfileClassEnrollmentsProps) => {
  return (
    <section className="mt-6 rounded-3xl border border-cyan-300/30 bg-white/80 p-6 text-slate-900 shadow-[0_20px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-cyan-400/20 dark:bg-slate-950/70 dark:text-white dark:shadow-[0_0_35px_rgba(56,189,248,0.15)]">
      <div className="mb-5 border-b border-slate-200/80 pb-4 dark:border-white/10">
        <h2 className="text-lg font-black">Clases inscritas</h2>
        <p className="text-sm text-slate-600 dark:text-slate-200/70">Tus inscripciones pagadas y confirmadas.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10 text-slate-600 dark:text-slate-200/70">Cargando clases inscritas...</div>
      ) : isError ? (
        <div className="py-10 text-center text-rose-600 dark:text-rose-200">No se pudieron cargar las clases inscritas.</div>
      ) : enrollments.length === 0 ? (
        <div className="py-10 text-center text-slate-600 dark:text-slate-200/70">Aún no estás inscrito en ninguna clase.</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {enrollments.map((enrollment) => (
            <article
              key={enrollment.uuid}
              className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 text-slate-900 shadow-sm transition hover:border-cyan-300/60 hover:bg-white dark:border-cyan-400/15 dark:bg-slate-950/60 dark:text-white dark:shadow-none dark:hover:border-cyan-300/40 dark:hover:bg-slate-950/70"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="inline-flex rounded-full border border-cyan-300/50 bg-cyan-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-800 dark:border-cyan-300/30 dark:bg-cyan-300/10 dark:text-cyan-100">
                  Clase inscrita
                </span>
                <span className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{enrollment.status}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {enrollment.title || enrollment.court?.name || "Clase sin título"}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-200/80">
                {enrollment.description || "-"}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-700 dark:text-slate-200/80">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-cyan-700 dark:text-cyan-100" />
                  {enrollment.startTime && enrollment.endTime
                    ? formatTimeRange(enrollment.startTime, enrollment.endTime)
                    : "Horario no disponible"}
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {enrollment.attendeePrice != null ? `${enrollment.attendeePrice} €` : "-"}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
