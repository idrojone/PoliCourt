import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Court } from "@/features/types/court/Court";
import type { SlotView, SportOption } from "./types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  onDateChange: (value: Date) => void;
  selectedSportSlug: string;
  onSportChange: (slug: string) => void;
  selectedSlotIndex: number | null;
  onSlotChange: (index: number) => void;
  sports: SportOption[];
  slots: SlotView[];
  court: Court;
  onContinue: () => void;
};

export const BookingSelectionDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  selectedDate,
  onDateChange,
  selectedSportSlug,
  onSportChange,
  selectedSlotIndex,
  onSlotChange,
  sports,
  slots,
  court,
  onContinue,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Cambio aplicado aquí: md:max-w-fit hace que el dialog se adapte al tamaño exacto de tu contenido */}
      <DialogContent className="w-full max-w-[95vw] md:max-w-fit overflow-visible p-6 sm:p-10">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl">Reserva tu pista</DialogTitle>
          <DialogDescription>
            Selecciona un día y un slot de 1 hora entre las 09:00 y las 21:00.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-start gap-10 lg:flex-row">
          <div className="min-w-[320px] space-y-6">
            <div className="space-y-3">
              <h3 className="text-muted-foreground text-sm font-bold uppercase tracking-wider">
                Fecha
              </h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(value: Date | undefined) => {
                  if (value) onDateChange(value);
                }}
                disabled={(date: Date) => {
                  const today = new Date();
                  const min = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate(),
                  );
                  return date < min;
                }}
                className="rounded-md border shadow-sm"
              />
            </div>

            <div className="space-y-3">
              <label className="text-muted-foreground text-sm font-bold uppercase tracking-wider">
                Deporte
              </label>
              <Select onValueChange={onSportChange} value={selectedSportSlug}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona deporte" />
                </SelectTrigger>
                <SelectContent>
                  {sports.map((sport) => (
                    <SelectItem key={sport.slug} value={sport.slug}>
                      {sport.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="min-w-100 flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-muted-foreground text-sm font-bold uppercase tracking-wider">
                Horarios disponibles
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs">
                  <div className="h-3 w-3 rounded-full border bg-secondary" />
                  <span>Libre</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <div className="h-3 w-3 rounded-full bg-destructive" />
                  <span>Ocupado</span>
                </div>
              </div>
            </div>

            <div className="custom-scrollbar grid max-h-112.5 grid-cols-2 gap-3 overflow-y-auto pr-2 sm:grid-cols-3">
              {slots.map((slot, index) => {
                const selected = selectedSlotIndex === index;

                return (
                  <Button
                    key={slot.label}
                    disabled={slot.isUnavailable}
                    onClick={() => onSlotChange(index)}
                    type="button"
                    variant={selected ? "default" : "outline"}
                    className={`h-12 text-sm font-medium transition-all ${
                      selected
                        ? "ring-primary ring-offset-background ring-2 ring-offset-2"
                        : ""
                    }`}>
                    {slot.label}
                  </Button>
                );
              })}
            </div>

            <div className="rounded-lg border border-dashed bg-muted/50 p-4">
              <p className="text-sm font-medium">
                Pista: <span className="text-primary">{court.name}</span>
              </p>
              <p className="text-muted-foreground text-sm">
                Precio por hora:{" "}
                <span className="text-foreground font-bold">
                  {court.priceH} EUR
                </span>
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-8 gap-3">
          <Button
            onClick={() => onOpenChange(false)}
            type="button"
            variant="ghost"
            className="px-8">
            Cancelar
          </Button>
          <Button
            onClick={onContinue}
            type="button"
            className="px-10 font-bold">
            Continuar al pago
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
