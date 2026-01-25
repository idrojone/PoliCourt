import type { CreateSportDTO } from "@/features/types/sport/CreateSportDTO";
import type { Sport } from "@/features/types/sport/Sport";
import type { SportMutationOptions } from "@/features/types/sport/SportMutationOptions";
import type { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

export const useSportFormLogic = (
  createSport: (
    payload: CreateSportDTO,
    options?: SportMutationOptions<CreateSportDTO>,
  ) => void,
  updateSport: (
    variables: { slug: string; payload: Partial<CreateSportDTO> },
    options?: SportMutationOptions<{
      slug: string;
      payload: Partial<CreateSportDTO>;
    }>,
  ) => void,
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Sport | null>(null);

  const openCreate = () => {
    setEditing(null);
    setIsOpen(true);
  };

  const openEdit = (s: Sport) => {
    setEditing(s);
    setIsOpen(true);
  };

  const handleSave = (formData: CreateSportDTO) => {
    const payload: CreateSportDTO = {
      name: formData.name.trim(),
      description: formData.description?.trim() || "",
      imgUrl: formData.imgUrl?.trim() || "",
    };

    const onSuccess = (msg: string) => {
      setIsOpen(false);
      setEditing(null);
      toast.success(msg);
    };

    const onError = (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message || "Error al guardar");
    };

    if (editing) {
      updateSport(
        { slug: editing.slug, payload },
        {
          onSuccess: () => onSuccess(`Deporte "${payload.name}" actualizado.`),
          onError,
        },
      );
    } else {
      createSport(payload, {
        onSuccess: () => onSuccess(`Deporte "${payload.name}" creado.`),
        onError,
      });
    }
  };

  return { isOpen, setIsOpen, editing, openCreate, openEdit, handleSave };
};
