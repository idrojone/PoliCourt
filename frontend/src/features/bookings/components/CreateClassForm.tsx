import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/features/auth/context/AuthContext";
import useCreateClassMutation from "@/features/bookings/mutations/useCreateClassMutation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useSportSlugsQuery } from "@/features/sport/queries/useSportSlugsQuery";
import { useCourtsPageQuery } from "@/features/court/queries/useCourtsPageQuery.fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fromDateTimeLocalValue, toDateTimeLocalValue } from "@/lib";
import { toast } from "sonner";
import { BookingSelectionDialog } from "@/features/bookings/components/booking-flow/BookingSelectionDialog";
import { useBookingSelectionState } from "@/features/bookings/hooks/useBookingSelectionState";
import type { Court } from "@/features/types/court/Court";

type ScheduleSelectorProps = {
  court: Court;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSportSlug?: string;
  organizerUsername?: string;
  onPick: (startIso: string, endIso: string) => void;
};

const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({
  court,
  open,
  onOpenChange,
  initialSportSlug,
  organizerUsername,
  onPick,
}) => {
  const {
    selectedDate,
    setSelectedDate,
    selectedSportSlug,
    setSelectedSportSlug,
    selectedSlotRange,
    toggleSlotSelection,
    effectiveSports,
    slots,
    prepareDraftAndValidate,
  } = useBookingSelectionState({
    court,
    selectionOpen: open,
    organizerUsername,
    onRequireLogin: () => onOpenChange(false),
  });

  React.useEffect(() => {
    if (initialSportSlug) setSelectedSportSlug(initialSportSlug);
  }, [initialSportSlug, setSelectedSportSlug]);

  const handleContinue = () => {
    const draft = prepareDraftAndValidate();
    if (!draft) return;
    onPick(draft.startTime, draft.endTime);
    onOpenChange(false);
  };

  return (
    <BookingSelectionDialog
      open={open}
      onOpenChange={onOpenChange}
      selectedDate={selectedDate}
      onDateChange={setSelectedDate}
      selectedSportSlug={selectedSportSlug}
      onSportChange={setSelectedSportSlug}
      selectedSlotRange={selectedSlotRange}
      onSlotToggle={toggleSlotSelection}
      sports={effectiveSports}
      slots={slots}
      court={court}
      onContinue={handleContinue}
    />
  );
};

type FormValues = {
  courtSlug: string;
  sportSlug: string;
  title: string;
  description?: string;
  attendeePrice?: number;
  startTime: string;
  endTime: string;
};

export const CreateClassForm: React.FC<{
  onSuccess?: () => void;
  onCancel?: () => void;
}> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const username = user?.username;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      courtSlug: "",
      sportSlug: "",
      title: "",
      description: "",
      attendeePrice: undefined,
      startTime: "",
      endTime: "",
    },
  });

  const mutation = useCreateClassMutation(username);

  const { data: sports } = useSportSlugsQuery();
  const [sportFilter, setSportFilter] = useState("");
  const selectedSport = watch("sportSlug");

  const courtParams = useMemo(() => {
    return selectedSport ? { sports: [selectedSport], limit: 100 } : { limit: 100 };
  }, [selectedSport]);

  const { data: courtsPage, isLoading: isLoadingCourts } = useCourtsPageQuery(courtParams as any);

  const [selectionOpen, setSelectionOpen] = useState(false);
  const selectedCourtSlug = watch("courtSlug");
  const selectedCourt = useMemo(() => {
    return (courtsPage?.content || []).find((c: any) => c.slug === selectedCourtSlug) as Court | undefined;
  }, [courtsPage, selectedCourtSlug]);

  // clear court selection when sport changes
  useEffect(() => {
    setValue("courtSlug", "");
  }, [selectedSport, setValue]);

  const onSubmit = (data: FormValues) => {
    if (!username) return;

    // Require schedule selection and validate start < end
    if (!data.startTime || !data.endTime) {
      toast.error("Selecciona un horario para la clase.");
      return;
    }

    const startIso = fromDateTimeLocalValue(data.startTime);
    const endIso = fromDateTimeLocalValue(data.endTime);

    if (new Date(startIso) >= new Date(endIso)) {
      toast.error("La fecha de fin debe ser posterior a la de inicio");
      return;
    }

    const payload = {
      ...data,
      startTime: startIso,
      endTime: endIso,
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="sportSlug" className={errors.sportSlug ? "text-destructive" : ""}>
          Deporte
        </Label>
        <Select
          value={selectedSport}
          onValueChange={(val) => setValue("sportSlug", val)}
        >
          <SelectTrigger className={errors.sportSlug ? "border-destructive" : ""}>
            <SelectValue placeholder="Selecciona un deporte (buscar)" />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2">
              <Input placeholder="Buscar deporte..." value={sportFilter} onChange={(e) => setSportFilter(e.target.value)} />
            </div>
            {(sports || [])
              .filter((s) =>
                !sportFilter
                  ? true
                  : s.name.toLowerCase().includes(sportFilter.toLowerCase()) || s.slug.toLowerCase().includes(sportFilter.toLowerCase())
              )
              .map((sport) => (
                <SelectItem key={sport.slug} value={sport.slug}>
                  {sport.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {errors.sportSlug && <p className="text-xs text-destructive font-medium">{errors.sportSlug.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="courtSlug" className={errors.courtSlug ? "text-destructive" : ""}>
          Pista
        </Label>
        <Select
          value={"" || (watch("courtSlug") as string)}
          onValueChange={(val) => setValue("courtSlug", val)}
        >
          <SelectTrigger className={errors.courtSlug ? "border-destructive" : ""}>
            <SelectValue placeholder={selectedSport ? "Selecciona una pista" : "Selecciona un deporte primero"} />
          </SelectTrigger>
          <SelectContent>
            {isLoadingCourts ? (
              <div className="p-2 text-sm text-muted-foreground">Cargando pistas...</div>
            ) : (
              (courtsPage?.content || []).map((c: any) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors.courtSlug && <p className="text-xs text-destructive font-medium">{errors.courtSlug.message}</p>}
      </div>

        <div className="space-y-1">
          <Label>Horario</Label>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" disabled={!selectedCourt} onClick={() => setSelectionOpen(true)}>
              Seleccionar horario
            </Button>
            <span className="text-sm text-muted-foreground">
              {watch("startTime") && watch("endTime") ? `${watch("startTime")} → ${watch("endTime")}` : "No hay horario seleccionado"}
            </span>
          </div>
        </div>

      <div className="space-y-1">
        <Label htmlFor="title" className={errors.title ? "text-destructive" : ""}>
          Título
        </Label>
        <Input id="title" {...register("title", { required: "Campo requerido" })} className={errors.title ? "border-destructive" : ""} />
        {errors.title && <p className="text-xs text-destructive font-medium">{errors.title.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" {...register("description")} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="attendeePrice">Precio por asistente</Label>
        <Input id="attendeePrice" type="number" step="0.01" {...register("attendeePrice", { valueAsNumber: true })} />
      </div>

      {/* Las entradas 'Inicio' y 'Fin' se gestionan mediante el selector de horario. */}

      {/* Organizador eliminado del formulario; se toma del useAuth en la mutation */}

      <DialogFooter className="mt-6">
        <Button variant="outline" type="button" onClick={() => onCancel?.()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={mutation.status === "pending" || !username}>
          {mutation.status === "pending" ? "Creando..." : "Crear clase"}
        </Button>
      </DialogFooter>
      {selectedCourt && (
        <ScheduleSelector
          court={selectedCourt}
          open={selectionOpen}
          onOpenChange={setSelectionOpen}
          initialSportSlug={selectedSport}
          organizerUsername={username}
          onPick={(startIso, endIso) => {
            setValue("startTime", toDateTimeLocalValue(startIso));
            setValue("endTime", toDateTimeLocalValue(endIso));
          }}
        />
      )}
    </form>
  );
};

export default CreateClassForm;
