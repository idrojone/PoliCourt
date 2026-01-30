import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  User,
  CalendarCheck,
} from "lucide-react";
import type { Booking, BookingStatus } from "@/features/types/booking";
import { formatDateTime } from "@/lib/dateTime";

interface RentalCardProps {
  booking: Booking;
  isOverlay?: boolean;
  toggleMutationPending: boolean;
  toggleActive: (booking: Booking) => void;
  handleStatusChange: (slug: string, status: BookingStatus) => void;
}

const getStatusColor = (status: BookingStatus) => {
  const colors: Record<BookingStatus, string> = {
    CONFIRMED: "bg-green-100 text-green-800 border-green-300",
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
    CANCELLED: "bg-red-100 text-red-800 border-red-300",
    COMPLETED: "bg-blue-100 text-blue-800 border-blue-300",
  };
  return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
};

export const RentalCard = ({
  booking,
  isOverlay,
  toggleMutationPending,
  toggleActive,
  handleStatusChange,
}: RentalCardProps) => {
  const startDateTime = formatDateTime(booking.startTime);
  const endDateTime = formatDateTime(booking.endTime);

  return (
    <Card
      className={`relative group overflow-hidden transition-all h-full flex flex-col ${
        isOverlay
          ? "shadow-2xl scale-105 rotate-2 cursor-grabbing"
          : "hover:shadow-md"
      } ${!booking.isActive ? "opacity-60" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CalendarCheck size={16} className="text-blue-500" />
              Alquiler de pista
            </CardTitle>
            <div className="flex items-center text-xs text-muted-foreground gap-1">
              <MapPin size={12} />
              {booking.courtSlug}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={booking.isActive}
              onCheckedChange={() => toggleActive(booking)}
              disabled={toggleMutationPending}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col">
        {/* Fecha y hora */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-secondary/20 rounded-md">
            <Calendar size={16} className="text-primary" />
            <span className="text-sm">{startDateTime.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock size={14} className="text-muted-foreground" />
            <span>
              {startDateTime.time} - {endDateTime.time}
            </span>
          </div>
        </div>

        {/* Info adicional */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 p-2 bg-secondary/20 rounded-md">
            <User size={16} className="text-primary" />
            <span className="truncate" title={booking.organizerUsername}>
              {booking.organizerUsername}
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-secondary/20 rounded-md">
            <DollarSign size={16} className="text-green-600" />
            <span className="font-semibold">{booking.totalPrice ?? 0} €</span>
          </div>
        </div>

        {/* Tipo badge */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-800">
            <CalendarCheck size={12} />
            Alquiler
          </Badge>
        </div>

        {/* Status selector */}
        <div className="pt-2 flex justify-between items-center mt-auto">
          <div onPointerDown={(e) => e.stopPropagation()}>
            <Select
              defaultValue={booking.status}
              onValueChange={(value) => handleStatusChange(booking.slug, value as BookingStatus)}
              disabled={
                toggleMutationPending ||
                booking.status === "CANCELLED" ||
                booking.status === "COMPLETED"
              }
            >
              <SelectTrigger
                className={`w-32 h-8 text-xs font-medium border ${getStatusColor(
                  booking.status
                )}`}
              >
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="CONFIRMED">Confirmada</SelectItem>
                <SelectItem value="COMPLETED">Completada</SelectItem>
                <SelectItem value="CANCELLED">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(booking.createdAt).toLocaleDateString("es-ES")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
