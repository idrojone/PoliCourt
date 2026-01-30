import type { CreateRentalDTO, UpdateRentalDTO } from "@/features/types/booking";
import type { Booking } from "@/features/types/booking";
import type { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

type MutationOptions = {
  onSuccess?: (data: unknown) => void;
  onError?: (error: AxiosError<{ message: string }>) => void;
};

interface UseRentalFormLogicParams {
  createRental: {
    mutate: (payload: CreateRentalDTO, options?: MutationOptions) => void;
    isPending: boolean;
  };
  updateRental?: {
    mutate: (params: { slug: string; payload: UpdateRentalDTO }, options?: MutationOptions) => void;
    isPending: boolean;
  };
}

/**
 * Hook específico para el manejo del formulario de RENTAL (alquiler).
 * A diferencia del booking genérico, rental NO tiene title, description ni type.
 * Soporta tanto creación como edición.
 */
export const useRentalFormLogic = ({
  createRental,
  updateRental,
}: UseRentalFormLogicParams) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Booking | null>(null);

  const isEditMode = !!editing;
  const isSaving = createRental.isPending || (updateRental?.isPending ?? false);

  const openCreate = () => {
    setEditing(null);
    setIsOpen(true);
  };

  const openEdit = (b: Booking) => {
    setEditing(b);
    setIsOpen(true);
  };

  const handleSave = (formData: CreateRentalDTO | UpdateRentalDTO) => {
    const onSuccess = (msg: string) => {
      setIsOpen(false);
      setEditing(null);
      toast.success(msg);
    };

    const onError = (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message || "Error al procesar el alquiler.");
    };

    if (isEditMode && editing && updateRental) {
      // Modo actualización: solo enviar campos modificables
      const payload: UpdateRentalDTO = {
        startTime: formData.startTime,
        endTime: formData.endTime,
      };

      updateRental.mutate(
        { slug: editing.slug, payload },
        {
          onSuccess: () => onSuccess("Alquiler actualizado exitosamente."),
          onError,
        }
      );
    } else {
      // Modo creación
      const payload: CreateRentalDTO = {
        courtSlug: (formData as CreateRentalDTO).courtSlug?.trim() || "",
        organizerUsername: (formData as CreateRentalDTO).organizerUsername?.trim() || "",
        startTime: formData.startTime,
        endTime: formData.endTime,
      };

      createRental.mutate(payload, {
        onSuccess: () => onSuccess("Alquiler creado exitosamente."),
        onError,
      });
    }
  };

  return { isOpen, setIsOpen, editing, openCreate, openEdit, handleSave, isSaving, isEditMode };
};
