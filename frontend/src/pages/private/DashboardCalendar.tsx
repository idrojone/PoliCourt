import { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/layout/dashboard";
import { useDashboardBookingsQuery } from "@/features/bookings/queries/useDashboardBookingsQuery";
import type { BookingResponse } from "@/features/types/bookings/BookingRecord";

const getDayKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getBookingTypeLabel = (booking: BookingResponse) => {
  if (booking.type) return booking.type;
  if (booking.sport?.name) return booking.sport.name;
  if (booking.court?.name) return "Pista";
  return "Reserva";
};

const getBookingSubtitle = (booking: BookingResponse) => {
  if (booking.court?.name && booking.sport?.name) {
    return `${booking.court.name} · ${booking.sport.name}`;
  }

  if (booking.court?.name) return booking.court.name;
  if (booking.sport?.name) return booking.sport.name;
  return booking.title || "Sin detalles";
};

const formatTimeRange = (startTime?: string, endTime?: string) => {
  if (!startTime || !endTime) return "Horario desconocido";

  const start = new Date(startTime);
  const end = new Date(endTime);

  return `${start.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })} - ${end.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })}`;
};

export const DashboardCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { data, isLoading, isError } = useDashboardBookingsQuery();

  const bookings = data?.content ?? [];

  const bookingsByDay = useMemo(() => {
    const map = new Map<string, BookingResponse[]>();

    bookings.forEach((booking) => {
      if (!booking.startTime) return;
      const dateKey = getDayKey(new Date(booking.startTime));
      const existing = map.get(dateKey) || [];
      map.set(dateKey, [...existing, booking]);
    });

    return map;
  }, [bookings]);

  const selectedDayBookings = useMemo(() => {
    return (bookingsByDay.get(getDayKey(selectedDate)) ?? []).slice().sort((a, b) => {
      if (!a.startTime || !b.startTime) return 0;
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });
  }, [bookingsByDay, selectedDate]);

  const dayHasReservations = (day: Date) => {
    return bookingsByDay.has(getDayKey(day));
  };

  return (
    <DashboardLayout
      title="Calendario"
      extraActions={
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <div className="rounded-full border border-border px-3 py-1">Reservas totales: {bookings.length}</div>
          <div className="rounded-full border border-border px-3 py-1">Días con reservas: {bookingsByDay.size}</div>
          <div className="rounded-full border border-border px-3 py-1">Reservas en día: {selectedDayBookings.length}</div>
        </div>
      }
    >
      <div className="grid h-full gap-6 xl:grid-cols-[minmax(360px,420px)_minmax(0,1fr)]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm h-full">
          <div className="mb-4">
            <p className="text-sm font-semibold text-muted-foreground">Selecciona un día</p>
            <p className="text-sm text-foreground/70">Los días marcados contienen reservas activas.</p>
          </div>

          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(value) => value && setSelectedDate(value)}
            modifiers={{ reserved: dayHasReservations }}
            modifiersClassNames={{ reserved: "bg-emerald-100 text-emerald-700 rounded-full" }}
            className="rounded-3xl border border-border p-4"
          />

          <div className="mt-5 rounded-2xl bg-muted/50 p-4 text-sm text-muted-foreground">
            {bookingsByDay.size > 0 ? (
              <p>Los días en verde tienen al menos una reserva.</p>
            ) : (
              <p>No se encontraron reservas activas para mostrar en el calendario.</p>
            )}
          </div>
        </div>

        <div className="space-y-6 h-full">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm h-full overflow-hidden flex flex-col">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Reservas del día</h2>
                <p className="text-sm text-muted-foreground">{selectedDate.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
              <Badge variant="secondary">{selectedDayBookings.length} items</Badge>
            </div>

            {isLoading ? (
              <div className="flex-1 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Cargando reservas...</div>
            ) : isError ? (
              <div className="flex-1 rounded-2xl border border-destructive/50 bg-destructive/5 p-8 text-center text-sm text-destructive">Error al cargar las reservas.</div>
            ) : selectedDayBookings.length === 0 ? (
              <div className="flex-1 rounded-2xl border border-border p-8 text-center text-sm text-muted-foreground">No hay reservas para este día.</div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {selectedDayBookings.map((booking) => (
                  <div key={booking.uuid} className="rounded-3xl border border-border bg-background p-4 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-foreground">{getBookingTypeLabel(booking)}</div>
                        <div className="text-xs text-muted-foreground">{getBookingSubtitle(booking)}</div>
                      </div>
                      <Badge variant="outline">{booking.status ?? "Sin estado"}</Badge>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-muted p-3 text-sm">
                        <p className="text-xs uppercase text-muted-foreground">Horario</p>
                        <p className="mt-1 font-medium text-foreground">{formatTimeRange(booking.startTime, booking.endTime)}</p>
                      </div>
                      <div className="rounded-2xl bg-muted p-3 text-sm">
                        <p className="text-xs uppercase text-muted-foreground">Precio</p>
                        <p className="mt-1 font-medium text-foreground">{booking.totalPrice ? `${booking.totalPrice} €` : "--"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Resumen rápido</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-muted p-4">
                <p className="text-xs uppercase text-muted-foreground">Reservas totales</p>
                <p className="mt-2 text-2xl font-semibold">{bookings.length}</p>
              </div>
              <div className="rounded-2xl bg-muted p-4">
                <p className="text-xs uppercase text-muted-foreground">Días con reservas</p>
                <p className="mt-2 text-2xl font-semibold">{bookingsByDay.size}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
