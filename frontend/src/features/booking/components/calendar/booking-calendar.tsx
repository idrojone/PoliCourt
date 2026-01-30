import { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventInput, EventClickArg } from "@fullcalendar/core";
import type { Booking, BookingType } from "@/features/types/booking";
import type { Maintenance } from "@/features/types/maintenance";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  DollarSign,
  GraduationCap,
  Dumbbell,
  CalendarCheck,
  Wrench,
} from "lucide-react";
import { formatDateTime } from "@/lib/dateTime";
import "./calendar.css";

interface BookingCalendarProps {
  rentals: Booking[];
  classes: Booking[];
  trainings: Booking[];
  maintenances?: Maintenance[];
  isLoading?: boolean;
}

// Tipo extendido para incluir MAINTENANCE
type CalendarEventType = BookingType | "MAINTENANCE";

// Colores para cada tipo de evento
const EVENT_COLORS: Record<CalendarEventType, { bg: string; border: string; text: string }> = {
  RENTAL: {
    bg: "#3b82f6",      // blue-500
    border: "#2563eb",  // blue-600
    text: "#ffffff",
  },
  CLASS: {
    bg: "#a855f7",      // purple-500
    border: "#9333ea",  // purple-600
    text: "#ffffff",
  },
  TRAINING: {
    bg: "#f97316",      // orange-500
    border: "#ea580c",  // orange-600
    text: "#ffffff",
  },
  MAINTENANCE: {
    bg: "#ef4444",      // red-500
    border: "#dc2626",  // red-600
    text: "#ffffff",
  },
};

const TYPE_LABELS: Record<CalendarEventType, string> = {
  RENTAL: "Alquiler",
  CLASS: "Clase",
  TRAINING: "Entrenamiento",
  MAINTENANCE: "Mantenimiento",
};

const TYPE_ICONS: Record<CalendarEventType, React.ReactNode> = {
  RENTAL: <CalendarCheck size={16} />,
  CLASS: <GraduationCap size={16} />,
  TRAINING: <Dumbbell size={16} />,
  MAINTENANCE: <Wrench size={16} />,
};

export const BookingCalendar = ({
  rentals,
  classes,
  trainings,
  maintenances = [],
  isLoading,
}: BookingCalendarProps) => {
  const [selectedEvent, setSelectedEvent] = useState<{ data: Booking | Maintenance; type: CalendarEventType } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Convertir bookings y mantenimientos a eventos de FullCalendar
  const events: EventInput[] = useMemo(() => {
    const bookingEvents = [
      ...rentals.map((b) => ({ ...b, eventType: "RENTAL" as CalendarEventType })),
      ...classes.map((b) => ({ ...b, eventType: "CLASS" as CalendarEventType })),
      ...trainings.map((b) => ({ ...b, eventType: "TRAINING" as CalendarEventType })),
    ]
      .filter((booking) => booking.isActive)
      .map((booking) => {
        const colors = EVENT_COLORS[booking.eventType];
        return {
          id: booking.slug,
          title: booking.title || TYPE_LABELS[booking.eventType],
          start: booking.startTime,
          end: booking.endTime,
          backgroundColor: colors.bg,
          borderColor: colors.border,
          textColor: colors.text,
          extendedProps: {
            data: booking,
            eventType: booking.eventType,
          },
        };
      });

    const maintenanceEvents = maintenances
      .filter((m) => m.isActive)
      .map((maintenance) => {
        const colors = EVENT_COLORS.MAINTENANCE;
        return {
          id: `maintenance-${maintenance.slug}`,
          title: maintenance.title || "Mantenimiento",
          start: maintenance.startTime,
          end: maintenance.endTime,
          backgroundColor: colors.bg,
          borderColor: colors.border,
          textColor: colors.text,
          extendedProps: {
            data: maintenance,
            eventType: "MAINTENANCE" as CalendarEventType,
          },
        };
      });

    return [...bookingEvents, ...maintenanceEvents];
  }, [rentals, classes, trainings, maintenances]);

  const handleEventClick = (info: EventClickArg) => {
    const data = info.event.extendedProps.data as Booking | Maintenance;
    const eventType = info.event.extendedProps.eventType as CalendarEventType;
    setSelectedEvent({ data, type: eventType });
    setDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      // Booking statuses
      CONFIRMED: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400",
      CANCELLED: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400",
      COMPLETED: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400",
      // Maintenance statuses
      SCHEDULED: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400",
      IN_PROGRESS: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400",
    };
    const statusLabels: Record<string, string> = {
      // Booking statuses
      CONFIRMED: "Confirmada",
      PENDING: "Pendiente",
      CANCELLED: "Cancelada",
      COMPLETED: "Completada",
      // Maintenance statuses
      SCHEDULED: "Programado",
      IN_PROGRESS: "En Progreso",
    };
    return (
      <Badge className={statusStyles[status] || "bg-gray-100 dark:bg-gray-800"}>
        {statusLabels[status] || status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-card rounded-lg border">
        <div className="text-muted-foreground">Cargando calendario...</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-lg border p-4">
        {/* Leyenda */}
        <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-border">
          <span className="text-sm font-medium text-foreground mr-1">Tipos:</span>
          <Badge 
            variant="outline" 
            className="gap-1.5 px-2.5 py-1 font-medium border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20"
          >
            <CalendarCheck size={14} />
            Alquileres
          </Badge>
          <Badge 
            variant="outline" 
            className="gap-1.5 px-2.5 py-1 font-medium border-purple-500/50 bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20"
          >
            <GraduationCap size={14} />
            Clases
          </Badge>
          <Badge 
            variant="outline" 
            className="gap-1.5 px-2.5 py-1 font-medium border-orange-500/50 bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20"
          >
            <Dumbbell size={14} />
            Entrenamientos
          </Badge>
          <Badge 
            variant="outline" 
            className="gap-1.5 px-2.5 py-1 font-medium border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20"
          >
            <Wrench size={14} />
            Mantenimientos
          </Badge>
        </div>

        {/* Calendario */}
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          locale="es"
          buttonText={{
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
          }}
          events={events}
          eventClick={handleEventClick}
          slotMinTime="07:00:00"
          slotMaxTime="23:00:00"
          allDaySlot={false}
          slotDuration="00:30:00"
          height="auto"
          expandRows={true}
          stickyHeaderDates={true}
          nowIndicator={true}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          dayHeaderFormat={{
            weekday: "short",
            day: "numeric",
            month: "short",
          }}
          eventDisplay="block"
          eventMaxStack={3}
        />
      </div>

      {/* Dialog de detalle del evento */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {TYPE_ICONS[selectedEvent.type]}
                  {selectedEvent.data.title || TYPE_LABELS[selectedEvent.type]}
                </DialogTitle>
                <DialogDescription>
                  {selectedEvent.type === "MAINTENANCE" 
                    ? "Detalles del mantenimiento" 
                    : "Detalles de la reserva"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Tipo y Estado */}
                <div className="flex items-center justify-between">
                  <Badge 
                    style={{ 
                      backgroundColor: EVENT_COLORS[selectedEvent.type].bg,
                      color: EVENT_COLORS[selectedEvent.type].text,
                    }}
                  >
                    {TYPE_LABELS[selectedEvent.type]}
                  </Badge>
                  {getStatusBadge(selectedEvent.data.status)}
                </div>

                {/* Descripción */}
                {selectedEvent.data.description && (
                  <p className="text-sm text-muted-foreground">
                    {selectedEvent.data.description}
                  </p>
                )}

                {/* Fecha y hora */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span>{formatDateTime(selectedEvent.data.startTime).date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-muted-foreground" />
                    <span>
                      {formatDateTime(selectedEvent.data.startTime).time} - {formatDateTime(selectedEvent.data.endTime).time}
                    </span>
                  </div>
                </div>

                {/* Pista */}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-muted-foreground" />
                  <span>
                    {selectedEvent.type === "MAINTENANCE" 
                      ? (selectedEvent.data as Maintenance).courtName || (selectedEvent.data as Maintenance).courtSlug
                      : (selectedEvent.data as Booking).courtSlug}
                  </span>
                </div>

                {/* Organizador / Creado por */}
                <div className="flex items-center gap-2 text-sm">
                  <User size={16} className="text-muted-foreground" />
                  <span>
                    {selectedEvent.type === "MAINTENANCE" 
                      ? (selectedEvent.data as Maintenance).createdByUsername
                      : (selectedEvent.data as Booking).organizerUsername}
                  </span>
                </div>

                {/* Precios - solo para bookings */}
                {selectedEvent.type !== "MAINTENANCE" && (
                  <div className="flex items-center gap-4 pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign size={16} className="text-green-600" />
                      <span>Total: {(selectedEvent.data as Booking).totalPrice} €</span>
                    </div>
                    {selectedEvent.type === "CLASS" && ((selectedEvent.data as Booking).attendeePrice ?? 0) > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">
                          Inscripción: {(selectedEvent.data as Booking).attendeePrice} €
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Asistentes - solo para bookings */}
                {selectedEvent.type !== "MAINTENANCE" && 
                  (selectedEvent.data as Booking).attendees && 
                  (selectedEvent.data as Booking).attendees.length > 0 && (
                  <div className="pt-2 border-t">
                    <span className="text-sm text-muted-foreground">
                      {(selectedEvent.data as Booking).attendees.length} asistente(s)
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
