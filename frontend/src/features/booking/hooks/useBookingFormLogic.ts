import type { Booking, BookingType, CreateBookingDTO, UpdateBookingDTO } from "@/features/types/booking";
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
    isPending: boolean;
  };
  updateBooking?: {
    mutate: (params: { slug: string; payload: UpdateBookingDTO }, options?: MutationOptions) => void;
    isPending: boolean;
  };
}

export const useBookingFormLogic = ({
  bookingType,
  createBooking,
  updateBooking,
}: UseBookingFormLogicParams) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Booking | null>(null);

  const isEditMode = !!editing;
  const isSaving = createBooking.isPending || (updateBooking?.isPending ?? false);

  const openCreate = () => {
    setEditing(null);
    setIsOpen(true);
  };

  const openEdit = (b: Booking) => {
    setEditing(b);
    setIsOpen(true);
  };

  const handleSave = (formData: Omit<CreateBookingDTO, "type"> | UpdateBookingDTO) => {
    const typeLabels: Record<BookingType, string> = {
      RENTAL: "Alquiler",
      CLASS: "Clase",
      TRAINING: "Entrenamiento",
    };

    const label = typeLabels[bookingType];

    const onSuccess = (msg: string) => {
      setIsOpen(false);
      setEditing(null);
      toast.success(msg);
    };

    const onError = (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message || `Error al procesar ${label.toLowerCase()}.`);
    };

    if (isEditMode && editing && updateBooking) {
      // Modo actualización: solo enviar campos modificables
      const payload: UpdateBookingDTO = {
        title: (formData as UpdateBookingDTO).title?.trim() || undefined,
        description: (formData as UpdateBookingDTO).description?.trim() || undefined,
        startTime: formData.startTime,
        endTime: formData.endTime,
        attendeePrice: (formData as UpdateBookingDTO).attendeePrice,
      };

      updateBooking.mutate(
        { slug: editing.slug, payload },
        {
          onSuccess: () => onSuccess(`${label} actualizado exitosamente.`),
          onError,
        }
      );
    } else {
      // Modo creación
      const createData = formData as Omit<CreateBookingDTO, "type">;
      const payload: CreateBookingDTO = {
        type: bookingType,
        title: createData.title?.trim() || "",
        description: createData.description?.trim() || "",
        courtSlug: createData.courtSlug.trim(),
        organizerUsername: createData.organizerUsername.trim(),
        startTime: createData.startTime,
        endTime: createData.endTime,
        attendeePrice: createData.attendeePrice,
      };

      createBooking.mutate(payload, {
        onSuccess: () => onSuccess(`${label} "${payload.title || "Sin título"}" creado.`),
        onError,
      });
    }
  };

  return { isOpen, setIsOpen, editing, openCreate, openEdit, handleSave, bookingType, isSaving, isEditMode };
};
