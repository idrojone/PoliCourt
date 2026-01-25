import type { Court } from "@/features/types/court/Court";
import type { CreateCourtDTO } from "@/features/types/court/CreateCourtDTO";
import type { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

type MutationOptions<T> = {
  onSuccess?: (data: any) => void;
  onError?: (error: AxiosError<{ message: string }>) => void;
};

export const useCourtFormLogic = (
  createCourt: (
    payload: CreateCourtDTO,
    options?: MutationOptions<CreateCourtDTO>,
  ) => void,
  updateCourt: (
    variables: { slug: string; payload: Partial<CreateCourtDTO> },
    options?: MutationOptions<{
      slug: string;
      payload: Partial<CreateCourtDTO>;
    }>,
  ) => void,
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Court | null>(null);

  const openCreate = () => {
    setEditing(null);
    setIsOpen(true);
  };

  const openEdit = (c: Court) => {
    setEditing(c);
    setIsOpen(true);
  };

  const handleSave = async (formData: CreateCourtDTO) => {
    // We can use the schema for parsing and cleaning too
    const payload: CreateCourtDTO = {
      ...formData,
      name: formData.name.trim(),
      locationDetails: formData.locationDetails.trim(),
      imgUrl: formData.imgUrl?.trim() || "",
    };

    const onSuccess = (msg: string) => {
      setIsOpen(false);
      setEditing(null);
      toast.success(msg);
    };

    const onError = (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message || "Error al guardar la pista.");
    };

    if (editing) {
      updateCourt(
        { slug: editing.slug, payload },
        {
          onSuccess: () => onSuccess(`Pista "${payload.name}" actualizada.`),
          onError,
        },
      );
    } else {
      createCourt(payload, {
        onSuccess: () => onSuccess(`Pista "${payload.name}" creada.`),
        onError,
      });
    }
  };

  return { isOpen, setIsOpen, editing, openCreate, openEdit, handleSave };
};
