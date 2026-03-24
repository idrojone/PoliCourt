import type { UserRentalRecord } from "@/features/types/bookings/UserRentals";

interface ProfileRentalsProps {
  rentals: UserRentalRecord[];
  isLoading: boolean;
  isError: boolean;
}

export const ProfileRentals = ({ rentals, isLoading, isError }: ProfileRentalsProps) => {
  return (
    <section className="mt-6 rounded-2xl border  p-5 shadow-sm">
      <div className="mb-4 border-b  pb-3 ">
        <h2 className="text-lg font-bold ">Historial de reservas</h2>
        <p className="text-sm">Todas las reservas del usuario en un solo vistazo.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10 text-slate-500">Cargando reservas...</div>
      ) : isError ? (
        <div className="text-center py-10 text-rose-500">No se pudieron cargar las reservas.</div>
      ) : rentals.length === 0 ? (
        <div className="text-center py-10 text-slate-500">No hay reservas para este usuario.</div>
      ) : (
        <div className="space-y-4">
          {rentals.map((rental) => (
            <article key={rental.booking.uuid} className="rounded-xl border  bg-background p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase ">{rental.ticket.code}</span>
                <span className="inline-flex items-center rounded-full  px-2 py-1 text-xs ">{rental.booking.status}</span>
              </div>
              <p className="text-sm font-semibold">{rental.booking.title || rental.booking.court?.name || "Reserva de pista"}</p>
              <p className="text-sm ">Pista: {rental.booking.court?.name ?? "N/A"}</p>
              <p className="text-sm ">Inicio: {new Date(rental.booking.startTime).toLocaleString("es-ES")}</p>
              <p className="text-sm ">Fin: {new Date(rental.booking.endTime).toLocaleString("es-ES")}</p>
              <p className="text-sm ">Total: {rental.booking.totalPrice?.toLocaleString("es-ES", { style: "currency", currency: "EUR" }) ?? "N/A"}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
