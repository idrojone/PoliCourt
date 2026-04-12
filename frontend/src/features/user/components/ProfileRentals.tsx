import { useState } from "react";
import type { UserRentalRecord } from "@/features/types/bookings/UserRentals";
import { useCancelBookingMutation } from "@/features/bookings/mutations/useCancelBookingMutation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CalendarClock, CircleDollarSign, MapPin, Ticket } from "lucide-react";

interface ProfileRentalsProps {
  rentals: UserRentalRecord[];
  isLoading: boolean;
  isError: boolean;
  isOwner: boolean;
  requestUsername?: string;
}

export const ProfileRentals = ({
  rentals,
  isLoading,
  isError,
  isOwner,
  requestUsername,
}: ProfileRentalsProps) => {
  const cancelBookingMutation = useCancelBookingMutation();
  const [bookingToCancel, setBookingToCancel] = useState<UserRentalRecord | null>(null);

  const getStatusStyles = (status: string) => {
    const normalized = status.toUpperCase();

    if (normalized.includes("CONFIRMED") || normalized.includes("PAID")) {
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-300/35 dark:bg-emerald-400/10 dark:text-emerald-200";
    }

    if (normalized.includes("CANCEL") || normalized.includes("REJECT")) {
      return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-300/35 dark:bg-rose-400/10 dark:text-rose-200";
    }

    if (normalized.includes("PENDING")) {
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-300/35 dark:bg-amber-400/10 dark:text-amber-200";
    }

    return "border-slate-200 bg-slate-100 text-slate-700 dark:border-border dark:bg-accent dark:text-accent-foreground";
  };

  console.log("Rentals data:", rentals);

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

  const canCancelBooking = (rental: UserRentalRecord) => {
    const backendStatus = rental.booking.status.toUpperCase();
    return (
      isOwner
      && !!requestUsername
      && rental.booking.isActive
      && backendStatus !== "CANCELLED"
      && backendStatus !== "COMPLETED"
    );
  };

  const hasLessThanThreeHours = (startTime: string) => {
    const start = new Date(startTime);
    if (Number.isNaN(start.getTime())) return false;

    const diffMs = start.getTime() - Date.now();
    return diffMs > 0 && diffMs < 3 * 60 * 60 * 1000;
  };

  const handleConfirmCancel = () => {
    if (!bookingToCancel || !requestUsername) return;

    cancelBookingMutation.mutate({
      bookingUuid: bookingToCancel.booking.uuid,
      username: requestUsername,
    });
    setBookingToCancel(null);
  };

  return (
    <section className="mt-6 rounded-3xl border border-cyan-300/30 bg-white/80 p-6 text-slate-900 shadow-[0_20px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-cyan-400/20 dark:bg-slate-950/70 dark:text-white dark:shadow-[0_0_35px_rgba(56,189,248,0.15)]">
      <div className="mb-5 border-b border-slate-200/80 pb-4 dark:border-white/10">
        <h2 className="text-lg font-black">Historial de reservas</h2>
        <p className="text-sm text-slate-600 dark:text-slate-200/70">Todas las reservas del usuario en un solo vistazo.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10 text-slate-600 dark:text-slate-200/70">Cargando reservas...</div>
      ) : isError ? (
        <div className="py-10 text-center text-rose-600 dark:text-rose-200">No se pudieron cargar las reservas.</div>
      ) : rentals.length === 0 ? (
        <div className="py-10 text-center text-slate-600 dark:text-slate-200/70">No hay reservas para este usuario.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {rentals.map((rental) => (
            <article
              key={rental.booking.uuid}
              className="rounded-2xl border border-cyan-200/60 bg-white/80 p-5 text-slate-900 shadow-sm transition hover:border-cyan-300/60 hover:bg-white dark:border-cyan-400/15 dark:bg-slate-950/60 dark:text-white dark:shadow-none dark:hover:border-cyan-300/40 dark:hover:bg-slate-950/70"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
                  Reserva
                </span>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${getStatusStyles(getDisplayStatus(rental.booking.startTime, rental.booking.endTime, rental.booking.status))}`}>
                  {getDisplayStatus(rental.booking.startTime, rental.booking.endTime, rental.booking.status)}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {rental.booking.title || rental.booking.court?.name || "Reserva de pista"}
              </h3>

              <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-200/70">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-cyan-700 dark:text-cyan-100" />
                  Pista: {rental.booking.court?.name ?? "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-cyan-700 dark:text-cyan-100" />
                  Inicio: {new Date(rental.booking.startTime).toLocaleString("es-ES")}
                </p>
                <p className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-cyan-700 dark:text-cyan-100" />
                  Fin: {new Date(rental.booking.endTime).toLocaleString("es-ES")}
                </p>
                <p className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                  <CircleDollarSign className="h-4 w-4 text-cyan-700 dark:text-cyan-100" />
                  Total: {formatCurrency(rental.booking.totalPrice)}
                </p>
                <p className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-200/60">
                  <Ticket className="h-3.5 w-3.5 text-slate-500 dark:text-slate-200/60" />
                  Ticket: {rental.ticket.code} ({rental.ticket.status})
                </p>

                {canCancelBooking(rental) && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="mt-4 border border-rose-300/60 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-400/40 dark:bg-rose-500/20 dark:text-rose-100 dark:hover:bg-rose-500/30"
                    disabled={
                      cancelBookingMutation.isPending
                      && cancelBookingMutation.variables?.bookingUuid === rental.booking.uuid
                    }
                    onClick={() => {
                      setBookingToCancel(rental);
                    }}
                  >
                    {cancelBookingMutation.isPending
                    && cancelBookingMutation.variables?.bookingUuid === rental.booking.uuid
                      ? "Cancelando..."
                      : "Cancelar reserva"}
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <AlertDialog open={!!bookingToCancel} onOpenChange={(open) => !open && setBookingToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar cancelación</AlertDialogTitle>
            <AlertDialogDescription>
              {bookingToCancel && hasLessThanThreeHours(bookingToCancel.booking.startTime)
                ? "Faltan menos de 3 horas para el inicio de la reserva. Si la cancelas ahora, el reembolso no será ejecutado."
                : "Vas a cancelar esta reserva. Esta acción no se puede deshacer."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelBookingMutation.isPending}>Volver</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={cancelBookingMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelBookingMutation.isPending ? "Cancelando..." : "Sí, cancelar reserva"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};
