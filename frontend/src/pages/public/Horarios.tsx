import { MainLayout } from "@/layout/main";
import { HeaderPage } from "@/components/header-page";
import { Calendar } from "@/components/ui/calendar";

export const Horarios = () => {
  const year = 2026;
  const firstMonth = new Date(year, 0, 1);
  const lastMonth = new Date(year, 11, 1);

  const isClosed = (day: Date) => day.getDay() === 0; // Domingo cerrado

  return (
    <MainLayout>
      <HeaderPage
        title="Horarios"
        description="Horario de funcionamiento del polideportivo: cada día de 9:00 a 21:00." 
      />

      <section className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h3 className="mb-4 text-2xl font-bold text-foreground">Horario de atención</h3>
          <p className="mb-3 text-muted-foreground">
            El polideportivo está abierto todos los días de 9:00 a 21:00.
          </p>
          <p className="mb-6 text-sm text-foreground">
            Los domingos están cerrados para mantenimiento general. El resto de días, el edificio funciona completo y las reservas pueden tomarse en línea con antelación.
          </p>

          <div className="rounded-xl border border-border bg-background p-4">
            <Calendar
              fromMonth={firstMonth}
              toMonth={lastMonth}
              numberOfMonths={3}
              disabled={isClosed}
              modifiers={{ closed: isClosed }}
              modifiersClassNames={{
                closed: "bg-red-100 text-red-700 rounded-full",
              }}
              className="w-full"
            />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};
