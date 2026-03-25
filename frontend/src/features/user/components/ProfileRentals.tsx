import type { UserRentalRecord } from "@/features/types/bookings/UserRentals";
import { CalendarClock, CircleDollarSign, MapPin, Ticket } from "lucide-react";

interface ProfileRentalsProps {
  rentals: UserRentalRecord[];
  isLoading: boolean;
  isError: boolean;
}

export const ProfileRentals = ({ rentals, isLoading, isError }: ProfileRentalsProps) => {
  const getStatusStyles = (status: string) => {
    const normalized = status.toUpperCase();

    if (normalized.includes("CONFIRMED") || normalized.includes("PAID")) {
      return "border-emerald-300/35 bg-emerald-400/10 text-emerald-200";
    }

    if (normalized.includes("CANCEL") || normalized.includes("REJECT")) {
      return "border-rose-300/35 bg-rose-400/10 text-rose-200";
    }

    if (normalized.includes("PENDING")) {
      return "border-amber-300/35 bg-amber-400/10 text-amber-200";
    }

    return "border-border bg-accent text-accent-foreground";
  };

  const getDisplayStatus = (startTime: string, endTime: string, backendStatus?: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
      if (now < start) return "Próxima";
      if (now > end) return "Finalizada";
      return "En curso";
    }

    if (backendStatus && backendStatus.trim().length > 0) {
      return backendStatus;
    }

    return "Reserva";
  };

  const formatCurrency = (value?: number) => {
    if (typeof value !== "number") return "N/A";

    return value.toLocaleString("es-ES", {
      style: "currency",
      currency: "EUR",
    });
  };

  return (
    <section className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-lg">
      <div className="mb-5 border-b border-border pb-4">
        <h2 className="text-lg font-black text-card-foreground">Historial de reservas</h2>
        <p className="text-sm text-muted-foreground">Todas las reservas del usuario en un solo vistazo.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10 text-muted-foreground">Cargando reservas...</div>
      ) : isError ? (
        <div className="py-10 text-center text-destructive">No se pudieron cargar las reservas.</div>
      ) : rentals.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground">No hay reservas para este usuario.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {rentals.map((rental) => (
            <article key={rental.booking.uuid} className="rounded-2xl border border-border bg-background/70 p-5 transition hover:bg-background">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-accent px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent-foreground">
                  Reserva
                </span>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${getStatusStyles(getDisplayStatus(rental.booking.startTime, rental.booking.endTime, rental.booking.status))}`}>
                  {getDisplayStatus(rental.booking.startTime, rental.booking.endTime, rental.booking.status)}
                </span>
              </div>

              <h3 className="text-base font-bold text-card-foreground">
                {rental.booking.title || rental.booking.court?.name || "Reserva de pista"}
              </h3>

              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-foreground" />
                  Pista: {rental.booking.court?.name ?? "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-foreground" />
                  Inicio: {new Date(rental.booking.startTime).toLocaleString("es-ES")}
                </p>
                <p className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-foreground" />
                  Fin: {new Date(rental.booking.endTime).toLocaleString("es-ES")}
                </p>
                <p className="flex items-center gap-2 font-semibold text-foreground">
                  <CircleDollarSign className="h-4 w-4 text-foreground" />
                  Total: {formatCurrency(rental.booking.totalPrice)}
                </p>
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Ticket className="h-3.5 w-3.5 text-muted-foreground" />
                  Ticket: {rental.ticket.code} ({rental.ticket.status})
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
