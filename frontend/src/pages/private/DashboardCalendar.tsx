import { DashboardLayout } from "@/layout/dashboard";
import { useRentalsQuery } from "@/features/booking/queries/useRentalsQuery";
import { useClassesQuery } from "@/features/booking/queries/useClassesQuery";
import { useTrainingsQuery } from "@/features/booking/queries/useTrainingsQuery";
import { useMaintenancesAllQuery } from "@/features/maintenance/queries/useMaintenancesAllQuery";
import { BookingCalendar } from "@/features/booking/components/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, GraduationCap, Dumbbell, Calendar, Wrench } from "lucide-react";

export const DashboardCalendar = () => {
  const { data: rentals, isLoading: rentalsLoading } = useRentalsQuery();
  const { data: classes, isLoading: classesLoading } = useClassesQuery();
  const { data: trainings, isLoading: trainingsLoading } = useTrainingsQuery();
  const { data: maintenances, isLoading: maintenancesLoading } = useMaintenancesAllQuery();

  const isLoading = rentalsLoading || classesLoading || trainingsLoading || maintenancesLoading;

  // Estadísticas rápidas
  const activeRentals = rentals?.filter((b) => b.isActive && b.status !== "CANCELLED") || [];
  const activeClasses = classes?.filter((b) => b.isActive && b.status !== "CANCELLED") || [];
  const activeTrainings = trainings?.filter((b) => b.isActive && b.status !== "CANCELLED") || [];
  const activeMaintenances = maintenances?.filter((m) => m.isActive && m.status !== "CANCELLED") || [];
  const totalActive = activeRentals.length + activeClasses.length + activeTrainings.length + activeMaintenances.length;

  return (
    <DashboardLayout title="Calendario de Reservas">
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Activas
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActive}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alquileres
            </CardTitle>
            <CalendarCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeRentals.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clases
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{activeClasses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Entrenamientos
            </CardTitle>
            <Dumbbell className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{activeTrainings.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mantenimientos
            </CardTitle>
            <Wrench className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{activeMaintenances.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Calendario */}
      <BookingCalendar
        rentals={rentals || []}
        classes={classes || []}
        trainings={trainings || []}
        maintenances={maintenances || []}
        isLoading={isLoading}
      />
    </DashboardLayout>
  );
};
