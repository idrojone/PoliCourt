import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BookingResponse } from "@/features/types/bookings/BookingRecord";
import useUpdateClassMutation from "@/features/bookings/mutations/useUpdateClassMutation";
import { fromDateTimeLocalValue, toDateTimeLocalValue } from "@/lib";
import { BookingSelectionDialog } from "@/features/bookings/components/booking-flow/BookingSelectionDialog";
import { useBookingSelectionState } from "@/features/bookings/hooks/useBookingSelectionState";
import type { Court } from "@/features/types/court/Court";
import { useState } from "react";
import { useSportSlugsQuery } from "@/features/sport/queries/useSportSlugsQuery";
import { useCourtsPageQuery } from "@/features/court/queries/useCourtsPageQuery.fa";
import { useAuth } from "@/features/auth/context/AuthContext";
import { toast } from "sonner";

type Props = {
  initial?: BookingResponse;
  onSuccess?: () => void;
  onCancel?: () => void;
};

type FormValues = {
  courtSlug: string;
  sportSlug: string;
  title: string;
  description?: string;
  attendeePrice?: number;
  startTime?: string;
  endTime?: string;
};

export const EditClassForm: React.FC<Props> = ({ initial, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const username = user?.username;

  const { data: sports } = useSportSlugsQuery();

  const defaultValues: FormValues = {
    courtSlug: initial?.court?.slug || "",
    sportSlug: initial?.sport?.slug || "",
    title: initial?.title || "",
    description: initial?.description || "",
    attendeePrice: initial?.attendeePrice,
    startTime: initial?.startTime ? toDateTimeLocalValue(initial.startTime) : "",
    endTime: initial?.endTime ? toDateTimeLocalValue(initial.endTime) : "",
  };

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormValues>({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [initial]);

  const selectedSport = watch("sportSlug");
  const courtParams = useMemo(() => (selectedSport ? { sports: [selectedSport], limit: 100 } : { limit: 100 }), [selectedSport]);
  const { data: courtsPage } = useCourtsPageQuery(courtParams as any);

  const [selectionOpen, setSelectionOpen] = useState(false);
  const selectedCourtSlug = watch("courtSlug");
  const selectedCourt = useMemo(() => {
    return (courtsPage?.content || []).find((c: any) => c.slug === selectedCourtSlug) as Court | undefined;
  }, [courtsPage, selectedCourtSlug]);

  const mutation = useUpdateClassMutation();

  const onSubmit = (data: FormValues) => {
    if (!initial) return;
    if (!username) return;

    if (!data.startTime || !data.endTime) {
      toast.error("Selecciona un horario");
      return;
    }

    const payload = {
      courtSlug: data.courtSlug,
      sportSlug: data.sportSlug,
      title: data.title,
      description: data.description,
      attendeePrice: data.attendeePrice,
      startTime: fromDateTimeLocalValue(data.startTime || ""),
      endTime: fromDateTimeLocalValue(data.endTime || ""),
    };

    mutation.mutate({ uuid: initial.uuid, payload }, {
      onSuccess: () => {
        toast.success("Clase actualizada");
        onSuccess?.();
      },
      onError: () => {
        toast.error("Error al actualizar la clase");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label>Deporte</Label>
        <Select value={selectedSport} onValueChange={(val) => setValue("sportSlug", val)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un deporte" />
          </SelectTrigger>
          <SelectContent>
            {(sports || []).map((s) => (
              <SelectItem key={s.slug} value={s.slug}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label>Pista</Label>
        <Select value={watch("courtSlug")} onValueChange={(val) => setValue("courtSlug", val)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una pista" />
          </SelectTrigger>
          <SelectContent>
            {(courtsPage?.content || []).map((c: any) => (
              <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label>Título</Label>
        <Input {...register("title", { required: true })} />
      </div>

      <div className="space-y-1">
        <Label>Descripción</Label>
        <Textarea {...register("description")} />
      </div>

      <div className="space-y-1">
        <Label>Precio por asistente</Label>
        <Input type="number" step="0.01" {...register("attendeePrice", { valueAsNumber: true })} />
      </div>

      <div className="space-y-1">
        <Label>Horario</Label>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" disabled={!selectedCourt} onClick={() => setSelectionOpen(true)}>Seleccionar horario</Button>
          <span className="text-sm text-muted-foreground">{watch("startTime") && watch("endTime") ? `${watch("startTime")} → ${watch("endTime")}` : "No hay horario seleccionado"}</span>
        </div>
      </div>

      {selectedCourt && (
        <ScheduleSelectorInternal
          court={selectedCourt}
          open={selectionOpen}
          onOpenChange={setSelectionOpen}
          initialSportSlug={watch("sportSlug")}
          organizerUsername={username}
          onPick={(startIso: string, endIso: string) => {
            setValue("startTime", toDateTimeLocalValue(startIso));
            setValue("endTime", toDateTimeLocalValue(endIso));
          }}
        />
      )}

      <DialogFooter>
        <Button variant="outline" type="button" onClick={() => onCancel?.()}>Cancelar</Button>
        <Button type="submit">Guardar</Button>
      </DialogFooter>
    </form>
  );
};

const ScheduleSelectorInternal: React.FC<{
  court: Court;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSportSlug?: string;
  organizerUsername?: string | undefined;
  onPick: (startIso: string, endIso: string) => void;
}> = ({ court, open, onOpenChange, initialSportSlug, organizerUsername, onPick }) => {
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
export default EditClassForm;
