import type { Booking, BookingType, CreateBookingDTO } from "@/features/types/booking";
import type { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

type MutationOptions = {
  onSuccess?: (data: unknown) => void;
  onError?: (error: AxiosError<{ message: string }>) => void;
};

interface UseBookingFormLogicParams {
  bookingType: BookingType;
  createBooking: {
    mutate: (payload: CreateBookingDTO, options?: MutationOptions) => void;
  };
}

export const useBookingFormLogic = ({
  bookingType,
  createBooking,
}: UseBookingFormLogicParams) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Booking | null>(null);

  const openCreate = () => {
    setEditing(null);
    setIsOpen(true);
  };

  const openEdit = (b: Booking) => {
    setEditing(b);
    setIsOpen(true);
  };

  const handleSave = (formData: Omit<CreateBookingDTO, "type">) => {
    const payload: CreateBookingDTO = {
      ...formData,
      type: bookingType,
      title: formData.title?.trim() || "",
      description: formData.description?.trim() || "",
      courtSlug: formData.courtSlug.trim(),
      organizerUsername: formData.organizerUsername.trim(),
    };

    const typeLabels: Record<BookingType, string> = {
      RENTAL: "Alquiler",
      CLASS: "Clase",
      TRAINING: "Entrenamiento",
      TOURNAMENT: "Torneo",
    };

    const label = typeLabels[bookingType];

    const onSuccess = (msg: string) => {
      setIsOpen(false);
      setEditing(null);
      toast.success(msg);
    };

    const onError = (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message || `Error al guardar ${label.toLowerCase()}.`);
    };

    // Solo creamos, no editamos bookings por ahora
    createBooking.mutate(payload, {
      onSuccess: () => onSuccess(`${label} "${payload.title || "Sin título"}" creado.`),
      onError,
    });
  };

  return { isOpen, setIsOpen, editing, openCreate, openEdit, handleSave, bookingType };
};
